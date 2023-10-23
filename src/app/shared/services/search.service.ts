import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Channel } from 'src/app/models/channel.model';
import { Message } from 'src/app/models/message.model';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  searchText: string = '';
  searchResults: any[] = [];

  constructor(private firestore: AngularFirestore) {}

  search() {
    const searchTerm = this.searchText.toLowerCase();

    this.searchResults = [];

    this.searchInChannels(searchTerm);
    this.searchInUsers(searchTerm);
  }

  searchInChannels(searchTerm: string) {
    this.firestore
      .collection('channels')
      .get()
      .subscribe((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const channelData = doc.data() as Channel;
          const channelName = channelData.channelName;
          const channelID = channelData.id;

          if (channelName.toLowerCase().includes(searchTerm)) {
            this.searchResults.push({ channelName, channelID });
          }
          this.firestore
            .collection(`channels/${doc.id}/messages`)
            .get()
            .subscribe((messageQuerySnapshot) => {
              messageQuerySnapshot.forEach((messageDoc) => {
                this.subscribeMessageData(
                  messageDoc,
                  searchTerm,
                  channelName,
                  channelID
                );
              });
            });
        });
      });
  }

  subscribeMessageData(
    messageDoc: any,
    searchTerm: string,
    channelName: string,
    channelID: string
  ) {
    const messageData = messageDoc.data() as Message;
    const channelMessage = messageData.channelMessage.toLowerCase();

    if (channelMessage.includes(searchTerm)) {
      this.searchResults.push({
        channelName,
        channelID,
        messagedAuthor: messageData.messagedAuthor,
        channelMessage: messageData.channelMessage,
      });
    }
  }

  searchInUsers(searchTerm: string) {
    this.firestore
      .collection('users')
      .get()
      .subscribe((userQuerySnapshot) => {
        userQuerySnapshot.forEach((userDoc) => {
          const userData = userDoc.data() as User;
          const userName = userData.displayName.toLowerCase();

          if (userName.includes(searchTerm)) {
            this.searchResults.push({
              displayName: userData.displayName,
              userID: userData.uid,
              email: userData.email,
              avatar: userData.avatar,
            });
          }
        });
      });
  }
}
