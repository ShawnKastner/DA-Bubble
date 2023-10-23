import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable, map, switchMap, tap } from 'rxjs';
import { privateMessage } from 'src/app/models/private-chat';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { ChatListControlService } from 'src/app/shared/services/chat-list-control.service';
import { DirectMessagesService } from 'src/app/shared/services/direct-messages.service';
import { UsersService } from 'src/app/shared/services/users.service';
import { MemberDetailsComponent } from '../channel/members-dialog/member-details/member-details.component';
import { ProfileDialogComponent } from '../profile/logout-dialog/profile-dialog/profile-dialog.component';
import { TextEditorFunctionsService } from 'src/app/shared/services/text-editor-functions.service';

@Component({
  selector: 'app-direct-messages',
  templateUrl: './direct-messages.component.html',
  styleUrls: ['./direct-messages.component.scss'],
})
export class DirectMessagesComponent implements OnInit, OnDestroy {
  currentUserName!: string;
  currentUserId!: string;
  currentUserAvatar!: string;
  currentUserDetails!: any;
  messageText: string = '';
  myChats$ = this.directMessageService.myChats$;
  messageControl = new FormControl('');
  messages$: Observable<privateMessage[]> | undefined;
  user$ = this.usersService.currentUserProfile$;
  chatId: string = '';
  pickEmoji: boolean = false;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private chatListControlService: ChatListControlService,
    private usersService: UsersService,
    public editorFunctionService: TextEditorFunctionsService,
    public directMessageService: DirectMessagesService,
    public authService: AuthService,
    public channelService: ChannelService
  ) {}

  ngOnDestroy() {
    localStorage.removeItem('currentChatId');
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.currentUserId = params['id'];
      this.getCurrentUser();
    });
    const storedChatId = localStorage.getItem('currentChatId');
    if (storedChatId) {
      this.chatListControlService.chatListControl.setValue([storedChatId]);
      this.chatId = storedChatId;
      this.messages$ = this.directMessageService.getChatMessages$(storedChatId);
    } else {
      this.messages$ =
        this.chatListControlService.chatListControl.valueChanges.pipe(
          map((value) => value[0]),
          tap((chatId) => {
            this.chatId = chatId;
          }),
          switchMap((chatId) =>
            this.directMessageService.getChatMessages$(chatId)
          ),
          tap(() => {})
        );
    }
  }

  /**
   * The `getCurrentUser()` method is responsible for retrieving the current user's details. It takes the `currentUserId` as
   * a parameter and calls the `getCurrentUser()` method from the `directMessageService` to get the user details. The user
   * details are then stored in the `currentUserDetails` property of the component.
   *
   * @method
   * @name getCurrentUser
   * @kind method
   * @memberof DirectMessagesComponent
   * @returns {void}
   */
  getCurrentUser() {
    this.directMessageService
      .getCurrentUser(this.currentUserId)
      .subscribe((user: any) => {
        this.currentUserDetails = user;
      });
  }

  /**
   * The `sendMessage()` method is responsible for sending a private message in the direct messages component. It retrieves
   * the message text from the `messageText` property and the selected chat ID from the `chatListControl` property. If both
   * the message text and chat ID are available, it calls the `addChatMessage()` method from the `directMessageService` to
   * add the message to the selected chat. After sending the message, it clears the `messageText` property.
   *
   * @method
   * @name sendMessage
   * @kind method
   * @memberof DirectMessagesComponent
   * @returns {void}
   */
  sendMessage() {
    const message = this.messageText;
    const selectedChatId = this.chatListControlService.chatListControl.value[0];
    if (message && selectedChatId) {
      this.directMessageService
        .addChatMessage(selectedChatId, message)
        .subscribe(() => {});
      this.messageText = '';
      this.directMessageService.selectedFile = null;
    }
  }

  /**
   * The `isNewDate` method is a helper function that checks if the current message is from a different date than the
   * previous message. It takes in two parameters, `previousMessage` and `currentMessage`, which represent the previous and
   * current messages respectively.
   *
   * @method
   * @name isNewDate
   * @kind method
   * @memberof DirectMessagesComponent
   * @param {any} previousMessage
   * @param {any} currentMessage
   * @returns {boolean}
   */
  isNewDate(previousMessage: any, currentMessage: any): boolean {
    if (!previousMessage) {
      return true;
    }

    const previousDate = new Date(previousMessage.sentDate);
    const currentDate = new Date(currentMessage.sentDate);

    const result =
      previousDate.getFullYear() !== currentDate.getFullYear() ||
      previousDate.getMonth() !== currentDate.getMonth() ||
      previousDate.getDate() !== currentDate.getDate();

    return result;
  }

  /**
   * The `openProfileDetailsDialog()` method is responsible for opening a dialog that displays the details of the current
   * user's profile. It uses the `MatDialog` service from Angular Material to open the dialog. The `MemberDetailsComponent`
   * is used as the content of the dialog, and the `data` property is set to pass the `currentUserDetails` as the memberData
   * to the dialog component. The `panelClass` property is used to apply a custom CSS class to the dialog for styling
   * purposes.
   *
   * @method
   * @name openProfileDetailsDialog
   * @kind method
   * @memberof DirectMessagesComponent
   * @returns {void}
   */
  openProfileDetailsDialog() {
    if (
      this.currentUserDetails.displayName ===
      this.authService.userData.displayName
    ) {
      this.dialog.open(ProfileDialogComponent, {
        data: { profileData: this.currentUserDetails },
        panelClass: 'edit-member-dialog',
      });
    } else {
      this.dialog.open(MemberDetailsComponent, {
        data: { memberData: this.currentUserDetails },
        panelClass: 'member-details-dialog',
      });
    }
  }

  selectEmoji() {
    this.pickEmoji = !this.pickEmoji;
  }

  addEmoji(event: any) {
    this.messageText = `${this.messageText}${event.emoji.native}`;
    this.pickEmoji = false;
  }
}
