 // IMPORTS //
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
   // VARIABLES //
  public themeCover = 'assets/img/ionic4-Start-Theme-cover.png';

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public activeRoute:ActivatedRoute,
    public loadingService: LoadingService,
    public toastCtrl: ToastController,
    public dataService:DataService,
    public translate: TranslateService,
    private router: Router,
    private platform: Platform,
    private storage: Storage,
    private postPvdr: PostProvider
  ) {}

  // VARIABLES //
  public buttonDisabled1 = true
  public buttonDisabled2 = true
  public buttonDisabled3 = true
  public buttonDisabled4 = true
  public Questions = {}
  public Learning = {}

  // ON PAGE INIT //
  async ngOnInit() {
    // START LOADER //
    this.loadingService.loadingPresent();
    // CHECK SCRIPT VERSION //
    this.checkVersion()
  }

  ionViewDidEnter() {
    // CHECK IF WE NEED TO UPDATE APP //
    this.shouldUpdate()
  }

  // CHECK IF WE NEED TO UPDATE APP //
  shouldUpdate() {
    this.storage.get('session_storage').then((res)=>{
      //IF WE NEED TO UPDATE
      if (res.update) {
        // START LOADER //
        this.loadingService.loadingPresent();
        // SINCE NGONINIT COMES FIRST THAN VIEWDIDENTER, WE WILL SET UPDATE TO FALSE (OTHERWISE, WE WOULD UPDATE APP 2X)
        res.update = false
        this.storage.set('session_storage',res)
        //LOAD DATA
        this.loadData()
      }
    })
  }

  async checkVersion() {
    // UPDATE INFO INFO WHEN PAGE INIT //
    let result = null
    let body = {
      aksi: 'getVersions'
    };
    console.log("POST 1")
    this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{ 
      result = data.result
    },error => {
      result = null
      this.translate.get('ERROR.NOSERVER').subscribe(
        value => this.presentToast(value)
      )
    })
    this.storage.get('session_storage').then((res)=>{
      // CHECK VERSION //
      if (JSON.stringify(res.version) != JSON.stringify(result) && result != null) {
        res.version = result
        res.update = true
      } else {
        res.update = false
      }
      // SAVE UPDATE STATE //
      this.storage.set('session_storage',res)
      //LOAD DATA //
      this.loadData()
    })
  }

  disableButtons(result) {
    if (result['question_category'] == 1) {
      this.buttonDisabled2 = false
    } else if (result['question_category'] == 2) {
      this.buttonDisabled4 = false
    } else if (result['question_category'] == 3) {
      this.buttonDisabled3 = false
    }
  }

  // LOAD DATA FUNCTION //
  async loadData() {
    // VARIABLES //
    this.buttonDisabled1 = true
    this.buttonDisabled2 = true
    this.buttonDisabled3 = true
    this.buttonDisabled4 = true
    this.Questions = {}
    this.Learning = {}
    // WHEN DEVICE READY //
    this.platform.ready().then(() => {
      // DECLARATION OF OBJECTS //
      let alertTitle
      // DEFINE OBJECT "body" TO GET THE QUESTIONS FROM SERVER API //
      let body
      this.storage.get('session_storage').then((res)=>{
        if (res.email && res.username && res.questions && res.learning && res.language && !res.update) {
          for (let i = 0; i < Object.keys(res.questions).length; i++) {
            this.disableButtons(res.questions[i])
          }
          if (Object.keys(res.questions).length >= 1) {
            this.buttonDisabled1 = false
          }
          // DISMISS LOADER //
          this.loadingService.loadingDismiss();
          // BUT, BECAUSE WE HAVE LOCAL DATA, WE ALLOW TO USE THE APP //
          return
        }else {
          // POST TO SERVER API //
          console.log("POST 2")
          body = {
            email : res.email,
            lang: res.language,
            aksi: 'getQuestions'
          };
          this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
            if(data.success){
              for (let i = 0; i < data.result.length; i++) {
                this.Questions[i] = data.result[i]
                this.disableButtons(data.result[i])
              }
              // DEFINE OBJECT "body" TO GET THE LEARNING INFO FROM SERVER API //
              body = {
                email: res.email,
                lang: res.language,
                aksi: 'getLearning'
              };
              // POST TO SERVER API //
              console.log("POST 3")
              this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
                if(data.success){
                  for (let i = 0; i < data.result.length; i++) {
                    this.Learning[i] = data.result[i]
                  }
                  // GET LOCAL DATA //
                  res.questions = this.Questions
                  res.learning = this.Learning
                  // UPDATES "res" OBJECT WITH FRESH INFO //
                  this.buttonDisabled1 = false
                  this.storage.set('session_storage',res)
                  // DISMISS LOADER //
                  this.loadingService.loadingDismiss();
                }else if (!data.success){
                  this.loadingService.loadingDismiss();
                }
              });
            }else if (!data.success){
              this.buttonDisabled2 = true
              this.buttonDisabled3 = true
              this.buttonDisabled4 = true
              this.loadingService.loadingDismiss();
            }
          },error => 
          {
            // IF WE HAVE LOCAL DATA //
            if (res.email && res.username && res.questions && res.learning && res.language) {
              for (let i = 0; i < Object.keys(res.questions).length; i++) {
                this.disableButtons(res.questions[i])
              }
              if (Object.keys(res.questions).length >= 1) {
                this.buttonDisabled1 = false
              }
              // DISMISS LOADER //
              this.loadingService.loadingDismiss();
              // SHOW ERROR NOTIFICATION //
              this.translate.get('ERROR.NOSERVER').subscribe(
                value => this.presentToast(value)
              )
              // BUT, BECAUSE WE HAVE LOCAL DATA, WE ALLOW TO USE THE APP //
              return
            }else {
                // IF NOT, SHOW ERROR NOTIFICATION //
                this.translate.get('ERROR.NOSERVER').subscribe(
                  value => this.presentToast(value)
                )
              // DISMISS LOADER //
              this.loadingService.loadingDismiss();
              // GO TO LOGIN PAGE //
              this.router.navigateByUrl('/');
            }
          })
        }
      })
    }).catch(() => {
    });
  }

  // WHEN VIEW WILL ENTER //
  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  // GOTOQUIZZ FUNCTION //
  goToQuizz() {
    this.router.navigateByUrl('quizz');
  }

  // GOTORIMES FUNCTION //
  goToRimes() {
    this.router.navigateByUrl('rimes');
  }

  // GOTOSPEECH FUNCTION //
  goToSpeech() {
    this.router.navigateByUrl('speech');
  }

  // PRESENT IMAGE FUNCTION //
  async presentImage(image: any) {
    const modal = await this.modalCtrl.create({
      component: ImagePage,
      componentProps: { value: image }
    });
    return await modal.present();
  }

  // PRESENTTOAST FUNCTION //
  async presentToast(message) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

}


