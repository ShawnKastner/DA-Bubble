import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.scss'],
})
export class NewMessageComponent {
  pickEmoji: boolean = false;
  channelNames$: Observable<string[]>;
  userNames$: Observable<string[]>;

  constructor(private firestore: AngularFirestore) {
    // Initialisiere das Observable mit einer leeren Liste
    this.channelNames$ = new Observable<string[]>((observer) => {
      observer.next([]);
    });
    this.userNames$ = new Observable<string[]>((observer) => {
      observer.next([]);
    });
  }

  searchChannels(event: any) {
    const input = event.target.value;
    if (input.includes('#')) {
      this.inputIncludesHash(input);
    } else {
      this.channelNames$ = new Observable<string[]>((observer) => {
        observer.next([]);
      });
    }
    if (input.includes('@')) {
      this.inputIncludesAt(input);
    } else {
      this.userNames$ = new Observable<string[]>((observer) => {
        observer.next([]);
      });
    }
  }

  inputIncludesHash(input: any) {
    const searchQuery = input.substring(input.indexOf('#') + 1);

    this.channelNames$ = this.firestore
      .collection('channels', (ref) =>
        ref
          .where('channelName', '>=', searchQuery)
          .orderBy('channelName')
          .limit(10)
      )
      .valueChanges({ idField: 'id' })
      .pipe(
        map((channels: { id: string; channelName: string }[]) => {
          return channels.map((channel) => channel.channelName);
        }) as any
      );
  }

  inputIncludesAt(input: any) {
    const searchQuery = input.substring(input.indexOf('@') + 1);

    this.userNames$ = this.firestore
      .collection('users', (ref) =>
        ref
          .where('displayName', '>=', searchQuery)
          .orderBy('displayName')
          .limit(10)
      )
      .valueChanges({ idField: 'id' })
      .pipe(
        map((users: { id: string; displayName: string }[]) => {
          return users.map((user) => user.displayName);
        }) as any
      );
  }
}
