import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { DirectMessagesService } from 'src/app/shared/services/direct-messages.service';

@Component({
  selector: 'app-add-users-dialog',
  templateUrl: './add-users-dialog.component.html',
  styleUrls: ['./add-users-dialog.component.scss'],
})
export class AddUsersDialogComponent implements OnInit {
  certainPeople!: string;
  selectedOption!: string;
  userInput!: string;
  allUsers!: Observable<any[]>;
  selectedUsers: string[] = [];

  constructor(
    private dialogRef: MatDialogRef<AddUsersDialogComponent>,
    private firestore: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public channelService: ChannelService,
    private directMessagesService: DirectMessagesService
  ) {}

  ngOnInit() {
    const channelId = this.data.channelId;
    console.log('Channel ID:', channelId);
    this.allUsers = this.directMessagesService.getAllUsers();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  addUsers() {
    if (this.selectedOption === 'allMembers') {
      const channelId = this.data.channelId;
      this.getUserAndAddItToChannel(channelId);
    } else if (this.selectedOption === 'certainPeople') {
      const channelId = this.data.channelId;
      this.addSelectedUsersToChannel(channelId);
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

  selectUser(userName: string) {
    if (!this.selectedUsers.includes(userName)) {
      this.selectedUsers.push(userName);
    }
  }

  addSelectedUsersToChannel(channelId: string) {
    this.selectedUsers.forEach((userName) => {
      this.firestore
        .collection('users', (ref) => ref.where('displayName', '==', userName))
        .get()
        .subscribe((querySnapshot) => {
          const batch = this.firestore.firestore.batch(); 
          const channelRef = this.firestore
            .collection('channels')
            .doc(channelId).ref;

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
              console.log(`Benutzer ${userName} wurde zum Kanal hinzugefügt.`);
              if (
                this.selectedUsers.indexOf(userName) ===
                this.selectedUsers.length - 1
              ) {
                console.log(
                  'Alle ausgewählten Benutzer wurden zum Kanal hinzugefügt.'
                );
                this.dialogRef.close();
              }
            })
            .catch((error) => {
              console.error(
                `Fehler beim Hinzufügen von Benutzer ${userName} zum Kanal:`,
                error
              );
            });
        });
    });
  }
}
