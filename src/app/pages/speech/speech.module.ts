import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SpeechPage } from 'src/app/pages/speech/speech.page';
import { TranslateModule } from "@ngx-translate/core";
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';

const routes: Routes = [
  {
    path: '',
    component: SpeechPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    SpeechRecognition,
    RouterModule.forChild(routes)
  ],
  providers: [],
  declarations: [SpeechPage]
})
export class SpeechPageModule {}
