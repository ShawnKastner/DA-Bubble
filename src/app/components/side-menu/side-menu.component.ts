import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddChannelDialogComponent } from './add-channel-dialog/add-channel-dialog.component';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { Observable } from 'rxjs';
import { Channel } from 'src/app/models/channel.model';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
  allChannels!: any[];
  channels: Observable<Channel[]> | undefined;

  constructor(
    private dialog: MatDialog,
    public channelService: ChannelService
  ) {}

  ngOnInit() {
    this.channels = this.channelService.getAllChannels();
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
}
