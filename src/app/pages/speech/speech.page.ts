import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import {  NgZone } from '@angular/core';
import { Storage } from '@ionic/Storage';

@Component({
  selector: 'app-speech',
  templateUrl: './speech.page.html',
  styleUrls: ['./speech.page.scss'],
})

export class SpeechPage {
  Questions = {}
  corrects = 0
  index = 0
  indexMax = 0
  Question
  Image
  Output
  Correct
  buttonDisabled = false
  isListening: boolean = false;
  matches: Array<String>;
  constructor(private router: Router, public alertController: AlertController,  public speech: SpeechRecognition, private zone: NgZone, private storage: Storage) {

  }

  ngOnInit(){
    this.loadData()
  }

  loadData(){ 
    this.storage.get('session_storage').then((res)=>{
      let idx = 0
      for (let i = 0; i < Object.keys(res.questions).length; i++) {
        if (res.questions[i]['question_category'] == 2) { 
          this.Questions[idx] = res.questions[i]
          this.indexMax = idx
          idx++
        }
      }
    })
    this.Fill()
  }

  Fill(){ 
    this.delay(100).then(any => {
      if (this.index <= this.indexMax) {
          this.buttonDisabled = false
          this.Question = this.Questions[this.index]['question_label']
          this.Correct = this.Questions[this.index]['question_result']
          this.Image = this.Questions[this.index]['question_image']
          this.index++
      }
      else {
        this.presentAlertConfirm()
      }
    });
  }

  Start(){
    this.buttonDisabled = true
    if (this.hasPermission())
      {
        this.listen()
        this.corrects++
        this.Fill()
    } else {
        this.getPermission()
        this.Start()
    }
  }

  async hasPermission():Promise<boolean> {
    try {
      const permission = await this.speech.hasPermission();
      return permission;
    } catch(e) {
      console.log(e);
    }
  }

  async getPermission():Promise<void> {
    try {
      this.speech.requestPermission();
    } catch(e) {
      console.log(e);
    }
  }

  listen(): void {
    if (this.isListening) {
      this.speech.stopListening();
      this.toggleListenMode();
      return;
    }

    this.toggleListenMode();
    let _this = this;

    this.speech.startListening()
      .subscribe(matches => {
        _this.zone.run(() => {
          _this.matches = matches;
          this.Output[matches.length] = matches;
        })
      }, error => console.error(error));

  }

  toggleListenMode():void { 
    this.isListening = this.isListening ? false : true;
    console.log('listening mode is now : ' + this.isListening);
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Parabéns!',
      animated: true,
      message: 'Acertaste <strong>' + this.corrects + '/' + ( this.index++) + '</strong> perguntas!',
      buttons: [
        {
          text: 'MENU',
          handler: () => {
            this.goToHome()
          }
        }
      ]
    });

    await alert.present();
  }

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms));
  }

  goToHome() {
    this.router.navigateByUrl('home-results')  
  }

}
