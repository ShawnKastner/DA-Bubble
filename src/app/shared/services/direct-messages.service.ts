import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import {
  DocumentData,
  Timestamp,
  addDoc,
  collection,
  collectionData,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable, concatMap, map, take } from 'rxjs';
import { User } from './user';
import { UsersService } from './users.service';
import { PrivateChat, privateMessage } from 'src/app/models/private-chat';

@Injectable({
  providedIn: 'root',
})
export class DirectMessagesService {
  message!: string;

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private userService: UsersService
  ) {}

  get myChats$(): Observable<PrivateChat[]> {
    const ref = collection(this.firestore.firestore, 'chats');
    return this.userService.currentUserProfile$.pipe(
      concatMap((user) => {
        const myQuery = query(
          ref,
          where('userIds', 'array-contains', user?.['uid'])
        );
        return collectionData(myQuery, { idField: 'id' }).pipe(
          map((chats: DocumentData[]) =>
            this.addChatNameAndPic(
              typeof user?.['uid'] === 'string' ? user?.['uid'] : undefined,
              chats.map((chat) => chat as PrivateChat)
            )
          )
        ) as Observable<PrivateChat[]>;
      })
    );
  }

  /**
   * The `getAllUsers()` method is retrieving all the users from the Firestore collection named 'users'. It returns an
   * Observable that emits an array of unknown objects, representing the user data.
   *
   * @method
   * @name getAllUsers
   * @kind method
   * @memberof DirectMessagesService
   * @returns {Observable<unknown[]>}
   */
  getAllUsers() {
    return this.firestore.collection('users').valueChanges();
  }

  /**
   * The `getCurrentUser(uid: string)` method is retrieving the user data from the Firestore collection named 'users' for a
   * specific user with the given `uid`. It returns an Observable that emits an unknown object representing the user data.
   *
   * @method
   * @name getCurrentUser
   * @kind method
   * @memberof DirectMessagesService
   * @param {string} uid
   * @returns {Observable<unknown>}
   */
  getCurrentUser(uid: string) {
    return this.firestore.collection('users').doc(uid).valueChanges();
  }

  addChatMessage(chatId: string, message: string): Observable<any> {
    const ref = this.firestore
      .collection('chats')
      .doc(chatId)
      .collection('messages');
    const messageId = this.firestore.createId();
    return this.userService.currentUserProfile$.pipe(
      take(1),
      concatMap((user) =>
        ref.doc(messageId).set({
          text: message,
          messageId: messageId,
          senderId: user?.['uid'],
          sentDate: new Date().getTime(),
          displayName: user?.['displayName'],
          avatar: user?.['avatar'],
        })
      )
    );
  }

  getChatMessages$(chatId: string): Observable<privateMessage[]> {
    const ref = collection(
      this.firestore.firestore,
      'chats',
      chatId,
      'messages'
    );
    const queryAll = query(ref, orderBy('sentDate', 'asc'));
    return collectionData(queryAll) as Observable<privateMessage[]>;
  }

  createChat(otherUser: User): Observable<string> {
    const ref = collection(this.firestore.firestore, 'chats'); // Verwende .firestore, um auf die native Firestore-Instanz zuzugreifen
    return this.userService.currentUserProfile$.pipe(
      take(1),
      concatMap((user) =>
        addDoc(ref, {
          userIds: [user?.['uid'], otherUser?.uid],
          users: [
            {
              displayName: user?.['displayName'] ?? '',
              avatar: user?.['avatar'] ?? '',
            },
            {
              displayName: otherUser.displayName ?? '',
              avatar: otherUser?.avatar ?? '',
            },
          ],
        })
      ),
      map((ref) => ref.id)
    );
  }

  isExistingChat(otherUserId: string): Observable<string | null> {
    return this.myChats$.pipe(
      take(1),
      map((chats) => {
        for (let i = 0; i < chats.length; i++) {
          if (chats[i].userIds.includes(otherUserId)) {
            return chats[i].id;
          }
        }

        return null;
      })
    );
  }

  addChatNameAndPic(
    currentUserId: string | undefined,
    chats: PrivateChat[]
  ): PrivateChat[] {
    chats.forEach((chat: PrivateChat) => {
      const otherUserIndex =
        chat.userIds.indexOf(currentUserId ?? '') === 0 ? 1 : 0;
      const { displayName, avatar } = chat.users[otherUserIndex];
      chat.chatName = displayName;
      chat.chatPic = avatar;
    });

    return chats;
  }

  getFormattedTimeFromDateTimestamp(dateTimestamp: Date & Timestamp): string {
    const timestamp = dateTimestamp.toDate().getTime();
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
