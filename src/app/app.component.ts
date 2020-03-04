// IMPORTS //
import { Component } from '@angular/core';
import { Platform, NavController, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Pages } from './interfaces/pages';
import { TranslateService } from "@ngx-translate/core";
import { Router } from '@angular/router';
import { Storage } from '@ionic/Storage';
import { DataService } from 'src/app/data.service.';
import { PostProvider } from 'src/providers/post-provider';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  // VARIABLES //
  public appPages: Array<Pages>;
  public Name: string;
  public userLang = null;
  public selectedTheme: String;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private postPvdr: PostProvider,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private router: Router,
    private storage: Storage,
    public toastCtrl: ToastController,
    public dataService:DataService,
    public navCtrl: NavController
  ) {}

  // UPDATE LANGUAGE IN CASE OF CHANGE //
  public ReloadLang() {
    this.storage.get('session_storage').then((res)=>{
      var self = this;
      if (res != null){
        this.translate.use(res.language).subscribe(langObj => {
          self.appPages[0].title = self.translate.instant('APP.MENU')
          self.appPages[1].title = self.translate.instant('APP.EDITPROFILE')
          self.appPages[2].title = self.translate.instant('APP.SETTINGS')
          self.appPages[3].title = self.translate.instant('APP.ABOUT')
        })
      }
    });
  }

  // START TRANSLATION //
  private initTranslate(userLang) {
    var self = this;
    this.translate.use(userLang).subscribe(langObj => {
      self.appPages = [
        { title: self.translate.instant('APP.MENU'),  url: '/home-results' , icon:'home'},
        { title: self.translate.instant('APP.EDITPROFILE'),  url: '/edit-profile' , icon:'create'},
        { title: self.translate.instant('APP.SETTINGS'),  url: '/settings' , icon:'cog'},
        { title: self.translate.instant('APP.ABOUT'),  url: '/about' , icon:'information-circle-outline'}
      ];
    })
  }

  // ON PAGE INIT //
  ngOnInit(){
    // WHEN PLATFORM IS READY //
    this.platform.ready().then(() => {
      let alertTitle
      // HIDE SPLASHSCREEN AND STATUSBAR //
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // GET LOCAL DATA //
      this.storage.get('session_storage').then((res)=>{
        if(res == null){
          // GO TO LOGIN PAGE BECAUSE THERE'S NO DATA //
          this.router.navigate(['/']);
          this.userLang = this.translate.getBrowserLang()
        }else{
          if (res) {
            if (res.username && res.email) {
              this.userLang = res.language
              let body = {
                username: res.username,
                email: res.email,
                password: null,
                aksi: 'getData'
              };
              // ASK DATA TO DATABASE //
              this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
                if(data.success){
                  // UPDATES "res" OBJECT WITH FRESH DATA //
                  res.user_id = data.result.user_id,
                  res.email = data.result.email,
                  res.username = data.result.username,
                  res.language = this.userLang
                  // UPDATE LOCAL DATA //
                  this.storage.set('session_storage', res)
                }
              }, error => {
                // IF THERE IS ANY ERROR, WE KEEP THE LATEST LOCAL DATA HAVE SAFE //
                this.storage.set('session_storage', res)
              });
              // GO TO HOME PAGE //
              this.router.navigate(['/home-results']);
            } else {
              // IF NO LOCAL USERNAME/EMAIL FOUND (MEANS WE DONT HAVE MUCH DATA TO WORK WITH) //
              this.translate.get('ERROR.NODATA').subscribe(
                value => {
                  alertTitle = value;
                }
              )
              // PRESENT NOTIFICATION //
              this.presentToast(alertTitle);
              // GO TO LOGIN PAGE //
              this.router.navigate(['/']);
            }
          } else {
            // IF NO LOCAL DATA AT ALL //
            this.translate.get('ERROR.NOSERVER').subscribe(
              value => {
                alertTitle = value;
              }
            )
            // PRESENT NOTIFICATION //
            this.presentToast(alertTitle);
            // GO TO LOGIN PAGE //
            this.router.navigate(['/']);
          }
        }
        this.initTranslate(this.userLang)
      });
    }).catch(() => {});
  }

  // ON PAGE DESTROY //
  ngOnDestroy(){
    this.Name= ""
  }

   // PRESENT ALERT FUNCTION //
  async presentToast(message) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

}


