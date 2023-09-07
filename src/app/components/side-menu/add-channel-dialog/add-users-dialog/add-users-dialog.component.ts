import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { DirectMessagesService } from 'src/app/shared/services/direct-messages.service';

@Component({
  selector: 'app-add-users-dialog',
  templateUrl: './add-users-dialog.component.html',
  styleUrls: ['./add-users-dialog.component.scss'],
})
export class AddUsersDialogComponent implements OnInit {
  certainPeople!: string;
  selectedOption!: string;
  userInput!: string;
  allUsers!: Observable<any[]>;
  selectedUsers: string[] = [];

  constructor(
    private dialogRef: MatDialogRef<AddUsersDialogComponent>,
    private firestore: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public channelService: ChannelService,
    private directMessagesService: DirectMessagesService
  ) {}

  ngOnInit() {
    const channelId = this.data.channelId;
    console.log('Channel ID:', channelId);
    this.allUsers = this.directMessagesService.getAllUsers();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  /**
   * The `addUsers()` method is responsible for adding users to a channel. It checks the selected option (either 'allMembers'
   * or 'certainPeople') and performs the corresponding action.
   *
   * @method
   * @name addUsers
   * @kind method
   * @memberof AddUsersDialogComponent
   * @returns {void}
   */
  addUsers() {
    if (this.selectedOption === 'allMembers') {
      const channelId = this.data.channelId;
      this.getUserAndAddItToChannel(channelId);
    } else if (this.selectedOption === 'certainPeople') {
      const channelId = this.data.channelId;
      this.addSelectedUsersToChannel(channelId);
    }
  }

  /**
   * The `getUserAndAddItToChannel(channelId: string)` method is responsible for retrieving all users from the Firestore
   * collection and adding them as members to a specific channel.
   * 
   * @method
   * @name getUserAndAddItToChannel
   * @kind method
   * @memberof AddUsersDialogComponent
   * @param {string} channelId
   * @returns {void}
   */
  getUserAndAddItToChannel(channelId: string) {
    const batch = this.firestore.firestore.batch();
    const channelRef = this.firestore.collection('channels').doc(channelId).ref;
    this.getUserCollection().subscribe((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const user: any = doc.data();
        const member = {
          displayName: user.displayName,
        };
        const memberRef = channelRef.collection('members').doc(doc.id);
        batch.set(memberRef, member);
      });
      this.finalizeBatchAndCloseDialog(batch);
    });
  }

  /**
   * The `finalizeBatchAndCloseDialog(batch: any)` method is responsible for committing a batch operation and closing the
   * dialog. It takes a `batch` parameter, which represents the batch operation to be committed.
   * 
   * @method
   * @name finalizeBatchAndCloseDialog
   * @kind method
   * @memberof AddUsersDialogComponent
   * @param {any} batch
   * @returns {void}
   */
  finalizeBatchAndCloseDialog(batch: any) {
    batch
      .commit()
      .then(() => {
        console.log('Alle Benutzer wurden zum Kanal hinzugefügt.');
        this.dialogRef.close();
      })
      .catch((error: any) => {
        console.error('Fehler beim Hinzufügen von Benutzern zum Kanal:', error);
      });
  }

  getUserCollection() {
    return this.firestore.collection('users').get();
  }

  /**
   * The `selectUser(userName: string)` method is used to add a selected user to the `selectedUsers` array. It takes the
   * `userName` as a parameter and checks if the `userName` is not already present in the `selectedUsers` array. If it is not
   * present, it adds the `userName` to the `selectedUsers` array using the `push()` method.
   *
   * @method
   * @name selectUser
   * @kind method
   * @memberof AddUsersDialogComponent
   * @param {string} userName
   * @returns {void}
   */
  selectUser(userName: string) {
    if (!this.selectedUsers.includes(userName)) {
      this.selectedUsers.push(userName);
    }
  }

  /**
   * The `addSelectedUsersToChannel(channelId: string)` method is responsible for adding selected users to a channel. It
   * takes the `channelId` as a parameter and iterates over the `selectedUsers` array. For each selected user, it calls the
   * `getUserByName(userName: string)` method to retrieve the user's data from the Firestore collection. Then, it creates a
   * batch operation using `batch()` and adds the user as a member to the channel by setting the member's data in the
   * `members` subcollection of the channel document. Finally, it calls the `commitBatchAndCloseDialog(userName, batch)`
   * method to commit the batch operation and close the dialog once all selected users have been added to the channel.
   *
   * @method
   * @name addSelectedUsersToChannel
   * @kind method
   * @memberof AddUsersDialogComponent
   * @param {string} channelId
   * @returns {void}
   */
  addSelectedUsersToChannel(channelId: string) {
    this.selectedUsers.forEach((userName) => {
      this.getUserByName(userName).subscribe((querySnapshot) => {
        const batch = this.firestore.firestore.batch();
        const channelRef = this.firestore
          .collection('channels')
          .doc(channelId).ref;
        querySnapshot.forEach((doc) => {
          const user: any = doc.data();
          const member = {
            displayName: user.displayName,
          };
          const memberRef = channelRef.collection('members').doc(doc.id);
          batch.set(memberRef, member);
        });
        this.commitBatchAndCloseDialog(userName, batch);
      });
    });
  }

  /**
   * The `getUserByName(userName: string)` method is used to retrieve user data from the Firestore collection based on the
   * provided `userName`. It takes the `userName` as a parameter and returns an `Observable` that emits a `QuerySnapshot` of
   * the users whose `displayName` matches the provided `userName`. This method is used in the
   * `addSelectedUsersToChannel(channelId: string)` method to fetch the user data for each selected user before adding them
   * as members to the channel.
   *
   * @method
   * @name getUserByName
   * @kind method
   * @memberof AddUsersDialogComponent
   * @param {string} userName
   * @returns {Observable<firebase.firestore.QuerySnapshot<unknown>>}
   */
  getUserByName(userName: string) {
    return this.firestore
      .collection('users', (ref) => ref.where('displayName', '==', userName))
      .get();
  }

  /**
   * The `commitBatchAndCloseDialog(userName: string, batch: any)` method is responsible for committing a batch operation and
   * closing the dialog.
   *
   * @method
   * @name commitBatchAndCloseDialog
   * @kind method
   * @memberof AddUsersDialogComponent
   * @param {string} userName
   * @param {any} batch
   * @returns {void}
   */
  commitBatchAndCloseDialog(userName: string, batch: any) {
    batch
      .commit()
      .then(() => {
        console.log(`Benutzer ${userName} wurde zum Kanal hinzugefügt.`);
        if (
          this.selectedUsers.indexOf(userName) ===
          this.selectedUsers.length - 1
        ) {
          console.log(
            'Alle ausgewählten Benutzer wurden zum Kanal hinzugefügt.'
          );
          this.dialogRef.close();
        }
      })
      .catch((error: any) => {
        console.error(
          `Fehler beim Hinzufügen von Benutzer ${userName} zum Kanal:`,
          error
        );
      });
  }
}
