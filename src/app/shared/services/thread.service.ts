import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class ThreadService {
  currentMessage!: any;

  constructor(private firestore: AngularFirestore) {}

  /**
   * The `async createThreadChat(currentChannelId: string, messageId: string)` method is responsible for creating a thread
   * chat for a specific message in a channel.
   * 
   * @async
   * @method
   * @name createThreadChat
   * @kind method
   * @memberof ThreadService
   * @param {string} currentChannelId
   * @param {string} messageId
   * @returns {Promise<void>}
   */
  async createThreadChat(currentChannelId: string, messageId: string) {
    const threadExists = await this.checkIfThreadExists(
      currentChannelId,
      messageId
    );

    if (!threadExists) {
      try {
        const currentMessage = await this.getCurrentMessage(
          currentChannelId,
          messageId
        );
        await this.firestore
          .collection('channels')
          .doc(currentChannelId)
          .collection('messages')
          .doc(messageId)
          .collection('threads')
          .doc(messageId)
          .set(currentMessage);

        console.log('Thread erfolgreich erstellt', currentMessage);
      } catch (error) {
        console.error('Fehler beim Erstellen des Thread-Chats:', error);
      }
    } else {
      console.log('Ein Thread für diese Nachricht existiert bereits.');
    }
  }

  /**
   * The `async checkIfThreadExists(` method is responsible for checking if a thread exists for a specific message in a
   * channel. It takes in the `currentChannelId` and `messageId` as parameters and returns a promise that resolves to a
   * boolean value indicating whether the thread exists or not.
   * 
   * @async
   * @method
   * @name checkIfThreadExists
   * @kind method
   * @memberof ThreadService
   * @param {string} currentChannelId
   * @param {string} messageId
   * @returns {Promise<boolean>}
   */
  async checkIfThreadExists(
    currentChannelId: string,
    messageId: string
  ): Promise<boolean> {
    try {
      const threadSnapshot = await this.firestore
        .collection('channels')
        .doc(currentChannelId)
        .collection('messages')
        .doc(messageId)
        .collection('threads')
        .doc(messageId)
        .get()
        .toPromise();

      if (threadSnapshot && threadSnapshot.exists) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Fehler beim Überprüfen des Thread-Status:', error);
      return false;
    }
  }

  /**
   * The `async getCurrentMessage(` method is responsible for retrieving the current message from the Firestore database. It
   * takes in the `currentChannelId` and `messageId` as parameters and returns a promise that resolves to the data of the
   * message. It first retrieves the document snapshot of the message using the `get()` method, and then checks if the
   * snapshot exists. If it exists, it returns the data of the message. If it doesn't exist, it throws an error indicating
   * that the message does not exist.
   * 
   * @async
   * @method
   * @name getCurrentMessage
   * @kind method
   * @memberof ThreadService
   * @param {string} currentChannelId
   * @param {string} messageId
   * @returns {Promise<any>}
   */
  async getCurrentMessage(
    currentChannelId: string,
    messageId: string
  ): Promise<any> {
    try {
      const messageSnapshot = await this.firestore
        .collection('channels')
        .doc(currentChannelId)
        .collection('messages')
        .doc(messageId)
        .get()
        .toPromise();

      if (messageSnapshot && messageSnapshot.exists) {
        return messageSnapshot.data();
      } else {
        throw new Error('Nachricht existiert nicht');
      }
    } catch (error) {
      console.error('Fehler beim Abrufen der Nachricht:', error);
      throw error;
    }
  }
}
