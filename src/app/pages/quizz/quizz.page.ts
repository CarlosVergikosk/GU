// IMPORTS //
import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Storage } from '@ionic/Storage';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quizz.page.html',
  styleUrls: ['./quizz.page.scss'],
})

export class QuizPage {
  // VARIABLES //
  public Questions = {}
  public index = 0
  public corrects = 0
  public Image = null
  public Correct = null
  public indexMax = null
  public Question = null
  public ThirdOption = null
  public FirstOption = null
  public SecondOption = null
  public FourthOption = null
  public buttonDisabled = false

  constructor(
    private router: Router, 
    public alertController: AlertController, 
    private nativeAudio: NativeAudio, 
    private storage: Storage,
    public loadingService: LoadingService
  ) {}

  // ON PAGE INIT //
  ngOnInit(){
    // CALL LOAD DATA FUNCTION //
    this.loadData()
  }

  // LOADDATA FUNCTION //
  loadData(){ 
    // GET LOCAL DATA //
    this.loadingService.loadingPresent();
    this.storage.get('session_storage').then((res)=>{
      let idx = 0
      
      for (let i = 0; i < Object.keys(res.questions).length; i++) {
        // IF QUESTION CATEGORY EQUALS TO 3 //
        if (res.questions[i]['question_category'] == 1) { 
          this.Questions[idx] = res.questions[i]
          this.indexMax = idx
          idx++
        }
      }
      this.loadingService.loadingDismiss();
      // START FROM QUESTION 0 (FIRST IN THE OBJECT)//
      this.Start(0)
    })
  }
  
  // START FUNCTION //
  Start(index){
    this.buttonDisabled = false
    this.Question = this.Questions[index]['question_label']
    this.FirstOption = this.Questions[index]['question_options_1']
    this.SecondOption = this.Questions[index]['question_options_2']
    this.ThirdOption = this.Questions[index]['question_options_3']
    this.FourthOption = this.Questions[index]['question_options_4']
    this.Correct = this.Questions[index]['question_result']
    // LOAD AUDIO SAMPLE //
    this.nativeAudio.preloadSimple('uniqueId', this.Questions[index]['question_audio'])
  }

  // PLAY AUDIO FUNCTION //
  Play(){
    this.nativeAudio.play('uniqueId')
  }

  // RESPONSE FUNCTION //
  Response(ionicButton){ 
    this.buttonDisabled = true;
    // CHECK IF ANSWER IS CORRECT //
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

    // CHECK IF THERE ARE MORE QUESTIONS //
    if (this.index < this.indexMax){
      this.delay(1000).then(any => {
        this.Start(this.index)
      }); 
    }else{
      this.delay(1000).then(any => {
        this.presentAlertConfirm()
      }); 
    }
    // INCREMENT INDEX 1+ //
    this.index = this.index + 1
  }
  

  // PRESENT ALERT FUNCTION //
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

  // DELAY FUNCTION //
  async delay(ms: number) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms));
  }

  // GO TO HOME FUNCTION //
  goToHome() {
    this.router.navigateByUrl('home-results')  
  }

}
