 // IMPORTS //
import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { PostProvider } from 'src/providers/post-provider';
import { Storage } from '@ionic/Storage';
import { DataService } from 'src/app/data.service.';
import { TranslateService } from "@ngx-translate/core";
import { LoadingService } from 'src/app/services/loading.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})

export class EditProfilePage implements OnInit {
  //VARIABLES
  public id: string;
  public email: string;
  public username: string;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private postPvdr: PostProvider,
    private storage: Storage,
    private translate: TranslateService,
    private router: Router,
    public dataService:DataService,
    public alertCtrl: AlertController,
    public loadingService: LoadingService
    
  ){}

 // DECLARED BUT NEVER USED //
  ngOnInit() {}

   // ON PAGE ENTER //
  ionViewWillEnter() {
    let alertTitle
     // GET LOCAL DATA //
    this.storage.get('session_storage').then((res)=>{
      if (res.email && res.username) {
         // IF LOCAL DATA THEN FILL THE FIELDS //
        this.id = res.user_id
        this.email = res.email
        this.username = res.username
      } else {
        // IF NOT, PRESENT ALERT AND GO TO HOME PAGE //
        this.translate.get('ERROR.NOSERVER').subscribe(
          value => {
            alertTitle = value;
          }
        )
        this.presentToast(alertTitle);
        this.navCtrl.navigateForward('/home-results');
      }
    })
  }

  // ON PAGE DESTROY, CLEAN ALL FIELDS //
  ngOnDestroy(){
    this.id = "";
    this.email = "";
    this.username = "";
  }

  // SEND DATA FUNCTION //
  async sendData() {
    let alertTitle
     // IF EMAIL AND USERNAME FIELDS ARE NOT EMPTY //
    if (this.email != "" && this.username != "") {
       // FILL "body" OBJECT WITH FIELD DATA //
      let body = {
        user_id: this.id,
        username: this.username,
        email: this.email,
        password: null,
        aksi: 'update'
      };
       // START LOADER //
      this.loadingService.loadingPresent();
       // POST TO SERVER //
      this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
         // IF GOT ANYTHING BACK FROM SERVER//
        if(data.success){
           // GET LOCAL DATA //
          this.storage.get('session_storage').then((res)=>{
            res.email =  this.email
            res.username =  this.username
            res.update = true
             // UPDATE LOCAL DATA WITH FRESH DATA //
            this.storage.set('session_storage',res)
          })
          this.translate.get('EDIT.DATA_SAVED').subscribe(
            value => {
              alertTitle = value;
            }
          )
           // SHOW SUCCESS NOTIFICATION AND GO TO HOME PAGE //
          this.presentToast(alertTitle);
          this.navCtrl.navigateForward('/home-results');
        }else{
           // IF NOT, SHOW ERROR NOTIFICATION //
          this.translate.get('EDIT.DATA_NOTSAVED').subscribe(
            value => {
              alertTitle = value;
            }
          )
          this.presentToast(alertTitle);
        }
         // DISMISS LOADER //
        this.loadingService.loadingDismiss()
      },error => 
      {
         // ON ERROR, SHOW ERROR NOTIFICATION //
        this.translate.get('ERROR.NOSERVER').subscribe(
          value => {
            alertTitle = value;
          }
        )
        this.presentToast(alertTitle);
         // DISMISS LOADER AND GO TO HOME PAGE //
        this.loadingService.loadingDismiss()
        this.navCtrl.navigateForward('/home-results');
      })
    } else {
       // IF EMPTY, SHOW ERROR NOTIFICATION //
      this.translate.get('ERROR.INVALIDFIELDS').subscribe(
        value => {
          alertTitle = value;
        }
      )
      this.presentToast(alertTitle);
    }
  }
  // NOTIFICATION FUNCTION //
  async presentToast(message) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
}
