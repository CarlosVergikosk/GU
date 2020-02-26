import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Storage } from '@ionic/Storage';

@Component({
  selector: 'app-quiz',
  templateUrl: './quizz.page.html',
  styleUrls: ['./quizz.page.scss'],
})

export class QuizPage {
  Questions = {}
  corrects = 0
  index = 0
  indexMax
  Question
  Image
  FirstOption
  SecondOption
  ThirdOption
  FourthOption
  Correct
  buttonDisabled = false
  constructor(private router: Router, public alertController: AlertController, private nativeAudio: NativeAudio, private storage: Storage) {

  }

  ngOnInit(){
    this.loadData()
  }

  loadData(){ 
    this.storage.get('session_storage').then((res)=>{
      let idx = 0
      for (let i = 0; i < Object.keys(res.questions).length; i++) {
        if (res.questions[i]['question_category'] == 3) { 
          this.Questions[idx] = res.questions[i]
          this.indexMax = idx
          idx++
        }
      }
      this.Start(0)
    })
    
  }
  
  Start(index){
    this.buttonDisabled = false
    this.Question = this.Questions[index]['question_label']
    this.FirstOption = this.Questions[index]['question_options_1']
    this.SecondOption = this.Questions[index]['question_options_2']
    this.ThirdOption = this.Questions[index]['question_options_3']
    this.FourthOption = this.Questions[index]['question_options_4']
    this.Correct = this.Questions[index]['question_result']
    this.Image = this.Questions[index]['question_image']
    this.nativeAudio.preloadSimple('uniqueId', this.Questions[index]['question_audio'])
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
    if (this.index < this.indexMax){
      this.delay(1000).then(any => {
        this.Start(this.index)
      }); 
    }else{
      this.delay(1000).then(any => {
        this.presentAlertConfirm()
      }); 
    }
    this.index = this.index + 1
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
