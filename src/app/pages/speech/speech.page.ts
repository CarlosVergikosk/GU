import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';

@Component({
  selector: 'app-speech',
  templateUrl: './speech.page.html',
  styleUrls: ['./speech.page.scss'],
})

export class SpeechPage {
  Questions=[
    
    { Question: 'Cão rima com: ?',
      true: '4'
    },
    { Question: 'Sal rima com: ?',
      true: '2'
    },
    { Question: 'Bola rima com: ?',
      true: '3' 
    },

  ]
  corrects = 0
  index = 0
  indexMax = this.Questions.length
  Question
  Image
  FirstOption
  SecondOption
  ThirdOption
  FourthOption
  Correct
  options
  buttonDisabled = false

  constructor(private router: Router, public alertController: AlertController, private speechRecognition: SpeechRecognition) {

  }

  Start(index){
    this.buttonDisabled = false
    this.Question     = this.Questions[index].Question
    this.Correct      = this.Questions[index].true
  }

  ngOnInit(){
    let options
    //this.Start(this.index)
    this.speechRecognition.isRecognitionAvailable().then((available: boolean) => console.log(available))

    // Start the recognition process
    this.speechRecognition.startListening(options).subscribe(
      (matches: string[]) => console.log(matches),
        (onerror) => console.log('error:', onerror)
      )

    // Stop the recognition process (iOS only)
    this.speechRecognition.stopListening()

    // Get the list of supported languages
    this.speechRecognition.getSupportedLanguages().then((languages: string[]) => console.log(languages),(error) => console.log(error))

    // Check permission
    this.speechRecognition.hasPermission().then((hasPermission: boolean) => console.log(hasPermission))

    // Request permissions
    this.speechRecognition.requestPermission().then(() => console.log('Granted'),() => console.log('Denied'))
  }

  Response(ionicButton){ 
    this.buttonDisabled = true;
    if (this.Correct == ionicButton.el.id){
      ionicButton.color =  'success';
      this.corrects = this.corrects + 1
      this.delay(1000).then(any => {
        ionicButton.color =  'light'; 
      }); 
    }else if (this.Correct != ionicButton.el.id){
      ionicButton.color =  'danger';
      this.delay(1000).then(any => {
        ionicButton.color =  'light';
      }); 
    }
    this.index = this.index + 1
    if (this.index < this.indexMax){
      this.delay(1000).then(any => {
        this.Start(this.index)
      }); 
    }else{
      this.delay(1000).then(any => {
        this.presentAlertConfirm()
      }); 
    }
    
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Parabéns!',
      animated: true,
      message: 'Acertaste <strong>' + this.corrects + '/' + this.index + '</strong> perguntas!',
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
