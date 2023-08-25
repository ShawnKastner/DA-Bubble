export class Channel {
  channelName!: string;
  description!: string;
  id!: string;

  constructor(channelName: string, description: string, id: string) {
    this.channelName = channelName;
    this.description = description;
    this.id = id;
  }

  public channelToJSON() {
    return {
      channelName: this.channelName,
      description: this.description,
      id: this.id,
    };
  }
}
