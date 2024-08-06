import { environment } from '../environments/environment';

//Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

//Firebase
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

//Material Design
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatBadgeModule } from '@angular/material/badge';

//Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SendResetMailComponent } from './components/send-reset-mail/send-reset-mail.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { HomeComponent } from './components/home/home.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { ChannelComponent } from './components/channel/channel.component';
import { AddChannelDialogComponent } from './components/side-menu/add-channel-dialog/add-channel-dialog.component';
import { AddUsersDialogComponent } from './components/side-menu/add-channel-dialog/add-users-dialog/add-users-dialog.component';
import { SearchComponent } from './components/search/search.component';
import { AddMemberDialogComponent } from './components/channel/add-member-dialog/add-member-dialog.component';
import { MembersDialogComponent } from './components/channel/members-dialog/members-dialog.component';
import { ChooseAvatarComponent } from './components/choose-avatar/choose-avatar.component';
import { MemberDetailsComponent } from './components/channel/members-dialog/member-details/member-details.component';
import { EditMemberComponent } from './components/profile/logout-dialog/profile-dialog/edit-member/edit-member.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LogoutDialogComponent } from './components/profile/logout-dialog/logout-dialog.component';
import { ProfileDialogComponent } from './components/profile/logout-dialog/profile-dialog/profile-dialog.component';
import { ChannelDetailsDialogComponent } from './components/channel/channel-details-dialog/channel-details-dialog.component';
import { DirectMessagesComponent } from './components/direct-messages/direct-messages.component';
import { ThreadsComponent } from './components/channel/threads/threads.component';
import { NewMessageComponent } from './components/new-message/new-message.component';
import { DialogErrorLoginComponent } from './components/dialog-error-login/dialog-error-login.component';
import { DialogChangeSuccessPasswordComponent } from './components/dialog-change-success-password/dialog-change-success-password.component';
import { DialogSendResetMailSuccessComponent } from './components/dialog-send-reset-mail-success/dialog-send-reset-mail-success.component';
import { DialogSuccessSignUpMessageComponent } from './components/dialog-success-sign-up-message/dialog-success-sign-up-message.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    SendResetMailComponent,
    ResetPasswordComponent,
    HomeComponent,
    SideMenuComponent,
    ChannelComponent,
    AddChannelDialogComponent,
    AddUsersDialogComponent,
    SearchComponent,
    AddMemberDialogComponent,
    MembersDialogComponent,
    ChooseAvatarComponent,
    MemberDetailsComponent,
    EditMemberComponent,
    ProfileComponent,
    LogoutDialogComponent,
    ProfileDialogComponent,
    ChannelDetailsDialogComponent,
    DirectMessagesComponent,
    ThreadsComponent,
    NewMessageComponent,
    DialogErrorLoginComponent,
    DialogChangeSuccessPasswordComponent,
    DialogSendResetMailSuccessComponent,
    DialogSuccessSignUpMessageComponent,
  ],
  imports: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    AngularFireModule.initializeApp(environment.firebase),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCheckboxModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatListModule,
    MatFormFieldModule,
    PickerModule,
    MatMenuModule,
    MatButtonModule,
    MatTooltipModule,
    MatSidenavModule,
    MatBadgeModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
