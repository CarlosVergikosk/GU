import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/app/data.service.';
import { TranslateService } from "@ngx-translate/core";
import { Pages } from 'src/app/interfaces/pages';
import { Storage } from '@ionic/Storage';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  lang = null
  selectedTheme: String;
  public appPages: Array<Pages>;
  constructor(
    public navCtrl: NavController, 
    public dataService:DataService, 
    private translate: TranslateService,
    private storage: Storage
  ) {}
  
  ionViewWillEnter(): void {
    this.storage.get('session_storage').then((res)=>{
      if (res.language != null)
      {
        this.lang = res.language
      }else{
        this.lang = this.translate.getBrowserLang()
        res.language = this.lang
      }
      
      this.storage.set('session_storage',res)
    });
  }

  Logout() {
    this.storage.clear();
    this.navCtrl.navigateRoot('/');
  }

  private initTranslate(language) {
    var self = this;

    // init the list of pages 
    this.translate.use(language).subscribe(langObj => {
      // here the translate service is ready
      self.appPages = [
        { title: self.translate.instant('APP.MENU'),  url: '/home-results' , icon:'home'},
        { title: self.translate.instant('APP.EDITPROFILE'),  url: '/edit-profile' , icon:'create'},
        { title: self.translate.instant('APP.SETTINGS'),  url: '/settings' , icon:'cog'},
        { title: self.translate.instant('APP.ABOUT'),  url: '/about' , icon:'information-circle-outline'}
      ];
    })
  }

  ngOnInit() {
  }

  changeLanguage(language) {
    this.storage.get('session_storage').then((res)=>{
      res.language = language
      this.storage.set('session_storage',res)
    });
    this.initTranslate(language);
  }

}
