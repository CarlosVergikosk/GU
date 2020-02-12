import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ImagePageModule } from './pages/modal/image/image.module';
import { HttpModule } from '@angular/http';
import { PostProvider } from '../providers/post-provider';
import { IonicStorageModule } from '@ionic/Storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (setTranslateLoader),
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ImagePageModule
  ],
  entryComponents: [],
  providers: [
    StatusBar,
    SplashScreen,
    NativeAudio,
    SpeechRecognition,
    PostProvider,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}

export function setTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
