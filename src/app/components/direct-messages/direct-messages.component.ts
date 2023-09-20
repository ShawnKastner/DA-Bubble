import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatListControlService } from 'src/app/shared/services/chat-list-control.service';
import { DirectMessagesService } from 'src/app/shared/services/direct-messages.service';

@Component({
  selector: 'app-direct-messages',
  templateUrl: './direct-messages.component.html',
  styleUrls: ['./direct-messages.component.scss'],
})
export class DirectMessagesComponent implements OnInit {
  currentUserName!: any;
  currentUserId!: string;
  currentUserAvatar!: string;
  messageText!: string;

  constructor(
    private directMessageService: DirectMessagesService,
    private route: ActivatedRoute,
    private chatListControlService: ChatListControlService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.currentUserId = params['id'];
      this.getCurrentUser();
    });
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
}
