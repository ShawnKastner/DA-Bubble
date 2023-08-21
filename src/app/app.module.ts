import { environment } from '../environments/environment';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Firebase
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

//Imports
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

//Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SendResetMailComponent } from './components/send-reset-mail/send-reset-mail.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { HomeComponent } from './components/home/home.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    SendResetMailComponent,
    ResetPasswordComponent,
    HomeComponent,
    SideMenuComponent,
  ],
  imports: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    AngularFireModule.initializeApp(environment.firebase),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
