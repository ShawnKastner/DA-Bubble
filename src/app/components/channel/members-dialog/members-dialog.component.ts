import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-members-dialog',
  templateUrl: './members-dialog.component.html',
  styleUrls: ['./members-dialog.component.scss'],
})
export class MembersDialogComponent implements OnInit {
  allChannelMembers!: any;

  constructor(
    private dialogRef: MatDialogRef<MembersDialogComponent>,
    private firestore: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.getAllChannelMembers();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  getAllChannelMembers() {
    const channelID = this.data.channelID;
    this.firestore
      .collection('channels')
      .doc(channelID)
      .collection('members')
      .valueChanges()
      .subscribe((data: any) => {
        this.allChannelMembers = data;
        console.log(this.allChannelMembers);
        
      });
  }
}
