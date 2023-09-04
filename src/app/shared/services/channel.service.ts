import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Channel } from 'src/app/models/channel.model';
import { Message } from 'src/app/models/message.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  channelName!: string;
  description!: string;
  channelsCollection!: AngularFirestoreCollection<Channel>;
  createdDate = new Date().getTime();
  message!: string;

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
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
      this.description,
      channelId,
      this.createdDate
    );
    this.firestore
      .collection('channels')
      .doc(channelId)
      .set(channel.channelToJSON());
    this.clearInput();
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
    const createdDate = new Date().getTime();
    const channelMessage = new Message(
      message,
      messageID,
      createdDate,
      messagedAuthor
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
}
