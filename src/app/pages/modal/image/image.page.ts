import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Learning } from 'src/app/interfaces/pages';
import { Storage } from '@ionic/Storage';

@Component({
  selector: 'app-image',
  templateUrl: './image.page.html',
  styleUrls: ['./image.page.scss'],
})
export class ImagePage implements OnInit {
  @Input() value: any;
  public image: any;
  public appLearning: Array<Learning>;
  constructor(
    private modalCtrl: ModalController,
    private storage: Storage
  ) {}

  ngOnInit() {
    //this.image = this.sanitizer.bypassSecurityTrustStyle(this.value);
    this.storage.get('session_storage').then((res)=>{
      this.appLearning = [{ header: res.learning[0].page_header, text: res.learning[0].page_text, image: res.learning[0].page_image}]
      for (let i = 1; i < Object.keys(res.learning).length; i++) {
        this.appLearning.push({ header: res.learning[i].page_header, text: res.learning[i].page_text, image: res.learning[i].page_image})
      }
    })
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
