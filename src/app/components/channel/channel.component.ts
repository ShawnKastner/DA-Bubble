import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { AddMemberDialogComponent } from './add-member-dialog/add-member-dialog.component';
import { MembersDialogComponent } from './members-dialog/members-dialog.component';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
})
export class ChannelComponent implements OnInit {
  currentChannelID!: string;
  currentChannel!: any;
  allMessages!: any;
  memberNumber!: Number;
  isMembersDialogOpen = false;

  constructor(
    public channelService: ChannelService,
    private route: ActivatedRoute,
    public authService: AuthService,
    private dialog: MatDialog,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.currentChannelID = params['id'];
      this.getCurrentChannel();
      this.getChannelMessages();
      this.getMemberNumber();
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
        this.currentChannel = data;
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
  getChannelMessages() {
    this.channelService
      .getAllMessages(this.currentChannelID)
      .subscribe((data) => {
        this.allMessages = data;
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
        channelName: this.currentChannel.channelName,
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

  openShowMembersDialog() {
    this.dialog.open(MembersDialogComponent, {
      data: {
        channelID: this.currentChannelID,
        channelName: this.currentChannel.channelName,
      },
      panelClass: 'show-members-dialog',
    });
    this.isMembersDialogOpen = true;

    this.dialog.afterAllClosed.subscribe(() => {
      this.isMembersDialogOpen = false;
    });
  }
}
