import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-choose-avatar',
  templateUrl: './choose-avatar.component.html',
  styleUrls: ['./choose-avatar.component.scss'],
})
export class ChooseAvatarComponent {
  allAvatars = [
    {
      name: 'avatar0',
      src: 'assets/img/avatars/00c.Charaters.png',
    },
    {
      name: 'avatar1',
      src: 'assets/img/avatars/01c.Charaters.png',
    },
    {
      name: 'avatar2',
      src: 'assets/img/avatars/02c.Charaters.png',
    },
    {
      name: 'avatar3',
      src: 'assets/img/avatars/03c.Charaters.png',
    },
    {
      name: 'avatar4',
      src: 'assets/img/avatars/04c.Charaters.png',
    },
    {
      name: 'avatar5',
      src: 'assets/img/avatars/05c.Charaters.png',
    },
  ];

  selectedAvatarFromList: string | null = null;
  selectedProfileImage: File | null = null;

  constructor(
    private storage: AngularFireStorage,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  selectAvatar(avatarSrc: string) {
    this.selectedAvatarFromList = avatarSrc;
  }

  updateAvatar() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        const userId = user.uid;
        const avatarPath = `avatars/${new Date().getTime()}_${userId}.png`;

        if (this.selectedAvatarFromList) {
          // Wenn ein Avatar aus der Liste ausgewählt wurde, speichere diesen in Firestore
          this.firestore
            .collection('users')
            .doc(userId)
            .update({ avatar: this.selectedAvatarFromList });
        } else if (this.selectedProfileImage) {
          // Wenn ein Profilbild ausgewählt wurde, lade es hoch und speichere den Download-URL in Firestore
          const avatarRef = this.storage.ref(avatarPath);
          this.storage
            .upload(avatarPath, this.selectedProfileImage)
            .snapshotChanges()
            .subscribe(async (snapshot) => {
              if (snapshot && snapshot.state === 'success') {
                // Überprüfung auf snapshot
                const downloadURL = await avatarRef
                  .getDownloadURL()
                  .toPromise();
                this.firestore
                  .collection('users')
                  .doc(userId)
                  .update({ avatar: downloadURL });
              }
            });
        }
      }
    });
  this.router.navigateByUrl('/')
  }
}
