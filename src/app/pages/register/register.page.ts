import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController, MenuController, LoadingController } from '@ionic/angular';
import { PostProvider } from 'src/providers/post-provider';
import { Router } from '@angular/router';
import { Storage } from '@ionic/Storage';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public onRegisterForm: FormGroup;
  username: string = "";
  email: string = "";
  password: string = "";
  confirm_password: string = "";
  age: Date = null;

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public loadingController: LoadingController,
    private formBuilder: FormBuilder,
    private router: Router,
    private postPvdr: PostProvider,
    private storage: Storage,
    public translate: TranslateService,
  	public toastCtrl: ToastController
  ) { }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.onRegisterForm = this.formBuilder.group({
      fullName: [],email: [], password: []
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
      ],*/
    });
  }

  async prosesRegister(){
    console.log(this.age)
    let body = {
      username: this.username,
      email: this.email,
      password: this.password,
      age: this.age,
      aksi: 'register'
    };
    var registersuccess = null;
    this.translate.get('REGISTER.SUCESSFULL').subscribe(value => {registersuccess = value;}).toString();
    this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
      var alert = data.msg;
      if(data.success){
        this.router.navigate(['/']);
        const toast = await this.toastCtrl.create({
          message: registersuccess,
          animated: true,
          color: "success",
          duration: 2000
        });
        toast.present();
      }else{
        const toast = await this.toastCtrl.create({
          message: alert,
          duration: 2000
        });
        toast.present();
      }
    });
    let dataObj = {
      "user_id" : null,
      "email" : this.email,
      "username" : null,
      "language" : this.translate.getBrowserLang()
    }
    console.log(dataObj)
    this.storage.set('session_storage', dataObj)
  }

  async signUp() {
    var pleasewait = null;
    this.translate.get('REGISTER.PLEASEWAIT').subscribe(value => {pleasewait = value;}).toString();
    const loading = await this.loadingController.create({
      message: pleasewait,
      spinner: 'bubbles',
      duration: 2000
    });
    await loading.present();
    loading.onWillDismiss().then(() => {
      this.navCtrl.navigateRoot('/home-results');
    });
  }

  // // //
  goToLogin() {
    this.navCtrl.navigateRoot('/');
  }
}
