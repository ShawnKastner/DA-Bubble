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

    selectedUsers.forEach((user) => {
      const userData = {
        displayName: user,
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
