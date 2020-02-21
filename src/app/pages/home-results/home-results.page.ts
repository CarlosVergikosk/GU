import { Component } from '@angular/core';
import { NavController,AlertController,MenuController,ToastController,PopoverController,ModalController,Platform,LoadingController } from '@ionic/angular';
import { ActivatedRoute }  from '@angular/router';
import { ImagePage } from './../modal/image/image.page';
import { DataService } from 'src/app/data.service.';
import { Router } from '@angular/router';
import { Storage } from '@ionic/Storage';
import { PostProvider } from 'src/providers/post-provider';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-home-results',
  templateUrl: './home-results.page.html',
  styleUrls: ['./home-results.page.scss']
})
export class HomeResultsPage {
  themeCover = 'assets/img/ionic4-Start-Theme-cover.png';
  id = null;
  language = null;
  username = null;
  Name: string;
  email = null;
  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    private platform: Platform,
    public loadingCtrl: LoadingController,
    private router: Router,
    public modalCtrl: ModalController,
    public activeRoute:ActivatedRoute,
    public loadingService: LoadingService,
    public toastCtrl: ToastController,
    public dataService:DataService,
    public translate: TranslateService,
    private storage: Storage,
    private postPvdr: PostProvider
  ) {}

  ngOnInit() {
    this.loadData()
  }

  async loadData() {
    this.platform.ready().then(() => {
      let alertTitle
      let Questions = {}
      let Learning = {}
      this.loadingService.loadingPresent();
      let body = {
        aksi: 'getQuestions'
      };
      this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
        if(data.success){
          for (let i = 0; i < data.result.length; i++) {
            Questions[i] = data.result[i]
          }
        }
      },error => 
      {
        this.storage.get('session_storage').then((res)=>{
          if (res.email && res.username && res.questions && res.learning && res.language) {
            res.user_id = res.user_id
            res.email = res.email
            res.username = res.username
            res.language = res.language
            res.questions = res.questions
            res.learning = res.learning
            this.storage.set('session_storage',res)
            this.translate.get('ERROR.NOSERVER').subscribe(
              value => {
                alertTitle = value;
              }
            )
            this.loadingService.loadingDismiss();
            this.presentToast(alertTitle)
            return
          }else {
            this.translate.get('ERROR.NOSERVER').subscribe(
              value => {
                alertTitle = value;
              }
            )
            this.loadingService.loadingDismiss();
            this.presentToast(alertTitle)
            this.router.navigateByUrl('/');
          }
        })
      })
      body = {
        aksi: 'getLearning'
      };
      this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
        if(data.success){
          for (let i = 0; i < data.result.length; i++) {
            Learning[i] = data.result[i]
          }
          this.storage.get('session_storage').then((res)=>{
            res.user_id = res.user_id
            res.email = res.email
            res.username = res.username
            res.language = res.language
            res.questions = Questions
            res.learning = Learning
            this.storage.set('session_storage',res)
          })
          this.loadingService.loadingDismiss();
        }
      });
    }).catch(() => {
      console.log("error")
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  goToQuizz() {
    this.router.navigateByUrl('quizz');
  }

  goToRimes() {
    this.router.navigateByUrl('rimes');
  }

  goToSpeech() {
    this.router.navigateByUrl('speech');
  }

  async presentImage(image: any) {
    const modal = await this.modalCtrl.create({
      component: ImagePage,
      componentProps: { value: image }
    });
    return await modal.present();
  }

  async presentToast(message) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

}


