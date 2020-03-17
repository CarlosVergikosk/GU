// IMPORTS //
import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/Storage';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-rimes',
  templateUrl: './rimes.page.html',
  styleUrls: ['./rimes.page.scss'],
})

export class RimesPage {
  // VARIABLES //
  public Image
  public Correct
  public indexMax
  public Question
  public index = 0
  public ThirdOption
  public FirstOption
  public SecondOption
  public FourthOption
  public corrects = 0
  public Questions = {}
  public buttonDisabled = false

  constructor(
    private router: Router, 
    public alertController: AlertController, 
    private storage: Storage,
    public loadingService: LoadingService
  ) {}

  // ON PAGE INIT //
  ngOnInit(){
    // LOAD DATA //
    this.loadData()
  }

  // LOAD DATA FUNCTION //
  loadData(){ 
    // GET LOCAL DATA //
    this.loadingService.loadingPresent();
    this.storage.get('session_storage').then((res)=>{
      let idx = 0
      for (let i = 0; i < Object.keys(res.questions).length; i++) {
        if (res.questions[i]['question_category'] == 3) { 
          this.Questions[idx] = res.questions[i]
          this.indexMax = idx
          idx++
        }
      }
      this.loadingService.loadingDismiss();
      // START AT INDEX 0 OF THE OBJECT //
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
    this.Image = this.Questions[index]['question_image']
    console.log(this.Questions[index]['question_image'])
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

     // INCREMENT INDEX //
    this.index = this.index + 1
    
  }

  // PRESENT ALERT CONFIRMATION //
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
