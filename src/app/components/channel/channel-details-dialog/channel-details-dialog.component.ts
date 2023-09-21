import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ChannelService } from 'src/app/shared/services/channel.service';

@Component({
  selector: 'app-channel-details-dialog',
  templateUrl: './channel-details-dialog.component.html',
  styleUrls: ['./channel-details-dialog.component.scss'],
})
export class ChannelDetailsDialogComponent implements OnInit {
  channelData!: any;
  openEditName = false;
  openEditDescription = false;
  channelName!: string;
  channelDescription!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ChannelDetailsDialogComponent>,
    public channelService: ChannelService,
    private router: Router
  ) {}

  ngOnInit() {
    this.channelName = this.data.channelDetails.channelName;
    this.channelDescription = this.data.channelDetails.description;
  }

  editChannelName() {
    this.openEditName = !this.openEditName;
  }

  editChannelDescription() {
    this.openEditDescription = !this.openEditDescription;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  /**
   * The `saveChannelName()` method is responsible for saving the edited channel name. It calls the `editChannelName()`
   * method from the `channelService` to update the channel name in the database. Then, it updates the `channelName` property
   * in the `data.channelDetails` object with the new name. Finally, it toggles the `openEditName` flag to close the edit
   * name section.
   * 
   * @method
   * @name saveChannelName
   * @kind method
   * @memberof ChannelDetailsDialogComponent
   * @returns {void}
   */
  saveChannelName() {
    this.channelService.editChannelName(
      this.data.channelDetails.id,
      this.channelName
    );
    this.data.channelDetails.channelName = this.channelName;
    this.openEditName = !this.openEditName;
  }

  /**
   * The `saveChannelDescription()` method is responsible for saving the edited channel description. It calls the
   * `editChannelDescription()` method from the `channelService` to update the channel description in the database. Then, it
   * updates the `channelDescription` property in the `data.channelDetails` object with the new description. Finally, it
   * toggles the `openEditDescription` flag to close the edit description section.
   * 
   * @method
   * @name saveChannelDescription
   * @kind method
   * @memberof ChannelDetailsDialogComponent
   * @returns {void}
   */
  saveChannelDescription() {
    this.channelService.editChannelDescription(
      this.data.channelDetails.id,
      this.channelDescription
    );
    this.data.channelDetails.description = this.channelDescription;
    this.openEditDescription = !this.openEditDescription;
  }

  /**
   * The `leaveChannel()` method is a function defined in the `ChannelDetailsDialogComponent` class. It is responsible for
   * handling the logic when a user wants to leave a channel.
   * 
   * @method
   * @name leaveChannel
   * @kind method
   * @memberof ChannelDetailsDialogComponent
   * @returns {void}
   */
  leaveChannel() {
    this.channelService.leaveChannel(this.data.channelDetails.id);
    this.channelService.checkIfLoggedUserInChannel(this.data.channelDetails.id)
    this.closeDialog();
    this.router.navigate(['/home']);
  }
}
