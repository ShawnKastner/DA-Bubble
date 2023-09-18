import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-channel-details-dialog',
  templateUrl: './channel-details-dialog.component.html',
  styleUrls: ['./channel-details-dialog.component.scss'],
})
export class ChannelDetailsDialogComponent implements OnInit {
  channelData!: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private dialogRef: MatDialogRef<ChannelDetailsDialogComponent>,) {}

  ngOnInit() {}

  closeDialog() {
    this.dialogRef.close();
  }
}
