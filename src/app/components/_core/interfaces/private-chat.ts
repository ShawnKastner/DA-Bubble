import { User } from 'src/app/components/_core/interfaces/user';

export interface PrivateChat {
    id: string;
    userIds: string[];
    users: User[];


    chatPic?: string;
    chatName?: string;
}

export interface privateMessage {
    messageId: string;
    text: string;
    senderId: string;
    displayName: string;
    avatar: string;
    sentDate: number;
    imageUrl: null;
}
