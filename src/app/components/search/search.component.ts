import { Component } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Channel } from 'src/app/models/channel.model';
import { Message } from 'src/app/models/message.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  searchText: string = '';
  searchResults: any[] = [];

  constructor(private firestore: AngularFirestore) {}

  search() {
    const searchTerm = this.searchText.toLowerCase();

    this.searchResults = [];

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
              });
            });
        });
      });
  }

  clearSearchInput() {
    this.searchText = '';
  }
}
