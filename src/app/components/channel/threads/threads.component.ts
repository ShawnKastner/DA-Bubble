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
  allThreadMessages!: any;

  constructor(
    private route: Router,
    public channelService: ChannelService,
    public threadService: ThreadService,
    public authService: AuthService
  ) {}

  ngOnDestroy() {
    localStorage.removeItem('threadId');
  }

  ngOnInit() {
    if (this.channelService.currentChannel) {
      this.currentChannelId = this.channelService.currentChannel.id;
      console.log('current channel ID is:', this.currentChannelId);
    }
    this.currentThreadId = localStorage.getItem('threadId');
    this.getAllThreadMessages();
  }

  getAllThreadMessages() {
    this.threadService
      .getThreadMessages(this.currentChannelId, this.currentThreadId)
      .subscribe((data) => {
        this.currentMessage = [data];
      });
  }

  closeThread() {
    this.route.navigateByUrl('/home/' + this.channelService.currentChannel.id);
  }
}
