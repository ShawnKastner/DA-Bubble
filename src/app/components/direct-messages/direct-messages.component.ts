import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, map, switchMap, tap } from 'rxjs';
import { privateMessage } from 'src/app/models/private-chat';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { ChatListControlService } from 'src/app/shared/services/chat-list-control.service';
import { DirectMessagesService } from 'src/app/shared/services/direct-messages.service';
import { UsersService } from 'src/app/shared/services/users.service';

@Component({
  selector: 'app-direct-messages',
  templateUrl: './direct-messages.component.html',
  styleUrls: ['./direct-messages.component.scss'],
})
export class DirectMessagesComponent implements OnInit, OnDestroy {
  currentUserName!: any;
  currentUserId!: string;
  currentUserAvatar!: string;
  messageText!: string;
  myChats$ = this.directMessageService.myChats$;
  messageControl = new FormControl('');
  messages$: Observable<privateMessage[]> | undefined;
  user$ = this.usersService.currentUserProfile$;
  chatId: string = '';

  constructor(
    public directMessageService: DirectMessagesService,
    private route: ActivatedRoute,
    private chatListControlService: ChatListControlService,
    private usersService: UsersService,
    public authService: AuthService,
    public channelService: ChannelService
  ) {}

  ngOnDestroy() {
    localStorage.removeItem('currentChatId');
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.currentUserId = params['id'];
      this.getCurrentUser();
    });
    const storedChatId = localStorage.getItem('currentChatId');
    if (storedChatId) {
      this.chatListControlService.chatListControl.setValue([storedChatId]);
      this.chatId = storedChatId;
      this.messages$ = this.directMessageService.getChatMessages$(storedChatId);
    } else {
      this.messages$ =
        this.chatListControlService.chatListControl.valueChanges.pipe(
          map((value) => value[0]),
          tap((chatId) => {
            this.chatId = chatId;
          }),
          switchMap((chatId) =>
            this.directMessageService.getChatMessages$(chatId)
          ),
          tap(() => {})
        );
    }
  }

  getCurrentUser() {
    this.directMessageService
      .getCurrentUser(this.currentUserId)
      .subscribe((user: any) => {
        this.currentUserName = user.displayName;
        this.currentUserAvatar = user.avatar;
      });
  }

  sendMessage() {
    const message = this.messageText;
    const selectedChatId = this.chatListControlService.chatListControl.value[0];
    if (message && selectedChatId) {
      this.directMessageService
        .addChatMessage(selectedChatId, message)
        .subscribe(() => {});
      this.messageText = '';
    }
  }

  isNewDate(previousMessage: any, currentMessage: any): boolean {
    if (!previousMessage) {
      return true;
    }

    const previousDate = new Date(previousMessage.sentDate);
    const currentDate = new Date(currentMessage.sentDate);

    const result =
      previousDate.getFullYear() !== currentDate.getFullYear() ||
      previousDate.getMonth() !== currentDate.getMonth() ||
      previousDate.getDate() !== currentDate.getDate();

    return result;
  }
}
