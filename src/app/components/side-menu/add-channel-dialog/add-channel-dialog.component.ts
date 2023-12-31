import { Component } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { ChannelService } from 'src/app/shared/services/channel.service';

@Component({
  selector: 'app-add-channel-dialog',
  templateUrl: './add-channel-dialog.component.html',
  styleUrls: ['./add-channel-dialog.component.scss'],
})
export class AddChannelDialogComponent {
  constructor(
    private dialogRef: DialogRef<AddChannelDialogComponent>,
    public channelService: ChannelService
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  /**
   * The `addChannel()` method is a function that is called when the user wants to add a new channel. It calls the
   * `addNewChannel()` method from the `channelService` to add the new channel and then closes the dialog.
   *
   * @method
   * @name addChannel
   * @kind method
   * @memberof AddChannelDialogComponent
   * @returns {void}
   */
  addChannel() {
    this.channelService.addNewChannel();
    this.dialogRef.close();
  }
}
