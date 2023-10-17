import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  DocumentData,
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
  currentUserDetails: any;

  constructor(
    private firestore: AngularFirestore,
    private userService: UsersService,
  ) {}

  /**
   * The `get myChats$(): Observable<PrivateChat[]>` is a getter method that returns an Observable of type `PrivateChat[]`.
   * It retrieves the private chats of the current user by querying the Firestore collection named 'chats' and filtering the
   * chats based on the user's ID. It then maps the retrieved chats to add the chat name and profile picture for each chat.
   *
   * @method
   * @name (get) myChats$
   * @kind property
   * @memberof DirectMessagesService
   * @returns {$: Observable<PrivateChat[]>}
   */
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

  /**
   * The `addChatMessage` method is responsible for adding a new message to a specific chat. It takes two parameters:
   * `chatId`, which is the ID of the chat where the message will be added, and `message`, which is the content of the
   * message.
   *
   * @method
   * @name addChatMessage
   * @kind method
   * @memberof DirectMessagesService
   * @param {string} chatId
   * @param {string} message
   * @returns {Observable<any>}
   */
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

  /**
   * The `getChatMessages$` method is retrieving the chat messages for a specific chat ID. It takes the `chatId` parameter of
   * type `string`, which represents the ID of the chat.
   *
   */
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

  /**
   * The `createChat` method is responsible for creating a new chat between the current user and another user. It takes the
   * `otherUser` parameter of type `User`, which represents the other user involved in the chat.
   *
   * @method
   * @name createChat
   * @kind method
   * @memberof DirectMessagesService
   * @param {User} otherUser
   * @returns {Observable<string>}
   */
  createChat(otherUser: User): Observable<string> {
    const ref = collection(this.firestore.firestore, 'chats');
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

  /**
   * The `isExistingChat` method is checking if there is an existing chat between the current user and another user with the
   * given `otherUserId`. It returns an Observable that emits either the chat ID if an existing chat is found, or `null` if
   * no existing chat is found.
   *
   * @method
   * @name isExistingChat
   * @kind method
   * @memberof DirectMessagesService
   * @param {string} otherUserId
   * @returns {Observable<string | null>}
   */
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

  /**
   * The `addChatNameAndPic(` method is responsible for adding the chat name and profile picture to each private chat in the
   * array of chats. It takes the current user's ID and the array of private chats as parameters.
   *
   * @method
   * @name addChatNameAndPic
   * @kind method
   * @memberof DirectMessagesService
   * @param {string | undefined} currentUserId
   * @param {PrivateChat[]} chats
   * @returns {PrivateChat[]}
   */
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
}
