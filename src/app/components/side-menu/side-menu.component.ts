import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddChannelDialogComponent } from './add-channel-dialog/add-channel-dialog.component';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { Observable, of, switchMap } from 'rxjs';
import { Channel } from 'src/app/models/channel.model';
import { DirectMessagesService } from 'src/app/shared/services/direct-messages.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'src/app/shared/services/user';
import { ChatListControlService } from 'src/app/shared/services/chat-list-control.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
  channels: Observable<Channel[]> | undefined;
  allUsers!: Observable<any[]>;
  hideChannels = false;
  hideUsers = false;
  userIsMemberMap: { [channelId: string]: boolean } = {};

  constructor(
    private dialog: MatDialog,
    public channelService: ChannelService,
    public directMessagesService: DirectMessagesService,
    public authService: AuthService,
    private directMessageService: DirectMessagesService,
    public chatListControlService: ChatListControlService
  ) {}

  ngOnInit() {
    this.channels = this.channelService.getAllChannels();
    this.allUsers = this.directMessagesService.getAllUsers();
    this.channels.subscribe((channelList) => {
      channelList.forEach((channel) => {
        this.channelService
          .checkIfLoggedUserInChannel(channel.id)
          .subscribe((isMember) => {
            this.userIsMemberMap[channel.id] = isMember;
          });
      });
    });
  }

  /**
   * The `openAddChannelDialog()` method is responsible for opening a dialog box for adding a new channel. It uses the
   * `MatDialog` service from Angular Material to open the dialog box and displays the `AddChannelDialogComponent` component
   * inside it. The `panelClass` property is used to apply a custom CSS class to the dialog box for styling purposes.
   *
   * @method
   * @name openAddChannelDialog
   * @kind method
   * @memberof SideMenuComponent
   * @returns {void}
   */
  openAddChannelDialog() {
    this.dialog.open(AddChannelDialogComponent, {
      panelClass: 'add-channel-dialog',
    });
  }

  /**
   * The `hideChannel()` method is a toggle function that changes the value of the `hideChannels` property. If `hideChannels`
   * is currently `false`, it will be set to `true`, and if it is currently `true`, it will be set to `false`. This method is
   * used to control the visibility of the channels in the side menu.
   *
   * @method
   * @name hideChannel
   * @kind method
   * @memberof SideMenuComponent
   * @returns {void}
   */
  hideChannel() {
    if (this.hideChannels == false) {
      this.hideChannels = true;
    } else {
      this.hideChannels = false;
    }
  }

  /**
   * The `hideUser()` method is a toggle function that changes the value of the `hideUsers` property. If `hideUsers` is
   * currently `false`, it will be set to `true`, and if it is currently `true`, it will be set to `false`. This method is
   * used to control the visibility of the users in the side menu.
   *
   * @method
   * @name hideUser
   * @kind method
   * @memberof SideMenuComponent
   * @returns {void}
   */
  hideUser() {
    if (this.hideUsers == false) {
      this.hideUsers = true;
    } else {
      this.hideUsers = false;
    }
  }

  /**
   * The `createChat(user: User)` method is responsible for creating a chat with a user. It takes a `User` object as a
   * parameter, representing the user with whom the chat will be created.
   *
   * @method
   * @name createChat
   * @kind method
   * @memberof SideMenuComponent
   * @param {User} user
   * @returns {void}
   */
  createChat(user: User) {
    const currentUser = this.authService.userData;

    if (user.uid === currentUser.uid) {
      this.createPrivateChatForCurrentUser(currentUser);
    } else {
      this.directMessageService
        .isExistingChat(user.uid)
        .pipe(
          switchMap((chatId) => {
            if (!chatId) {
              return this.directMessageService.createChat(user);
            } else {
              return of(chatId);
            }
          })
        )
        .subscribe((chatId) => {
          this.chatListControlService.chatListControl.setValue([chatId]);
          localStorage.setItem('currentChatId', chatId);
        });
    }
  }

  /**
   * The `createPrivateChatForCurrentUser(currentUser: User)` method is responsible for creating a private chat for the
   * current user.
   *
   * @method
   * @name createPrivateChatForCurrentUser
   * @kind method
   * @memberof SideMenuComponent
   * @param {User} currentUser
   * @returns {void}
   */
  createPrivateChatForCurrentUser(currentUser: User) {
    const currentUserData: User = {
      uid: currentUser.uid,
      displayName: currentUser.displayName || '',
      avatar: currentUser.avatar || '',
      email: '',
      emailVerified: false,
    };

    const existingChatId = localStorage.getItem('privateChatId');

    if (existingChatId) {
      this.chatListControlService.chatListControl.setValue([existingChatId]);
      localStorage.setItem('currentChatId', existingChatId);
    } else {
      this.directMessageService
        .createChat(currentUserData)
        .subscribe((chatId) => {
          this.chatListControlService.chatListControl.setValue([chatId]);
          localStorage.setItem('currentChatId', chatId);
          localStorage.setItem('privateChatId', chatId);
        });
    }
  }
}
