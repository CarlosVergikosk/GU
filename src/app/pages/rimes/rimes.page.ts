import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-rimes',
  templateUrl: './rimes.page.html',
  styleUrls: ['./rimes.page.scss'],
})

export class RimesPage {
  Questions=[
    
    { Question: 'Cão rima com: ?',
      Image: 'assets/Rimes/1.png',
      Option1: 'Pau',
      Option2: 'Cima',
      Option3: 'Au',
      Option4: 'Pão',
      true: '4'
    },
    { Question: 'Sal rima com: ?',
      Image: 'assets/Rimes/2.png',
      Option1: 'Balde',
      Option2: 'Cal',
      Option3: 'Sardinha',
      Option4: 'Sarda',
      true: '2'
    },
    { Question: 'Bola rima com: ?',
      Image: 'assets/Rimes/3.png',
      Option1: 'Alguidar',
      Option2: 'Alma',
      Option3: 'Sola',
      Option4: 'Sentar',
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
  buttonDisabled = false

  constructor(private router: Router, public alertController: AlertController) {

  }

  Start(index){
    this.buttonDisabled = false
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
