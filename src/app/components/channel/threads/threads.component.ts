import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { TextEditorFunctionsService } from 'src/app/shared/services/text-editor-functions.service';
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
  answerCount!: number;

  private routerSubscription: Subscription | undefined;

  constructor(
    private route: Router,
    public channelService: ChannelService,
    public threadService: ThreadService,
    public authService: AuthService,
    public textEditorService: TextEditorFunctionsService
  ) {
    this.currentThreadId = localStorage.getItem('threadId');
  }

  ngOnDestroy() {
    localStorage.removeItem('threadId');
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    if (this.channelService.currentChannel && this.currentThreadId) {
      this.currentChannelId = this.channelService.currentChannel.id;
      this.subscribeToRouterEvents();
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
    if (this.threadService.message || this.threadService.selectedFileThreads) {
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
        this.answerCount = this.allThreadAnswers.length;
      });
  }

  closeThread() {
    this.route.navigateByUrl('/home/' + this.channelService.currentChannel.id);
  }



  private subscribeToRouterEvents() {
    this.routerSubscription = this.route.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.handleRouterNavigation();
      }
    });
  }

  private handleRouterNavigation() {
    this.currentThreadId = localStorage.getItem('threadId');
    if (this.currentThreadId) {
      this.getCurrentThreadMessage();
    }
  }
}
