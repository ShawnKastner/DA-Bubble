import { Injectable } from '@angular/core';
import { ChannelService } from './channel.service';

@Injectable({
  providedIn: 'root',
})
export class TextEditorFunctionsService {
  pickEmoji: boolean = false;
  pickEmojiEditMsg: boolean = false;
  showUserList: boolean = false;
  editMsgText: string = '';

  constructor(private channelService: ChannelService) {}

  /**
   * The `toggleUserList()` method is toggling the value of the `showUserList` property. If `showUserList` is currently
   * `false`, it will be set to `true`, and vice versa.
   *
   * @method
   * @name toggleUserList
   * @kind method
   * @memberof TextEditorFunctionsService
   * @returns {void}
   */
  toggleUserList() {
    this.showUserList = !this.showUserList;
  }

  /**
   * The `insertAtCursor(text: string)` method is used to insert a "@" with the username from list of users
   *
   * @method
   * @name insertAtCursor
   * @kind method
   * @memberof TextEditorFunctionsService
   * @param {string} text
   * @returns {void}
   */
  insertAtCursor(text: string) {
    const textarea = document.querySelector(
      '.text-editor textarea'
    ) as HTMLTextAreaElement;
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const textBeforeCursor = textarea.value.substring(0, startPos);
    const textAfterCursor = textarea.value.substring(
      endPos,
      textarea.value.length
    );

    textarea.value = textBeforeCursor + text + textAfterCursor;
    textarea.selectionStart = startPos + text.length;
    textarea.selectionEnd = startPos + text.length;
    textarea.focus();
  }

  /**
   * The `addUserToMessage(username: string)` method is used to add a username to the message being edited in the text
   * editor. It takes a `username` parameter as input.
   *
   * @method
   * @name addUserToMessage
   * @kind method
   * @memberof TextEditorFunctionsService
   * @param {string} username
   * @returns {void}
   */
  addUserToMessage(username: string) {
    this.insertAtCursor(`@${username}`);
    this.showUserList = false;
  }

  /**
   * The `selectEmoji()` method is toggling the value of the `pickEmoji` property. If `pickEmoji` is currently `false`, it
   * will be set to `true`, and vice versa.
   *
   * @method
   * @name selectEmoji
   * @kind method
   * @memberof TextEditorFunctionsService
   * @returns {void}
   */
  selectEmoji() {
    this.pickEmoji = !this.pickEmoji;
  }

  /**
   * The `addEmoji(event: any)` method is used to add an emoji to the message being edited in the text editor. It takes an
   * `event` parameter as input, which contains information about the selected emoji. The method appends the native
   * representation of the emoji to the `message` property of the `channelService` object. After adding the emoji, it sets
   * the `pickEmoji` property to `false` to close the emoji picker.
   *
   * @method
   * @name addEmoji
   * @kind method
   * @memberof TextEditorFunctionsService
   * @param {any} event
   * @returns {void}
   */
  addEmoji(event: any) {
    this.channelService.message = `${this.channelService.message}${event.emoji.native}`;
    this.pickEmoji = false;
  }

  /**
   * The `editMessage(message: any)` method is used to toggle the `editMsg` property of a message object. It takes a
   * `message` parameter as input, which represents the message being edited.
   *
   * @method
   * @name editMessage
   * @kind method
   * @memberof TextEditorFunctionsService
   * @param {any} message
   * @returns {void}
   */
  editMessage(message: any) {
    message.editMsg = !message.editMsg;
    message.showEditMessage = false;
  }

  /**
   * The `cancelEdit(message: any)` method is used to cancel the editing of a message. It takes a `message` parameter as
   * input, which represents the message being edited. Inside the method, the `editMsg` property of the `message` object is
   * set to `false`, indicating that the editing has been canceled.
   *
   * @method
   * @name cancelEdit
   * @kind method
   * @memberof TextEditorFunctionsService
   * @param {any} message
   * @returns {void}
   */
  cancelEdit(message: any) {
    message.editMsg = false;
  }

  selectEmojiEditMsg() {
    this.pickEmojiEditMsg = !this.pickEmojiEditMsg;
  }

  addEmojiEditMsg(event: any, message: any) {
    message.channelMessage = `${message.channelMessage}${event.emoji.native}`;
    this.pickEmojiEditMsg = false;
  }
}
