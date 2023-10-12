import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class EmojiService {
  pickEmojiReaction: boolean = false;
  checkMarkManualEvent: any = {
    emoji: {
      name: 'White Heavy Check Mark',
      unified: '2705',
      keywords: [
        'check_mark_button',
        'green-square',
        'ok',
        'agree',
        'vote',
        'election',
        'answer',
        'tick',
      ],
      sheet: [58, 24],
      shortName: 'white_check_mark',
      shortNames: ['white_check_mark'],
      id: 'white_check_mark',
      native: '✅',
      skinVariations: [],
      emoticons: [],
      hidden: [],
      text: '',
      set: 'apple',
      colons: ':white_check_mark:',
    },
    $event: {
      isTrusted: true,
    },
  };

  raisedHandsManualEvent: any = {
    emoji: {
      name: 'Person Raising Both Hands in Celebration',
      unified: '1F64C',
      keywords: [
        'raising_hands',
        'gesture',
        'hooray',
        'yea',
        'celebration',
        'hands',
      ],
      sheet: [34, 45],
      skinVariations: [
        {
          unified: '1F64C-1F3FB',
          sheet: [34, 46],
        },
        {
          unified: '1F64C-1F3FC',
          sheet: [34, 47],
        },
        {
          unified: '1F64C-1F3FD',
          sheet: [34, 48],
        },
        {
          unified: '1F64C-1F3FE',
          sheet: [34, 49],
        },
        {
          unified: '1F64C-1F3FF',
          sheet: [34, 50],
        },
      ],
      shortName: 'raised_hands',
      shortNames: ['raised_hands'],
      id: 'raised_hands',
      native: '🙌',
      emoticons: [],
      hidden: [],
      text: '',
      set: 'apple',
      colons: ':raised_hands:',
    },
    $event: {
      isTrusted: true,
    },
  };

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {}

  /**
   * The `addReaction` method in the `EmojiService` class is responsible for adding or removing a reaction to a specific
   * message in a channel. It takes three parameters: `event`, `channelId`, and `messageId`.
   *
   * @method
   * @name addReaction
   * @kind method
   * @memberof EmojiService
   * @param {any} event
   * @param {string} channelId
   * @param {string} messageId
   * @returns {void}
   */
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
      } else {
        console.error('Nachricht nicht gefunden');
      }
    });
    this.pickEmojiReaction = false;
  }

  /**
   * The `removeUserReaction` method in the `EmojiService` class is responsible for removing the current user from the list
   * of users who reacted with a specific emoji.
   *
   * @method
   * @name removeUserReaction
   * @kind method
   * @memberof EmojiService
   * @param {any} userReaction
   * @param {string} currentUser
   * @param {any[]} reactions
   * @returns {void}
   */
  removeUserReaction(userReaction: any, currentUser: string, reactions: any[]) {
    userReaction.users = userReaction.users.filter(
      (user: string) => user !== currentUser
    );
    userReaction.count--;

    if (userReaction.count === 0 && userReaction.users.length === 0) {
      const userReactionIndex = reactions.indexOf(userReaction);
      reactions.splice(userReactionIndex, 1);
    }
  }

  /**
   * The `addUserReaction` method in the `EmojiService` class is responsible for adding the current user to the list of users
   * who reacted with a specific emoji.
   *
   * @method
   * @name addUserReaction
   * @kind method
   * @memberof EmojiService
   * @param {any} reaction
   * @param {string} currentUser
   * @returns {void}
   */
  addUserReaction(reaction: any, currentUser: string) {
    reaction.users.push(currentUser);
    reaction.count++;
  }

  /**
   * The `addNewReaction` method in the `EmojiService` class is responsible for adding a new reaction to the list of
   * reactions for a specific message.
   *
   * @method
   * @name addNewReaction
   * @kind method
   * @memberof EmojiService
   * @param {any[]} reactions
   * @param {string} emoji
   * @param {string} currentUser
   * @returns {void}
   */
  addNewReaction(reactions: any[], emoji: string, currentUser: string) {
    reactions.push({
      emoji: emoji,
      users: [currentUser],
      count: 1,
    });
  }

  /**
   * The `formatUserNames` method in the `EmojiService` class takes an array of usernames as input and returns a formatted
   * string.
   *
   * @method
   * @name formatUserNames
   * @kind method
   * @memberof EmojiService
   * @param {string[]} usernames
   * @returns {string}
   */
  formatUserNames(usernames: string[]): string {
    const currentUser = this.authService.userData.displayName;
    const numOtherUsers = usernames.length - 1;

    if (usernames.includes(currentUser)) {
      if (numOtherUsers === 0) {
        return 'Du';
      } else if (numOtherUsers === 1) {
        const otherUser = usernames.find((user) => user !== currentUser);
        return 'Du und ' + otherUser;
      } else {
        return 'Du und ' + numOtherUsers + ' weitere';
      }
    } else {
      if (numOtherUsers === 0) {
        return usernames[0];
      } else if (numOtherUsers === 1) {
        const otherUser = usernames.find((user) => user !== currentUser);
        return otherUser + ' und 1 weiterer';
      } else {
        return (
          usernames.slice(0, 2).join(', ') +
          ' und ' +
          (numOtherUsers - 1) +
          ' weitere'
        );
      }
    }
  }
}
