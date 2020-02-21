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

  public appPages: Array<Pages>;
  public Name: string;
  public userLang = null;
  selectedTheme: String;
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
  ){}

  public ReloadLang() {
    this.storage.get('session_storage').then((res)=>{
      var self = this;

      // init the list of pages 
      if (res != null){
        this.translate.use(res.language).subscribe(langObj => {
          // here the translate service is ready
          self.appPages[0].title = self.translate.instant('APP.MENU')
          self.appPages[1].title = self.translate.instant('APP.EDITPROFILE')
          self.appPages[2].title = self.translate.instant('APP.SETTINGS')
          self.appPages[3].title = self.translate.instant('SETTINGS.LEAVE')
          self.appPages[4].title = self.translate.instant('APP.ABOUT')
        })
      }
    });
  }


  private initTranslate(userLang) {
    var self = this;

    // init the list of pages 
    this.translate.use(userLang).subscribe(langObj => {
      // here the translate service is ready
      self.appPages = [
        { title: self.translate.instant('APP.MENU'),  url: '/home-results' , icon:'home'},
        { title: self.translate.instant('APP.EDITPROFILE'),  url: '/edit-profile' , icon:'create'},
        { title: self.translate.instant('APP.SETTINGS'),  url: '/settings' , icon:'cog'},
        { title: self.translate.instant('SETTINGS.LEAVE'),  url: '/' , icon:'log-out'},
        { title: self.translate.instant('APP.ABOUT'),  url: '/about' , icon:'information-circle-outline'}
      ];
    })
  }

  ngOnInit(){
    this.platform.ready().then(() => {
      let alertTitle
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.storage.get('session_storage').then((res)=>{
        if(res == null){
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
              this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
                if(data.success){
                    res.user_id = data.result.user_id,
                    res.email = data.result.email,
                    res.username = data.result.username,
                    res.language = this.userLang
                  this.storage.set('session_storage', res)
                }
              }, error => {
                this.translate.get('ERROR.NOSERVER').subscribe(
                  value => {
                    alertTitle = value;
                  }
                )
                this.presentToast(alertTitle);
                this.router.navigate(['/']);
              });
              this.router.navigate(['/home-results']);
            } else {
              this.translate.get('ERROR.NODATA').subscribe(
                value => {
                  alertTitle = value;
                }
              )
              this.presentToast(alertTitle);
              this.router.navigate(['/']);
            }
          } else {
            this.translate.get('ERROR.NOSERVER').subscribe(
              value => {
                alertTitle = value;
              }
            )
            this.presentToast(alertTitle);
            this.router.navigate(['/']);
          }
        }
        this.initTranslate(this.userLang)
      });
    }).catch(() => {});
  }

  ngOnDestroy(){
    this.Name= ""
  }

  async presentToast(message) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

}


