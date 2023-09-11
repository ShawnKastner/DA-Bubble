import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { Channel } from 'src/app/models/channel.model';
import { Message } from 'src/app/models/message.model';
import { AuthService } from './auth.service';
import { AddUsersDialogComponent } from 'src/app/components/side-menu/add-channel-dialog/add-users-dialog/add-users-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  channelName!: string;
  description!: string;
  channelsCollection!: AngularFirestoreCollection<Channel>;
  createdDate = new Date().getTime();
  message!: string;
  selectedUsers: string[] = [];

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    this.channelsCollection = this.firestore.collection<Channel>('channels');
  }

  /**
   * The `addNewChannel()` method is responsible for creating a new channel in the Firestore database. It generates a unique
   * `channelId` using the `createId()` method provided by AngularFirestore. It then creates a new `Channel` object using the
   * `channelName`, `description`, and `channelId` properties. Finally, it adds the new channel to the Firestore collection
   * named 'channels' by calling the `set()` method on the Firestore document with the `channelId` as the document ID and the
   * `channel.channelToJSON()` method to convert the `Channel` object to a JSON representation.
   *
   * @method
   * @name addNewChannel
   * @kind method
   * @memberof ChannelService
   * @returns {void}
   */
  addNewChannel() {
    const channelId = this.firestore.createId();
    const channel = new Channel(
      this.channelName,
      this.description || '',
      channelId,
      this.createdDate
    );
    this.firestore
      .collection('channels')
      .doc(channelId)
      .set(channel.channelToJSON());
    this.openAddUserDialog(channelId);
    this.clearInput();
  }

  /**
   * The `openAddUserDialog(channelId: string)` method in the `ChannelService` class is responsible for opening a dialog box
   * to add users to a specific channel. It takes a `channelId` parameter, which is the unique identifier of the channel.
   *
   * @method
   * @name openAddUserDialog
   * @kind method
   * @memberof ChannelService
   * @param {string} channelId
   * @returns {void}
   */
  openAddUserDialog(channelId: string) {
    const dialogRef = this.dialog.open(AddUsersDialogComponent, {
      panelClass: 'add-user-dialog',
      data: { channelId: channelId }, // Hier wird die channelId übergeben
    });
  }

  clearInput() {
    this.channelName = '';
    this.description = '';
  }

  /**
   * The `getAllChannels()` method is returning an `Observable` of type `Channel[]`. This method retrieves all the channels
   * from the Firestore database by calling the `valueChanges()` method on the `channelsCollection` property. The
   * `valueChanges()` method returns an `Observable` that emits an array of `Channel` objects whenever there are changes in
   * the Firestore collection.
   *
   * @method
   * @name getAllChannels
   * @kind method
   * @memberof ChannelService
   * @returns {Observable<Channel[]>}
   */
  getAllChannels(): Observable<Channel[]> {
    return this.channelsCollection.valueChanges();
  }

  /**
   * The `getCurrentChannel(channelId: string)` method is used to retrieve the current channel from the Firestore database.
   * It takes a `channelId` parameter, which is the unique identifier of the channel.
   *
   * @method
   * @name getCurrentChannel
   * @kind method
   * @memberof ChannelService
   * @param {string} channelId
   * @returns {Observable<unknown>}
   */
  getCurrentChannel(channelId: string) {
    return this.firestore.collection('channels').doc(channelId).valueChanges();
  }

  /**
   * The `sendMessage` method in the `ChannelService` class is responsible for sending a message to a specific channel in the
   * Firestore database.
   *
   * @method
   * @name sendMessage
   * @kind method
   * @memberof ChannelService
   * @param {string} message
   * @param {string} channelId
   * @returns {void}
   */
  sendMessage(message: string, channelId: string) {
    const messageID = this.firestore.createId();
    const messagedAuthor = this.authService.userData.displayName;
    const uid = this.authService.userData.uid;
    const avatar = '';
    const createdDate = new Date().getTime();
    const channelMessage = new Message(
      message,
      messageID,
      createdDate,
      messagedAuthor,
      avatar
    );
    this.firestore
      .collection('channels')
      .doc(channelId)
      .collection('messages')
      .doc(messageID)
      .set(channelMessage.messageToJSON());
    this.message = '';
  }

  /**
   * The `getAllMessages(channelId: string)` method is used to retrieve all the messages from a specific channel in the
   * Firestore database. It takes a `channelId` parameter, which is the unique identifier of the channel.
   *
   * @method
   * @name getAllMessages
   * @kind method
   * @memberof ChannelService
   * @param {string} channelId
   * @returns {Observable<firebase.firestore.DocumentData[]>}
   */
  getAllMessages(channelId: string) {
    return this.firestore
      .collection('channels')
      .doc(channelId)
      .collection('messages', (ref) => ref.orderBy('createdDate'))
      .valueChanges();
  }

  /**
   * The `getFormattedTimeFromTimestamp(timestamp: number): string` method in the `ChannelService` class is used to format a
   * timestamp into a string representation of time.
   *
   * @method
   * @name getFormattedTimeFromTimestamp
   * @kind method
   * @memberof ChannelService
   * @param {number} timestamp
   * @returns {string}
   */
  getFormattedTimeFromTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  /**
   * The `getFormattedDateFromTimestamp(timestamp: number): string` method in the `ChannelService` class is used to format a
   * timestamp into a string representation of a formatted date.
   *
   * @method
   * @name getFormattedDateFromTimestamp
   * @kind method
   * @memberof ChannelService
   * @param {number} timestamp
   * @returns {string}
   */
  getFormattedDateFromTimestamp(timestamp: number): string {
    const daysOfWeek = [
      'Sonntag',
      'Montag',
      'Dienstag',
      'Mittwoch',
      'Donnerstag',
      'Freitag',
      'Samstag',
    ];
    const months = [
      'Januar',
      'Februar',
      'März',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'Dezember',
    ];

    const date = new Date(timestamp);
    const dayOfWeek = daysOfWeek[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];

    return `${dayOfWeek}, ${dayOfMonth}. ${month}`;
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
        }
      })
      .catch((error: any) => {
        console.error(
          `Fehler beim Hinzufügen von Benutzer ${userName} zum Kanal:`,
          error
        );
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
}
