// IMPORTS //
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { NgZone } from '@angular/core';
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
    }
    else {
      this.goToHome()
    }
  }
  // START FUNCTION (ACTIVATE SPEECH API)//
  async Start(){
    this.buttonDisabled = true
    if (this.hasPermission())
      {
        this.speech.stopListening();
        await this.listen()
        let header = "Ohh... Tenta novamente!"
        let msg = "Ajuda: <br> A Primeira letra é um <b>"+ this.Correct[0]+"<b/>";
        if (this.Output == this.Correct) {
          this.index++
          this.corrects++
          header = "Parabéns! Está certo!"
          msg = "Clica OK para ir para a próxima questão";
        }
        this.presentAlertResult(header, msg)
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

    }
  }

  // DEVICE GETPERMISSION PROMISE //
  async getPermission():Promise<void> {
    try {
      this.speech.requestPermission();
    } catch(e) {

    }
  }

  // DEVICE LISTEN METHOD//
  listen(): void {
    this.toggleListenMode();
    let _this = this;

    this.speech.startListening()
      .subscribe(matches => {
        _this.zone.run(() => {
          this.Output = matches[0];
        })
      }, error => console.error(error));

  }

  // TOGGLE LISTED MODE METHOD //
  toggleListenMode():void { 
    this.isListening = this.isListening ? false : true;
  }
    // ALERT FUNCTION //
    async presentAlertResult(header, msg) {
      const alert = await this.alertController.create({
        header: header,
        animated: true,
        message: msg,
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.Fill()
            }
          }
        ]
      });
      await alert.present();
      //this.goToHome()
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
