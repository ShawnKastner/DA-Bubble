import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Timestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Channel } from 'src/app/models/channel.model';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  channelName!: string;
  description!: string;
  channelsCollection!: AngularFirestoreCollection<Channel>;
  createdDate = new Date().getTime();

  constructor(private firestore: AngularFirestore) {
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
    const channel = new Channel(this.channelName, this.description, channelId, this.createdDate);
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
}
