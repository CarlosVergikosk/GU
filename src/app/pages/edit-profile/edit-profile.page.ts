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
  id: string;
  email: string;
  username: string;

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

  ngOnInit() {
  }

  ionViewWillEnter() {
    let alertTitle
    this.storage.get('session_storage').then((res)=>{
      if (res.email) {
        this.id = res.user_id
        this.email = res.email
        this.username = res.username
      } else {
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

  ngOnDestroy(){
    this.id = "";
    this.email = "";
    this.username = "";
  }

  async sendData() {
    let alertTitle
    if (this.email != "" && this.username != "") {
      
      let body = {
        user_id: this.id,
        username: this.username,
        email: this.email,
        password: null,
        aksi: 'update'
      };
      this.loadingService.loadingPresent();
      this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
        if(data.success){
          this.storage.get('session_storage').then((res)=>{
            res.user_id = res.user_id
            res.email =  this.email
            res.username =  this.username
            res.language = res.language
            res.questions = res.questions
            res.learning = res.learning
            res.offline = res.offline
            this.storage.set('session_storage',res)
          })
          this.translate.get('EDIT.DATA_SAVED').subscribe(
            value => {
              alertTitle = value;
            }
          )
          this.presentToast(alertTitle);
          this.navCtrl.navigateForward('/home-results');
        }else{
          this.translate.get('EDIT.DATA_NOTSAVED').subscribe(
            value => {
              alertTitle = value;
            }
          )
          this.presentToast(alertTitle);
        }
        this.loadingService.loadingDismiss()
      },error => 
      {
        this.translate.get('ERROR.NOSERVER').subscribe(
          value => {
            alertTitle = value;
          }
        )
        this.presentToast(alertTitle);
        this.loadingService.loadingDismiss()
        this.navCtrl.navigateForward('/home-results');
      })
    } else {
      this.translate.get('ERROR.INVALIDFIELDS').subscribe(
        value => {
          alertTitle = value;
        }
      )
      this.presentToast(alertTitle);
    }
  }

  async presentToast(message) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
}
