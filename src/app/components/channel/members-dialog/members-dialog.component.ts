import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { AddMemberDialogComponent } from '../add-member-dialog/add-member-dialog.component';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-members-dialog',
  templateUrl: './members-dialog.component.html',
  styleUrls: ['./members-dialog.component.scss'],
})
export class MembersDialogComponent implements OnInit {
  allChannelMembers!: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<MembersDialogComponent>,
    private firestore: AngularFirestore,
    private dialog: MatDialog,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.getAllChannelMembers();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  /**
   * The `getAllChannelMembers()` method is retrieving all the members of a specific channel from the Firestore database. It
   * uses the `channelID` provided in the `data` object to access the corresponding collection of members in the Firestore
   * database. It then subscribes to the `valueChanges()` observable to receive the data and assigns it to the
   * `allChannelMembers` property. Finally, it logs the `allChannelMembers` to the console.
   * 
   * @method
   * @name getAllChannelMembers
   * @kind method
   * @memberof MembersDialogComponent
   * @returns {void}
   */
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

  /**
   * The `openAddMemberDialog()` method is responsible for opening a dialog box to add a new member to a channel. It closes
   * the current dialog box and opens the `AddMemberDialogComponent` dialog box. It passes the `channelID` and `channelName`
   * as data to the `AddMemberDialogComponent`.
   * 
   * @method
   * @name openAddMemberDialog
   * @kind method
   * @memberof MembersDialogComponent
   * @returns {void}
   */
  openAddMemberDialog() {
    this.closeDialog();
    this.dialog.open(AddMemberDialogComponent, {
      data: {
        channelID: this.data.channelID,
        channelName: this.data.channelName,
      },
      panelClass: 'add-member-dialog',
    });
  
  }
}
