import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChannelService } from 'src/app/shared/services/channel.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
})
export class ChannelComponent implements OnInit {
  currentChannelID!: string;
  currentChannel!: any;
  allMessages!: any;

  constructor(
    public channelService: ChannelService,
    private route: ActivatedRoute,
    public authService: AuthService
    ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.currentChannelID = params['id'];
      this.getCurrentChannel();
      this.getChannelMessages();
    });
  }

  /**
   * The `getCurrentChannel()` method is retrieving the current channel based on the `currentChannelID` property. It is using
   * the `channelService` to make a request to get the current channel data from the server. Once the data is received, it is
   * assigned to the `currentChannel` property of the component.
   *
   * @method
   * @name getCurrentChannel
   * @kind method
   * @memberof ChannelComponent
   * @returns {void}
   */
  getCurrentChannel() {
    this.channelService
      .getCurrentChannel(this.currentChannelID)
      .subscribe((data) => {
        this.currentChannel = data;
      });
  }

  /**
   * The `getChannelMessages()` method is retrieving all the messages for the current channel. It is using the
   * `channelService` to make a request to get the messages data from the server. Once the data is received, it is assigned
   * to the `allMessages` property of the component.
   *
   * @method
   * @name getChannelMessages
   * @kind method
   * @memberof ChannelComponent
   * @returns {void}
   */
  getChannelMessages() {
    this.channelService
      .getAllMessages(this.currentChannelID)
      .subscribe((data) => {
        this.allMessages = data;
      });
  }

  /**
   * The `isNewDate(previousMessage: any, currentMessage: any): boolean` method is a helper method that checks if the current
   * message has a different date than the previous message. It takes two parameters, `previousMessage` and `currentMessage`,
   * which represent the previous and current messages respectively.
   *
   * @method
   * @name isNewDate
   * @kind method
   * @memberof ChannelComponent
   * @param {any} previousMessage
   * @param {any} currentMessage
   * @returns {boolean}
   */
  isNewDate(previousMessage: any, currentMessage: any): boolean {
    if (!previousMessage) {
      return true;
    }

    const previousDate = new Date(previousMessage.createdDate);
    const currentDate = new Date(currentMessage.createdDate);

    const result =
      previousDate.getFullYear() !== currentDate.getFullYear() ||
      previousDate.getMonth() !== currentDate.getMonth() ||
      previousDate.getDate() !== currentDate.getDate();

    return result;
  }
}
