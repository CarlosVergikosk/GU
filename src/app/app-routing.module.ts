import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '',             loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'register',     loadChildren: './pages/register/register.module#RegisterPageModule' },
  { path: 'about',        loadChildren: './pages/about/about.module#AboutPageModule' },
  { path: 'settings',     loadChildren: './pages/settings/settings.module#SettingsPageModule' },
  { path: 'edit-profile', loadChildren: './pages/edit-profile/edit-profile.module#EditProfilePageModule' },
  { path: 'home-results', loadChildren: './pages/home-results/home-results.module#HomeResultsPageModule' },
  { path: 'quizz',        loadChildren: './pages/quizz/quizz.module#QuizPageModule' },
  { path: 'rimes',        loadChildren: './pages/rimes/rimes.module#RimesPageModule' },
  { path: 'speech',       loadChildren: './pages/speech/speech.module#SpeechPageModule' },
  { path: 'app',          loadChildren: './app.module#AppModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})

export class AppRoutingModule {}
