export class Channel {
  channelName!: string;
  description!: string;
  id!: string;
  createdDate!: Number;
  createdBy!: string;

  constructor(
    channelName: string,
    description: string,
    id: string,
    createdDate: Number,
    createdBy: string
  ) {
    this.channelName = channelName;
    this.description = description;
    this.id = id;
    this.createdDate = createdDate;
    this.createdBy = createdBy;
  }

  public channelToJSON() {
    return {
      channelName: this.channelName,
      description: this.description,
      id: this.id,
      createdDate: this.createdDate,
      createdBy: this.createdBy,
    };
  }
}
