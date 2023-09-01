export class Channel {
  channelName!: string;
  description!: string;
  id!: string;
  createdDate!: Number;

  constructor(channelName: string, description: string, id: string, createdDate: Number) {
    this.channelName = channelName;
    this.description = description;
    this.id = id;
    this.createdDate = createdDate;
  }

  public channelToJSON() {
    return {
      channelName: this.channelName,
      description: this.description,
      id: this.id,
      createdDate: this.createdDate,
    };
  }
}
