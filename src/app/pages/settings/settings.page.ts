// IMPORTS //
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
  // VARIABLES //
  public lang = null
  public selectedTheme: String;
  public appPages: Array<Pages>;

  constructor(
    public navCtrl: NavController, 
    public dataService:DataService, 
    private translate: TranslateService,
    private storage: Storage
  ) {}
  
  // NEEDS TO BE DECLARED, BUT NEVER USED //
  ngOnInit() {}
  
  // BERFORE VIEW ENTER //
  ionViewWillEnter() {
    // GET LOCAL DATA //
    this.storage.get('session_storage').then((res)=>{
      if (res.language != null)
      {
        // SETS LANGUAGE FROM LOCAL DATA //
        this.lang = res.language
      }else{
        // SETS LANGUAGE FROM DEVICE LANGUAGE//
        this.lang = this.translate.getBrowserLang()
        res.language = this.lang
      }
      // UPDATE LOCAL DATA //
      this.storage.set('session_storage',res)
    });
  }

  // LOGOUT FUNCTION //
  Logout() {
    // CLEAR DATA STORAGE //
    this.storage.clear();
    // GO TO LOGIN PAGE //
    this.navCtrl.navigateRoot('/');
  }

  // START PAGE TRANSLATION //
  private initTranslate(language) {
    var self = this;

    // INIT LIST OF PAGES //
    this.translate.use(language).subscribe(langObj => {
      // HERE THE TRANSLATE SERVICE IS READY //
      self.appPages = [
        { title: self.translate.instant('APP.MENU'),  url: '/home-results' , icon:'home'},
        { title: self.translate.instant('APP.EDITPROFILE'),  url: '/edit-profile' , icon:'create'},
        { title: self.translate.instant('APP.SETTINGS'),  url: '/settings' , icon:'cog'},
        { title: self.translate.instant('APP.ABOUT'),  url: '/about' , icon:'information-circle-outline'}
      ];
    })
  }

  // CHANGELANGUAGE FUNCTION //
  changeLanguage(language) {
    // GET LOCAL DATA //
    this.storage.get('session_storage').then((res)=>{
      // UPDATE LOCAL DATA //
      res.language = language
      res.update = true
      this.storage.set('session_storage',res)
    });
    // INIT TRANSLATE //
    this.initTranslate(language);
  }

}
