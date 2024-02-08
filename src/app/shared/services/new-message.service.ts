import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ChannelService } from './channel.service';
import { AuthService } from './auth.service';
import { Message } from 'src/app/components/_core/models/message.model';
import { Observable, map } from 'rxjs';
import { DirectMessagesService } from './direct-messages.service';

@Injectable({
  providedIn: 'root',
})
export class NewMessageService {
  newMessageText: string = '';
  selectedChannel: string = '';
  selectedName: string = '';
  nameInput: string = '';

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private channelService: ChannelService,
    private directMessageService: DirectMessagesService
  ) {}

  async sendMessage() {
    const messageID = this.firestore.createId();
    const messagedAuthor = this.authService.userData.displayName;
    const avatar = await this.channelService.getCurrentAvatar();
    const createdDate = new Date().getTime();

    if (this.newMessageText.trim() !== '' && this.selectedChannel) {
      this.ifSelectedChannel(messageID, createdDate, messagedAuthor, avatar);
    }

    if (this.newMessageText.trim() !== '' && this.selectedName) {
      const message = this.newMessageText;
      const selectedChatId = localStorage.getItem('currentChatId');

      if (message && selectedChatId) {
        this.directMessageService
          .addChatMessage(selectedChatId, message)
          .subscribe(() => {});
        this.newMessageText = '';
        this.nameInput = '';
      }
    }
  }

  selectChannel(channel: string) {
    this.selectedChannel = channel;
  }

  selectName(name: string) {
    this.selectedName = name;

    this.findChatIdByDisplayName(this.selectedName).subscribe((chatId) => {
      if (chatId) {
        localStorage.setItem('currentChatId', chatId);
      } else {
        console.log('Keine ID vorhanden');
      }
    });
  }

  findChatIdByDisplayName(displayName: string): Observable<string | null> {
    const chatsCollection = this.firestore.collection('chats');

    return chatsCollection.snapshotChanges().pipe(
      map((changes) => {
        for (const change of changes) {
          const chatData = change.payload.doc.data();
          const usersArray = chatData.users;

          if (Array.isArray(usersArray) && usersArray.length === 2) {
            const user1 = usersArray[0];
            const user2 = usersArray[1];
            if (
              user1.displayName === displayName ||
              user2.displayName === displayName
            ) {
              return change.payload.doc.id;
            }
          }
        }
        console.log('Chat nicht gefunden');
        return null;
      })
    );
  }

  ifSelectedChannel(
    messageID: string,
    createdDate: number,
    messagedAuthor: string,
    avatar: string
  ) {
    const messageData = new Message(
      this.newMessageText,
      messageID,
      createdDate,
      messagedAuthor,
      avatar,
      this.channelService.imageUrl
    );
    this.firestore
      .collection('channels', (ref) =>
        ref.where('channelName', '==', this.selectedChannel).limit(1)
      )
      .get()
      .subscribe((querySnapshot) => {
        if (!querySnapshot.empty) {
          const channelDoc = querySnapshot.docs[0];
          const channelID = channelDoc.id;

          this.firestore
            .collection('channels')
            .doc(channelID)
            .collection('messages')
            .doc(messageID)
            .set(messageData.messageToJSON())
            .then(() => {
              this.newMessageText = '';
            })
            .catch((error) => {
              console.error('Fehler beim Senden der Nachricht:', error);
            });
        }
      });
  }
}
