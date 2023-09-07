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
      this.channelService.addSelectedUsersToChannel(channelId);
    }
    this.closeDialog();
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
}
