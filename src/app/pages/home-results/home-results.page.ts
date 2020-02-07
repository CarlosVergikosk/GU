import { Component } from '@angular/core';
import {NavController,AlertController,MenuController,ToastController,PopoverController,ModalController } from '@ionic/angular';
import { ActivatedRoute }  from '@angular/router';
import { ImagePage } from './../modal/image/image.page';
import { DataService } from 'src/app/data.service.';
import { Router } from '@angular/router';
import { Storage } from '@ionic/Storage';
@Component({
  selector: 'app-home-results',
  templateUrl: './home-results.page.html',
  styleUrls: ['./home-results.page.scss']
})
export class HomeResultsPage {
  themeCover = 'assets/img/ionic4-Start-Theme-cover.png';
  id = null;
  language = null;
  username = null;
  Name: string;
  email = null;
  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    private router: Router,
    public modalCtrl: ModalController,
    public activeRoute:ActivatedRoute,
    public toastCtrl: ToastController,
    public dataService:DataService,
    private storage: Storage
  ) {}

  ngOnInit() {
  }

  ionRouteDataChanged() {}

  ionViewDidEnter(){
    this.storage.get('session_storage').then((res)=>{
      this.id = res.user_id
      this.email = res.email
      this.username = res.username
      this.language = res.language
      this.Name = res.username
      this.storage.set('session_storage',res)
    });
  }
  ionSplitPaneVisible(){}

  ionChange(){}

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  goToQuizz() {
    this.router.navigateByUrl('quizz');
  }

  goToRimes() {
    this.router.navigateByUrl('rimes');
  }

  goToSpeech() {
    this.router.navigateByUrl('speech');
  }

  async presentImage(image: any) {
    const modal = await this.modalCtrl.create({
      component: ImagePage,
      componentProps: { value: image }
    });
    return await modal.present();
  }

}


