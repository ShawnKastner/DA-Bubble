export class Message {
  channelMessage!: string;
  messageID!: string;
  createdDate!: Number;
  messagedAuthor!: string;

  constructor(
    channelMessage: string,
    messageID: string,
    createdDate: Number,
    messagedAuthor: string
  ) {
    this.channelMessage = channelMessage;
    this.messageID = messageID;
    this.createdDate = createdDate;
    this.messagedAuthor = messagedAuthor;
  }

  public messageToJSON() {
    return {
      channelMessage: this.channelMessage,
      messageID: this.messageID,
      createdDate: this.createdDate,
      messagedAuthor: this.messagedAuthor,
    };
  }
}
