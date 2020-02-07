import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

@Component({
  selector: 'app-quiz',
  templateUrl: './quizz.page.html',
  styleUrls: ['./quizz.page.scss'],
})

export class QuizPage {
  Questions=[
    
    { Question: 'Como se chama este animal ?',
      Image: 'assets/Questions/1.png',
      Audio: 'assets/Audio/sound.mp3',
      Option1: 'Cão',
      Option2: 'Coelho',
      Option3: 'Tartaruga',
      Option4: 'Lagarto',
      true: '1'
    },
    { Question: 'Como se chama este animal ?',
      Image: 'assets/Questions/2.png',
      uniqueIdAudio: 'assets/Audio/sound.mp3',
      Option1: 'Leão',
      Option2: 'Águia',
      Option3: 'Dragão',
      Option4: 'Peixe',
      true: '2'
    },
    { Question: 'Como se chama este animal ?',
      Image: 'assets/Questions/3.png',
      uniqueIdAudio: 'assets/Audio/sound.mp3',
      Option1: 'Golfinho',
      Option2: 'Girafa',
      Option3: 'Águia',
      Option4: 'Leão',
      true: '4' 
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
  buttonDisabled = false
  constructor(private router: Router, public alertController: AlertController, private nativeAudio: NativeAudio) {

  }

  Start(index){
    this.buttonDisabled = false
    this.nativeAudio.preloadSimple('uniqueId', 'assets/Audio/sound.mp3')
    this.Question     = this.Questions[index].Question
    this.Image        = this.Questions[index].Image
    this.FirstOption  = this.Questions[index].Option1
    this.SecondOption = this.Questions[index].Option2
    this.ThirdOption  = this.Questions[index].Option3
    this.FourthOption = this.Questions[index].Option4
    this.Correct      = this.Questions[index].true
  }

  ngOnInit(){
    this.Start(this.index)
  }

  Play(){
    this.nativeAudio.play('uniqueId')
  }

  Response(ionicButton){ 
    this.buttonDisabled = true;
    if (this.Correct == ionicButton.el.id){
      ionicButton.color =  'success';
      this.corrects = this.corrects + 1
      this.delay(1000).then(any => {
        ionicButton.color =  'primary'; 
      }); 
    }else if (this.Correct != ionicButton.el.id){
      ionicButton.color =  'danger';
      this.delay(1000).then(any => {
        ionicButton.color =  'primary';
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
