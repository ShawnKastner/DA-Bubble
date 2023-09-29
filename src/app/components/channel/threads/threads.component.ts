import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { ThreadService } from 'src/app/shared/services/thread.service';

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.scss'],
})
export class ThreadsComponent implements OnInit, OnDestroy {
  currentChannelId!: string;
  currentThreadId!: any;
  currentMessage!: any;
  allThreadAnswers!: any;

  constructor(
    private route: Router,
    public channelService: ChannelService,
    public threadService: ThreadService,
    public authService: AuthService
  ) {
    this.currentThreadId = localStorage.getItem('threadId');
  }

  ngOnDestroy() {
    localStorage.removeItem('threadId');
  }

  ngOnInit() {
    if (this.channelService.currentChannel && this.currentThreadId) {
      this.currentChannelId = this.channelService.currentChannel.id;
      this.getCurrentThreadMessage();
    }
  }

  getCurrentThreadMessage() {
    this.threadService
      .getClickedThreadMessage(this.currentChannelId, this.currentThreadId)
      .subscribe((data) => {
        this.currentMessage = [data];
        this.getAllThreadAnswers();
      });
  }

  sendMessage() {
    if (this.threadService.message) {
      this.threadService.sendMessageToThread(
        this.currentChannelId,
        this.currentThreadId
      );
    }
  }

  getAllThreadAnswers() {
    this.threadService
      .getThreadAnswers(this.currentChannelId, this.currentThreadId)
      .subscribe((data) => {
        this.allThreadAnswers = data;
        console.log(this.allThreadAnswers);
      });
  }

  closeThread() {
    this.route.navigateByUrl('/home/' + this.channelService.currentChannel.id);
  }
}
