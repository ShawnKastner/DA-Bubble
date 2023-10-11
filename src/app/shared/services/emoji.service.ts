import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class EmojiService {
  pickEmojiReaction: boolean = false;

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {}

  addReaction(event: any, channelId: string, messageId: string) {
    const emoji = event.emoji.native;
    const currentUser = this.authService.userData.displayName;
    const messageRef = this.firestore
      .collection('channels')
      .doc(channelId)
      .collection('messages')
      .doc(messageId);

    messageRef.get().subscribe((doc) => {
      if (doc.exists) {
        const data = doc.data() || {};
        const reactions = data['reactions'] || [];

        const userReactionIndex = reactions.findIndex(
          (r: { users: string[] }) => r.users && r.users.includes(currentUser)
        );

        if (userReactionIndex !== -1) {
          const userReaction = reactions[userReactionIndex];
          if (userReaction.emoji === emoji) {
            this.removeUserReaction(userReaction, currentUser, reactions);
          } else {
            this.removeUserReaction(userReaction, currentUser, reactions);

            const newReaction = reactions.find(
              (r: { emoji: any }) => r.emoji === emoji
            );
            if (newReaction) {
              this.addUserReaction(newReaction, currentUser);
            } else {
              this.addNewReaction(reactions, emoji, currentUser);
            }
          }
        } else {
          const newReaction = reactions.find(
            (r: { emoji: any }) => r.emoji === emoji
          );
          if (newReaction) {
            this.addUserReaction(newReaction, currentUser);
          } else {
            this.addNewReaction(reactions, emoji, currentUser);
          }
        }

        messageRef.update({
          reactions: reactions,
        });

        console.log('Reaktion hinzugefügt');
      } else {
        console.error('Nachricht nicht gefunden');
      }
    });
    this.pickEmojiReaction = false;
  }

  private removeUserReaction(
    userReaction: any,
    currentUser: string,
    reactions: any[]
  ) {
    userReaction.users = userReaction.users.filter(
      (user: string) => user !== currentUser
    );
    userReaction.count--;

    if (userReaction.count === 0 && userReaction.users.length === 0) {
      const userReactionIndex = reactions.indexOf(userReaction);
      reactions.splice(userReactionIndex, 1);
    }
  }

  private addUserReaction(reaction: any, currentUser: string) {
    reaction.users.push(currentUser);
    reaction.count++;
  }

  private addNewReaction(reactions: any[], emoji: string, currentUser: string) {
    reactions.push({
      emoji: emoji,
      users: [currentUser],
      count: 1,
    });
  }
}
