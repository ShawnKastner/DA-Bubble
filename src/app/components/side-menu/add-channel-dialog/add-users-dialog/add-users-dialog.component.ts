import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DirectMessagesService } from 'src/app/shared/services/direct-messages.service';

@Component({
  selector: 'app-add-users-dialog',
  templateUrl: './add-users-dialog.component.html',
  styleUrls: ['./add-users-dialog.component.scss'],
})
export class AddUsersDialogComponent implements OnInit {
  addAllUser!: string;
  certainPeople!: string;
  selectedOption!: string;

  constructor(
    private dialogRef: MatDialogRef<AddUsersDialogComponent>,
    private firestore: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    const channelId = this.data.channelId;
    console.log('Channel ID:', channelId);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  addUsers() {
    if (this.selectedOption === 'allMembers') {
      const channelId = this.data.channelId;
      this.getUserAndAddItToChannel(channelId);
    }
  }

  getUserAndAddItToChannel(channelId: string) {
    const batch = this.firestore.firestore.batch();
    const channelRef = this.firestore.collection('channels').doc(channelId).ref;
    this.firestore
      .collection('users')
      .get()
      .subscribe((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const user: any = doc.data();
          const member = {
            displayName: user.displayName,
          };
          const memberRef = channelRef.collection('members').doc(doc.id);
          batch.set(memberRef, member);
        });
        batch
          .commit()
          .then(() => {
            console.log('Alle Benutzer wurden zum Kanal hinzugefügt.');
            this.dialogRef.close();
          })
          .catch((error) => {
            console.error(
              'Fehler beim Hinzufügen von Benutzern zum Kanal:',
              error
            );
          });
      });
  }
}
