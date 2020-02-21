import { Injectable } from '@angular/core'; 
import { LoadingController } from '@ionic/angular'; 
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  isLoading = false;
  constructor(
    public loadingController: LoadingController,
    public translate: TranslateService,
  ) 
  { } 

  async loadingPresent() {
    let alert
    this.translate.get('API.PLEASE_WAIT').subscribe(
        value => {
            alert = value;
        }
      )
    this.isLoading = true;
    return await this.loadingController.create({
      message: alert,
      spinner: 'crescent' 
    }).then(a => {
      a.present().then(() => {
        console.log('loading presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort laoding'));
        }
      });
    });
  }

  async loadingDismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => console.log('loading dismissed'));
  }
}