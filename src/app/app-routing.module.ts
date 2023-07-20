import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { SendResetMailComponent } from './components/send-reset-mail/send-reset-mail.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'signUp', component: SignUpComponent },
  { path: 'forgetPassword', component: ResetPasswordComponent },
  { path: 'sendResetMail', component: SendResetMailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
