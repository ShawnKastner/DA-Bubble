import { Injectable, NgZone } from '@angular/core';
import { User } from '../services/user';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import {
  Auth,
  authState,
  getAuth,
  signInAnonymously,
} from '@angular/fire/auth';
import { take } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; // Save logged in user data
  currentUser$ = authState(this.auth);

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    private auth: Auth
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }
  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData(result.user);
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['home']);
          }
        });
      })
      .catch((error) => {
        console.log('Fehler beim Login', error);
      });
  }
  // Sign up with email/password
  async SignUp(email: string, password: string, displayName: string) {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      if (result.user) {
        await result.user.updateProfile({ displayName: displayName });
        await this.SetUserData(result.user); // Warte auf die Speicherung der Benutzerdaten
        this.router.navigate(['chooseAvatar']);
      }
    } catch (error) {
      console.log('Fehler beim Registrieren', error);
    }
  }
  // Sign In as Guest
  guestSignIn() {
    return this.afAuth
      .signInWithEmailAndPassword('gast@gast.de', 'gast123456')
      .then((result) => {
        this.SetUserData(result.user);
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['home']);
          }
        });
      })
      .catch((error) => {
        console.log('Fehler:', error);
      });
  }

  // Send email verfificaiton when new user sign up
  // SendVerificationMail() {
  //   return this.afAuth.currentUser
  //     .then((u: any) => u.sendEmailVerification())
  //     .then(() => {
  //       this.router.navigate(['verify-email-address']);
  //     });
  // }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
        this.router.navigate(['/']);
      })
      .catch((error) => {
        window.alert(error);
      });
  }
  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }
  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    userRef
      .valueChanges()
      .pipe(take(1))
      .subscribe((existingUserData) => {
        const userData: User = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Gast',
          emailVerified: user.emailVerified,
          avatar: existingUserData?.avatar || '',
          activeState: 'Active',
        };

        userRef.set(userData, { merge: true });
      });
  }
  // Sign out
  SignOut() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.uid) {
      const userRef: AngularFirestoreDocument<any> = this.afs.doc(
        `users/${user.uid}`
      );
      userRef
        .update({ activeState: 'Offline' })
        .then(() => {
          this.afAuth.signOut().then(() => {
            localStorage.removeItem('user');
            this.router.navigate(['/']);
          });
        })
        .catch((error) => {
          console.log('Fehler beim Aktualisieren des activeState:', error);
        });
    } else {
      this.afAuth.signOut().then(() => {
        localStorage.removeItem('user');
        this.router.navigate(['/']);
      });
    }
  }
}
