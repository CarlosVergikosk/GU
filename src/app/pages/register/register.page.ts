// IMPORTS //
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController, MenuController, LoadingController, Platform } from '@ionic/angular';
import { PostProvider } from 'src/providers/post-provider';
import { Storage } from '@ionic/Storage';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage implements OnInit {
  // VARIABLES //
  public onRegisterForm: FormGroup;
  public username: string = "";
  public email: string = "";
  public password: string = "";
  public confirm_password: string = "";
  public age: Date = null;

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public translate: TranslateService,
    public loadingController: LoadingController,
    private storage: Storage,
    private platform: Platform,
    private postPvdr: PostProvider,
    private formBuilder: FormBuilder
  ) {}

  // ON PAGE ENTER //
  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  // ON PAGE INIT //
  ngOnInit() {
    this.onRegisterForm = this.formBuilder.group({
      // CREATE FORMBUILDER OBJECTS //
      fullName: [],email: [], password: [], age: []
      /*fullName: ['', Validators.compose([
        Validators.required, 
        Validators.pattern('[a-zA-Z]*'), 
        Validators.minLength(5), 
        Validators.maxLength(30)])
      ],
      email: ['', Validators.compose([
        Validators.maxLength(70), 
        Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'), 
        Validators.required])
      ],
      password: ['', Validators.compose([
        Validators.required, 
        Validators.minLength(6), 
        Validators.maxLength(12), 
        Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,12}$')])
      ],
      age: ['', Validators.compose([
        Validators.required
      ]*/
    });
  }

  // REGISTER FUNCTION //
  async prosesRegister(){
    // WHEN DEVICE READY //
    this.platform.ready().then(() => {
      let alertTitle = null
      let registersuccess = null;
      // FILL BODY OBJECT WITH LOCAL DATA //
      let body = {
        username: this.username,
        email: this.email,
        password: this.password,
        age: this.age,
        language: this.translate.getBrowserLang(),
        aksi: 'register'
      };
      // GET TRANSLATION //
      this.translate.get('REGISTER.SUCESSFULL').subscribe(value => {registersuccess = value;}).toString();
      // POST TO SERVER API //
      this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
        let alert = data.msg;
        // IF SUCCESSFULL //
        if(data.success){
          // GET LOCAL DATA //
          this.storage.set('session_storage', body)
          // GO TO LOGIN PAGE //
          this.goToLogin()
          const toast = await this.toastCtrl.create({
            message: registersuccess,
            animated: true,
            color: "success",
            duration: 2000
          });
          // SHOW SUCCESS NOTIFICATION //
          toast.present();
        }else{
          const toast = await this.toastCtrl.create({
            message: alert,
            duration: 2000
          });
          toast.present();
        }
      },error => 
      {
        // IF ANY ERROR HAPPEN //
        this.translate.get('ERROR.NOSERVER').subscribe(
          value => {
            alertTitle = value;
          }
        )
        // NO SERVER CONNECTION NOTIFICATION //
        this.presentToast(alertTitle)
      }) 
    }).catch(() => {});
  }

  // SIGNUP FUNCTION //
  async signUp() {
    var pleasewait = null;
    // GET TRANSLATION //
    this.translate.get('REGISTER.PLEASEWAIT').subscribe(value => {pleasewait = value;}).toString();
    const loading = await this.loadingController.create({
      message: pleasewait,
      spinner: 'bubbles',
      duration: 2000
    });
    // SHOW LOADER //
    await loading.present();
    loading.onWillDismiss().then(() => {
      // WHEN LOADER DISMISS //
      this.navCtrl.navigateRoot('/home-results');
    });
  }

  async presentToast(message) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  goToLogin() {
    this.navCtrl.navigateRoot('/');
  }
}
