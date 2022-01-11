import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsFeedComponent } from './news-feed/news-feed.component';
import { SingleThreadComponent } from './single-thread/single-thread.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { CommentComponent } from './comment/comment.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AuthGuard } from './interceptors/auth.guard';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'newsfeed', canActivate: [AuthGuard], component: NewsFeedComponent },
  {
    path: 'thread/:threadId',
    canActivate: [AuthGuard],
    component: SingleThreadComponent,
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    component: AccountSettingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
