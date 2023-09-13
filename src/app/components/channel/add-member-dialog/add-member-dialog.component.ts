import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { DirectMessagesService } from 'src/app/shared/services/direct-messages.service';

@Component({
  selector: 'app-add-member-dialog',
  templateUrl: './add-member-dialog.component.html',
  styleUrls: ['./add-member-dialog.component.scss'],
})
export class AddMemberDialogComponent implements OnInit {
  currentChannelName!: string;
  currentChannelID!: string;
  allUsers!: Observable<any[]>;
  allChannelMembers!: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: DialogRef<AddMemberDialogComponent>,
    public channelService: ChannelService,
    private directMessageService: DirectMessagesService,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.currentChannelName = this.data.channelName;
    this.currentChannelID = this.data.channelID;
    this.allUsers = this.directMessageService.getAllUsers();
    this.channelService.getAllChannelMembers(this.currentChannelID);
  }

  isUserMember(userDisplayName: string): boolean {
    return this.channelService.allChannelMembers.some((member: any) => member.displayName === userDisplayName);
  }
  
  closeDialog() {
    this.channelService.selectedUsers = [];
    this.dialogRef.close();
  }

  /**
   * The `addUserToChannel()` method is responsible for adding selected users to a channel.
   *
   * @method
   * @name addUserToChannel
   * @kind method
   * @memberof AddMemberDialogComponent
   * @returns {void}
   */
  addUserToChannel() {
    const selectedUsers = this.channelService.selectedUsers;
    const currentChannelID = this.currentChannelID;

    selectedUsers.forEach((userName) => {
      const userData = {
        displayName: userName,
        avatar: this.channelService.userAvatars[userName], // Avatar aus dem Objekt abrufen
      };
      this.firestore
        .collection('channels')
        .doc(currentChannelID)
        .collection('members')
        .add(userData);
    });

    this.closeDialog();
  }
}
