import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { AddMemberDialogComponent } from './add-member-dialog/add-member-dialog.component';
import { MembersDialogComponent } from './members-dialog/members-dialog.component';
import { ChannelDetailsDialogComponent } from './channel-details-dialog/channel-details-dialog.component';
import { ThreadService } from 'src/app/shared/services/thread.service';
import { TextEditorFunctionsService } from 'src/app/shared/services/text-editor-functions.service';
import { EmojiService } from 'src/app/shared/services/emoji.service';
import { Subscription, filter, interval } from 'rxjs';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
})
export class ChannelComponent implements OnInit {
  currentChannelID!: string;
  allMessages!: any;
  memberNumber!: Number;
  isMembersDialogOpen = false;
  isChannelDetailsDialogOpen = false;
  currentUserAvatar!: string;
  showElements: boolean = false;
  showEditMessage: boolean = false;
  editMsg: boolean = false;
  showReactionUsers: boolean = false;
  private resizeSubscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private firestore: AngularFirestore,
    private router: Router,
    public authService: AuthService,
    public channelService: ChannelService,
    public threadService: ThreadService,
    public textEditorService: TextEditorFunctionsService,
    public emojiService: EmojiService
  ) {}

  ngOnDestroy() {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.currentChannelID = params['id'];
      this.getCurrentChannel();
      this.getChannelMessages();
      this.getMemberNumber();
      this.channelService.getAllChannelMembers(this.currentChannelID);
    });
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActiveState();
      });
    this.resizeSubscription = interval(500).subscribe(() => {
      this.updateActiveState();
    });
  }

  /**
   * The `getCurrentChannel()` method is retrieving the current channel based on the `currentChannelID` property. It is using
   * the `channelService` to make a request to get the current channel data from the server. Once the data is received, it is
   * assigned to the `currentChannel` property of the component.
   *
   * @method
   * @name getCurrentChannel
   * @kind method
   * @memberof ChannelComponent
   * @returns {void}
   */
  getCurrentChannel() {
    this.channelService
      .getCurrentChannel(this.currentChannelID)
      .subscribe((data) => {
        this.channelService.currentChannel = data;
      });
  }

  /**
   * The `getChannelMessages()` method is retrieving all the messages for the current channel. It is using the
   * `channelService` to make a request to get the messages data from the server. Once the data is received, it is assigned
   * to the `allMessages` property of the component.
   *
   * @method
   * @name getChannelMessages
   * @kind method
   * @memberof ChannelComponent
   * @returns {void}
   */
  async getChannelMessages() {
    this.channelService
      .getAllMessages(this.currentChannelID)
      .subscribe(async (messages) => {
        this.allMessages = messages;
      });
  }

  /**
   * The `isNewDate(previousMessage: any, currentMessage: any): boolean` method is a helper method that checks if the current
   * message has a different date than the previous message. It takes two parameters, `previousMessage` and `currentMessage`,
   * which represent the previous and current messages respectively.
   *
   * @method
   * @name isNewDate
   * @kind method
   * @memberof ChannelComponent
   * @param {any} previousMessage
   * @param {any} currentMessage
   * @returns {boolean}
   */
  isNewDate(previousMessage: any, currentMessage: any): boolean {
    if (!previousMessage) {
      return true;
    }

    const previousDate = new Date(previousMessage.createdDate);
    const currentDate = new Date(currentMessage.createdDate);

    const result =
      previousDate.getFullYear() !== currentDate.getFullYear() ||
      previousDate.getMonth() !== currentDate.getMonth() ||
      previousDate.getDate() !== currentDate.getDate();

    return result;
  }

  /**
   * The `openAddMemberDialog()` method is responsible for opening a dialog box for adding a member to the current channel.
   * It uses the `MatDialog` service from Angular Material to open the dialog. The dialog is an instance of the
   * `AddMemberDialogComponent` component and it receives data about the current channel, such as the channel ID and channel
   * name. The dialog is styled using the `add-member-dialog` CSS class.
   *
   * @method
   * @name openAddMemberDialog
   * @kind method
   * @memberof ChannelComponent
   * @returns {void}
   */
  openAddMemberDialog() {
    this.dialog.open(AddMemberDialogComponent, {
      data: {
        channelID: this.currentChannelID,
        channelName: this.channelService.currentChannel.channelName,
      },
      panelClass: 'add-member-dialog',
    });
  }

  /**
   * The `getMemberNumber()` method is retrieving the number of members in the current channel. It is using the
   * `AngularFirestore` service to make a request to the Firestore database to get the collection of members for the current
   * channel. Once the data is received, it calculates the length of the data array and assigns it to the `memberNumber`
   * property of the component.
   *
   * @method
   * @name getMemberNumber
   * @kind method
   * @memberof ChannelComponent
   * @returns {void}
   */
  getMemberNumber() {
    this.firestore
      .collection('channels')
      .doc(this.currentChannelID)
      .collection('members')
      .valueChanges()
      .subscribe((data) => {
        this.memberNumber = data.length;
      });
  }

  /**
   * The `openShowMembersDialog()` method is responsible for opening a dialog box that displays the members of the current
   * channel. It uses the `MatDialog` service from Angular Material to open the dialog. The dialog is an instance of the
   * `MembersDialogComponent` component and it receives data about the current channel, such as the channel ID and channel
   * name. The dialog is styled using the `show-members-dialog` CSS class. Additionally, it sets the `isMembersDialogOpen`
   * property to `true` when the dialog is opened and sets it back to `false` when the dialog is closed.
   *
   * @method
   * @name openShowMembersDialog
   * @kind method
   * @memberof ChannelComponent
   * @returns {void}
   */
  openShowMembersDialog() {
    this.dialog.open(MembersDialogComponent, {
      data: {
        channelID: this.currentChannelID,
        channelName: this.channelService.currentChannel.channelName,
      },
      panelClass: 'show-members-dialog',
    });
    this.isMembersDialogOpen = true;

    this.dialog.afterAllClosed.subscribe(() => {
      this.isMembersDialogOpen = false;
    });
  }

  /**
   * The `openChannelDetails()` method is responsible for opening a dialog box that displays the details of the current
   * channel. It uses the `MatDialog` service from Angular Material to open the dialog. The dialog is an instance of the
   * `ChannelDetailsDialogComponent` component and it receives data about the current channel, such as the channel details.
   * The dialog is styled using the `channel-details-dialog` CSS class. Additionally, it sets the
   * `isChannelDetailsDialogOpen` property to `true` when the dialog is opened and sets it back to `false` when the dialog is
   * closed.
   *
   * @method
   * @name openChannelDetails
   * @kind method
   * @memberof ChannelComponent
   * @returns {void}
   */
  openChannelDetails() {
    this.dialog.open(ChannelDetailsDialogComponent, {
      panelClass: 'channel-details-dialog',
      data: {
        channelDetails: this.channelService.currentChannel,
      },
    });
    this.isChannelDetailsDialogOpen = true;
    this.dialog.afterAllClosed.subscribe(() => {
      this.isChannelDetailsDialogOpen = false;
    });
  }

  /**
   * The `editMsgInFirestore(messageId: string, message: string)` method is responsible for updating a message in the
   * Firestore database. It takes two parameters: `messageId`, which is the ID of the message to be edited, and `message`,
   * which is the updated message content.
   *
   * @method
   * @name editMsgInFirestore
   * @kind method
   * @memberof ChannelComponent
   * @param {string} messageId
   * @param {string} message
   * @returns {void}
   */
  editMsgInFirestore(messageId: string, message: string) {
    this.channelService.editMessage(this.currentChannelID, messageId, message);
  }

  toggleShowElements(message: any) {
    message.showElements = !message.showElements;
  }

  toggleEditMessage(message: any) {
    message.showEditMessage = !message.showEditMessage;
  }

  toggleReactionPicker(message: any) {
    message.pickEmojiReaction = !message.pickEmojiReaction;
  }

  showUsersWhoReacted(reaction: any) {
    reaction.showUsers = !reaction.showUsers;
  }

  isThreadActive: boolean = false;

  updateActiveState() {
    const url = this.router.url;
    this.isThreadActive = window.innerWidth < 900 && url.includes('/thread');
  }
}
