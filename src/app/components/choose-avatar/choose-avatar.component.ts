import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-choose-avatar',
  templateUrl: './choose-avatar.component.html',
  styleUrls: ['./choose-avatar.component.scss'],
})
export class ChooseAvatarComponent implements OnInit {
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
  showSelectedProfileImage: File | null = null;
  currentUserName!: string | null;
  userID!: string;

  constructor(
    private storage: AngularFireStorage,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userID = user.uid;
        this.currentUserName = user.displayName;
      }
    });
  }

  /**
   * The `selectAvatar(avatarSrc: string)` method is a function that is called when a user selects an avatar from the list.
   * It takes the `avatarSrc` parameter, which represents the source of the selected avatar image.
   *
   * @method
   * @name selectAvatar
   * @kind method
   * @memberof ChooseAvatarComponent
   * @param {string} avatarSrc
   * @returns {void}
   */
  selectAvatar(avatarSrc: string) {
    this.selectedAvatarFromList = avatarSrc;
  }

  /**
   * The `updateAvatar()` method is responsible for updating the user's avatar in the application. It first checks if the
   * user is authenticated. If the user is authenticated, it retrieves the user's ID and generates a unique avatar path using
   * the current timestamp and the user's ID.
   *
   * @method
   * @name updateAvatar
   * @kind method
   * @memberof ChooseAvatarComponent
   * @returns {void}
   */
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
    this.router.navigateByUrl('/');
  }

  /**
   * The `updateProfileImage(event: any)` method is a function that is triggered when a user selects an image file for their
   * profile picture. It takes an event parameter, which represents the event that triggered the method (in this case, the
   * file selection event).
   *
   * @method
   * @name updateProfileImage
   * @kind method
   * @memberof ChooseAvatarComponent
   * @param {any} event
   * @returns {void}
   */
  updateProfileImage(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedProfileImage = selectedFile;
        this.showSelectedProfileImage = e.target.result;
        // Hier können Sie zusätzlichen Code ausführen, um das ausgewählte Bild oben anzuzeigen oder anderweitig zu verarbeiten.
        // dataURL enthält die Daten-URL, die Sie verwenden können, wenn Sie die Daten-URL-Version des Bildes benötigen.
      };
      reader.readAsDataURL(selectedFile);
    }
  }
}
