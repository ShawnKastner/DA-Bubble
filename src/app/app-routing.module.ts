import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { SendResetMailComponent } from './components/send-reset-mail/send-reset-mail.component';
import { HomeComponent } from './components/home/home.component';
import { ChannelComponent } from './components/channel/channel.component';
import { ChooseAvatarComponent } from './components/choose-avatar/choose-avatar.component';

// route guard
import {
  canActivate,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/auth-guard';
import { DirectMessagesComponent } from './components/direct-messages/direct-messages.component';
import { ThreadsComponent } from './components/channel/threads/threads.component';
import { NewMessageComponent } from './components/new-message/new-message.component';

const redirectToLogin = () => redirectUnauthorizedTo(['']);
const redirectToHome = () => redirectLoggedInTo(['home']);

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: LoginComponent, ...canActivate(redirectToHome) },
  { path: 'signUp', component: SignUpComponent },
  { path: 'forgetPassword', component: ResetPasswordComponent },
  { path: 'sendResetMail', component: SendResetMailComponent },
  { path: 'chooseAvatar', component: ChooseAvatarComponent },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: 'newMessage',
        component: NewMessageComponent
      },
      {
        path: 'channel/:id',
        component: ChannelComponent,
        children: [
          {
            path: 'thread/:id',
            component: ThreadsComponent,
          },
        ],
      },
      {
        path: 'chat/:id',
        component: DirectMessagesComponent,
      },
    ],
    ...canActivate(redirectToLogin),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
