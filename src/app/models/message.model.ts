export class Message {
  channelMessage!: string;
  messageID!: string;
  createdDate!: Number;
  messagedAuthor!: string;
  avatar: string;

  constructor(
    channelMessage: string,
    messageID: string,
    createdDate: Number,
    messagedAuthor: string,
    avatar: string
  ) {
    this.channelMessage = channelMessage;
    this.messageID = messageID;
    this.createdDate = createdDate;
    this.messagedAuthor = messagedAuthor;
    this.avatar = avatar;
  }

  public messageToJSON() {
    return {
      channelMessage: this.channelMessage,
      messageID: this.messageID,
      createdDate: this.createdDate,
      messagedAuthor: this.messagedAuthor,
      avatar: this.avatar
    };
  }
}
