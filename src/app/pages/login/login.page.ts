import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostProvider } from 'src/providers/post-provider';
import { Router } from '@angular/router';
import { Storage } from '@ionic/Storage';
import { NavController, MenuController, ToastController, AlertController, LoadingController, Platform} from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from 'src/app/data.service.';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  public onLoginForm: FormGroup;
  email: string;
  password: string;
  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public translate: TranslateService,
    public loadingCtrl: LoadingController,
    public loadingService: LoadingService,
    private storage: Storage,
    private formBuilder: FormBuilder,
    private router: Router,
    private platform: Platform,
    private statusBar: StatusBar, 
    private postPvdr: PostProvider,
    public dataService:DataService
  ) {}
  
  ionViewWillEnter() {
    this.menuCtrl.enable(false);
    this.statusBar.hide();
  }

  ngOnInit() {
    this.onLoginForm = this.formBuilder.group({
      email: [], password: []
      /*email: ['', Validators.compose([
        Validators.maxLength(70), 
        Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'), 
        Validators.required])
      ],
      password: ['', Validators.compose([
        Validators.required, 
        Validators.minLength(6), 
        Validators.maxLength(12), 
        Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,12}$')])
      ],*/
    });
  }

  ionViewWillLeave() {
    this.email = null
    this.password = null
  }

  async prosesLogin(){
    this.platform.ready().then(() => {
      let alertTitle
      //if(true) {
      if(this.email != "" && this.password != ""){
        let body = {
          email: this.email,
          password: this.password,
          aksi: 'login'
        };
        this.loadingService.loadingPresent();
        this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
          var tipo = null;
          if(data.success){
            tipo = "success";
            let dataObj = { 
              "user_id" : null,
              "email" : this.email,
              "username" : data.result.username,
              "language" : this.translate.getBrowserLang(),
              "questions" : null,
              "learning" : null
            }
            this.storage.set('session_storage', dataObj);
            this.loadingService.loadingDismiss(); 
            this.goToHome()
            data.result = null
          }else{
            var alertpesan = null;
            this.translate.get(data.msg).subscribe(
              value => {
                  alertpesan = value;
              }
            )
            tipo = "danger";
            const toast = await this.toastCtrl.create({
              message: alertpesan,
              color: tipo,
              duration: 2000
            });
            this.loadingService.loadingDismiss(); 
            toast.present();
          }
        },error => 
        {
          this.storage.get('session_storage').then((res)=>{
            if ( res ) {
              if (res.email && res.username) {
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
                this.presentToast(alertTitle);
                this.goToHome()
              } else {
                this.translate.get('ERROR.NODATA').subscribe(
                  value => {
                    alertTitle = value;
                  }
                )
                this.loadingService.loadingDismiss(); 
                this.presentToast(alertTitle);
              }
            } else {
              this.translate.get('ERROR.NODATA').subscribe(
                value => {
                  alertTitle = value;
                }
              )
              this.loadingService.loadingDismiss(); 
              this.presentToast(alertTitle);
            }
          })
        })
      }
    }).catch(() => {});
  }

  

  async forgotPass() {
    var header = null;
    this.translate.get('LOGIN.FORGOTPASSWORD').subscribe(value => {header = value;}).toString();
    var pholder = null;
    this.translate.get('LOGIN.EMAIL').subscribe(value => {pholder = value;}).toString();
    var pcancel = null;
    this.translate.get('LOGIN.CANCEL').subscribe(value => {pcancel = value;}).toString();
    var pconfirm = null;
    this.translate.get('LOGIN.CONFIRM').subscribe(value => {pconfirm  = value;}).toString(); 
    var pmessage = null;
    this.translate.get('LOGIN.PASSWORDMESSAGE').subscribe(value => {pmessage = value;}).toString();
    const alert = await this.alertCtrl.create({
      
      header: header,
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: pholder
        }
      ],
      buttons: [
        {
          text: pcancel,
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: pconfirm,
          handler: async () => {
            const loader = await this.loadingCtrl.create({
              duration: 2000
            });
            loader.present();
            loader.onWillDismiss().then(async l => {
              const toast = await this.toastCtrl.create({
                showCloseButton: true,
                message: pmessage,
                duration: 2000,
                animated: true,
                color: "success",
                position: 'bottom'
              });

              toast.present();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  goToRegister() {
    this.router.navigateByUrl('/register');
  }

  goToHome() {
    this.router.navigateByUrl('home-results')  
  }

  async presentToast(message) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

}
