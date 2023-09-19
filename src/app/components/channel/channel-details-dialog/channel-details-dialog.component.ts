import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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

  saveChannelName() {
    this.channelService.editChannelName(
      this.data.channelDetails.id,
      this.channelName
    );
    this.data.channelDetails.channelName = this.channelName;
    this.openEditName = !this.openEditName;
  }

  saveChannelDescription() {
    this.channelService.editChannelDescription(
      this.data.channelDetails.id,
      this.channelDescription
    );
    this.data.channelDetails.description = this.channelDescription;
    this.openEditDescription = !this.openEditDescription;
  }
}
