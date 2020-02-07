import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from "@ngx-translate/core";
import { PopmenuComponent } from './../../components/popmenu/popmenu.component';

import { HomeResultsPage } from './home-results.page';

const routes: Routes = [
  {
    path: '',
    component: HomeResultsPage
  }
];



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HomeResultsPage, PopmenuComponent]
})


export class HomeResultsPageModule {}
