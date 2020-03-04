// IMPORTS //
import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import {  NgZone } from '@angular/core';
import { Storage } from '@ionic/Storage';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-speech',
  templateUrl: './speech.page.html',
  styleUrls: ['./speech.page.scss'],
})

export class SpeechPage {

  // VARIABLES //
  public Questions = {}
  public corrects = 0
  public index = 0
  public indexMax = 0
  public Question
  public Image
  public Output
  public Correct
  public buttonDisabled = false
  public isListening: boolean = false;
  public matches: Array<String>;

 // MODULES //
  constructor(
    private router: Router, 
    private platform: Platform, 
    public alertController: AlertController,  
    public speech: SpeechRecognition, 
    private zone: NgZone, 
    private storage: Storage,
    public loadingService: LoadingService
  ) {}

  // LOAD DATA WHEN DEVICE READY //
  ionViewWillEnter(){
    this.loadData()
  }

  // LOAD DATA FUNCTION //
  loadData(){ 
    this.loadingService.loadingPresent();
    this.storage.get('session_storage').then((res)=>{
      let idx = 0
      for (let i = 0; i < Object.keys(res.questions).length; i++) {
        if (res.questions[i]['question_category'] == 2) { 
          this.Questions[idx] = res.questions[i]
          this.indexMax = idx
          idx++
        }
      }
      this.loadingService.loadingDismiss();
      this.Fill()
    })
  }

  // FILL FORM FUNCTION//
  Fill(){ 
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
  }
  // START FUNCTION (ACTIVATE SPEECH API)//
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

  // DEVICE HASPERMISSION PROMISE //
  async hasPermission():Promise<boolean> {
    try {
      const permission = await this.speech.hasPermission();
      return permission;
    } catch(e) {
      console.log(e);
    }
  }

  // DEVICE GETPERMISSION PROMISE //
  async getPermission():Promise<void> {
    try {
      this.speech.requestPermission();
    } catch(e) {
      console.log(e);
    }
  }

  // DEVICE LISTEN METHOD//
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

  // TOGGLE LISTED MODE METHOD //
  toggleListenMode():void { 
    this.isListening = this.isListening ? false : true;
  }

  // ALERT FUNCTION //
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
    this.goToHome()
  }

  // DELAY FUNCTION //
  async delay(ms: number) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms));
  }

  // GO TO HOME FUNCTION //
  goToHome() {
    this.router.navigateByUrl('home-results')  
  }

}
