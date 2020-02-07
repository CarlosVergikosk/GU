import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController, NavParams } from '@ionic/angular';
import { PostProvider } from 'src/providers/post-provider';
import { Storage } from '@ionic/Storage';
import { DataService } from 'src/app/data.service.';
import { TranslateService } from "@ngx-translate/core";

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
    public dataService:DataService
  ){}

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.storage.get('session_storage').then((res)=>{
      let body = {
        username: null,
        email: res.email,
        password: null,
        aksi: 'getData'
      };
      this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
        if(data.success){
          this.id = data.result.user_id 
          this.email = data.result.email
          this.username = data.result.username
          let dataObj = {
            "user_id" : this.id,
            "email" : this.email,
            "username" : this.username,
            "language" : res.lang
          }
          this.dataService.setParamData(dataObj)
        }
      });
      console.log(body)
      this.storage.set('session_storage',res)
    });
  }

  ngOnDestroy(){
    this.id = "";
    this.email = "";
    this.username = "";
  }

  async sendData() {
    let body = {
      user_id: this.id,
      username: this.username,
      email: this.email,
      password: null,
      aksi: 'update'
    };
    this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
      var tipo = null;
      if(data.success){
        //IF CHANGED
        //LOADER
        const loader = await this.loadingCtrl.create({
          duration: 200
        });
        loader.present();
        loader.onWillDismiss().then(async l => {
          //AFTER LOADER DISMISS
          tipo = "success";
          var alerta = "EDIT.DATA_SAVED"
          this.translate.get(alerta).subscribe(
            value => {
              alerta = value;
            }
          )
          const toast = await this.toastCtrl.create({
            message: alerta,
            color: tipo,
            duration: 2000
          });
          toast.present();
          //PASSING DATA
          this.email = this.email
          this.username = this.username
          this.storage.get('session_storage').then((res)=>{
            this.email = res.email
            this.username = res.username
            let dataObj = {
              "user_id" : res.id,
              "email" : this.email,
              "username" : this.username,
              "language" : res.lang
            }
            this.storage.set('session_storage', dataObj);
          });
          //GO HOME
          this.navCtrl.navigateForward('/home-results');
        });
      }else{
        //IF NOT CHANGED
        //NOTIFY
        tipo = "danger";
        var alerta = "EDIT.DATA_NOTSAVED"
          this.translate.get(alerta).subscribe(
            value => {
              alerta = value;
            }
          )
        const toast = await this.toastCtrl.create({
          message: alerta,
          color: tipo,
          duration: 2000
        });
        toast.present();
      }
    })
    console.log(body)
    body = null;
  }
}
