import { Component, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { NewMessageService } from 'src/app/shared/services/new-message.service';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.scss'],
})
export class NewMessageComponent implements OnDestroy {
  pickEmoji: boolean = false;
  channelNames$: Observable<string[]>;
  userNames$: Observable<string[]>;
  newMessageText: string = '';
  selectedChannel: string = '';

  constructor(
    private firestore: AngularFirestore,
    public newMessageService: NewMessageService
  ) {
    this.channelNames$ = new Observable<string[]>((observer) => {
      observer.next([]);
    });
    this.userNames$ = new Observable<string[]>((observer) => {
      observer.next([]);
    });
  }

  ngOnDestroy() {
    localStorage.removeItem('currentChatId');
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
