import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import {  NgZone } from '@angular/core';

@Component({
  selector: 'app-speech',
  templateUrl: './speech.page.html',
  styleUrls: ['./speech.page.scss'],
})

export class SpeechPage {
  Questions=[
    
    { Question: 'Cão rima com: ?',
      word: 'Pão'
    },
    { Question: 'Sal rima com: ?',
      word: 'Cal'
    },
    { Question: 'Bola rima com: ?',
      word: 'Bola' 
    },

  ]
  corrects = 0
  index = 0
  indexMax = this.Questions.length
  Question
  Output
  Correct
  buttonDisabled = false
  isListening: boolean = false;
  matches: Array<String>;
  constructor(private router: Router, public alertController: AlertController,  public speech: SpeechRecognition, private zone: NgZone) {

  }

  Start(){
    this.getPermission()
    if (this.hasPermission())
    {
      this.listen()
    }
  }

  ngOnInit(){
    this.buttonDisabled = false
    this.Question     = this.Questions[this.index].Question
    this.Correct      = this.Questions[this.index].word
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

  goToHome() {
    this.router.navigateByUrl('home-results')  
  }

}
