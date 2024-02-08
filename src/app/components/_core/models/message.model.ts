export class Message {
  channelMessage!: string;
  messageID!: string;
  createdDate!: Number;
  messagedAuthor!: string;
  avatar: string;
  imageUrl!: any;

  constructor(
    channelMessage: string,
    messageID: string,
    createdDate: Number,
    messagedAuthor: string,
    avatar: string,
    imageUrl: any
  ) {
    this.channelMessage = channelMessage;
    this.messageID = messageID;
    this.createdDate = createdDate;
    this.messagedAuthor = messagedAuthor;
    this.avatar = avatar;
    this.imageUrl = imageUrl;
  }

  public messageToJSON() {
    return {
      channelMessage: this.channelMessage,
      messageID: this.messageID,
      createdDate: this.createdDate,
      messagedAuthor: this.messagedAuthor,
      avatar: this.avatar,
      imageUrl: this.imageUrl
    };
  }
}
