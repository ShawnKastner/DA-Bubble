import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { SendResetMailComponent } from './components/send-reset-mail/send-reset-mail.component';
import { HomeComponent } from './components/home/home.component';
import { ChannelComponent } from './components/channel/channel.component';
import { ChooseAvatarComponent } from './components/choose-avatar/choose-avatar.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'signUp', component: SignUpComponent },
  { path: 'forgetPassword', component: ResetPasswordComponent },
  { path: 'sendResetMail', component: SendResetMailComponent },
  { path: 'chooseAvatar', component: ChooseAvatarComponent },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: ':id',
        component: ChannelComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
