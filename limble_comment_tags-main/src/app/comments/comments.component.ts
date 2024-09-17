import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
  import { IComment } from '../../interfaces/comment';
  import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent {
  @ViewChild('dropdown') dropdownElement!: ElementRef;  
  newCommentContent: string = '';
  usersMap = new Map<number, string>([
    [1, "Kevin"],
    [2, "Jeff"],
    [3, "Bryan"],
    [4,"Gabbey"],
    [5,"John"],
    [6,"Jerry"],
  ]);
  mentionSeen: boolean = false; // True if '@' has been typed
  mentionList: string[] = []; // List of users matching the mention filter
  mentionIndex: number = 0; // Index of selected user in mention dropdown
  mentionStart: number = -1; // Position where '@' was typed
  builtUsername: string = '';
  arrowkeyLocation: number = 0;
  isModalVisible: boolean = false;
 

  // Array of comment objects. Filled with test data currently.
  comments: IComment[] = [
    {
      id: 0,
      author: 'Jeff',
      text: 'This task is really hard, I need help.',
      date: new Date('2024-09-13T10:30:00')
    },
    {
      id: 1,
      author: 'Gabbey',
      text: 'What do you need help with?',
      date: new Date('2024-09-13T11:15:00')
    }
  ];

/**
 * The event handler that determines if we see an '@' symbol and then uses the text after an '@' to filter the user list.
 */
  onTextChange() {
    const atSymbolIndex = this.newCommentContent.lastIndexOf('@');
    const tagDetected = this.newCommentContent.match(/@([a-zA-Z]*)$/);
    
    if (tagDetected && atSymbolIndex !== -1) {
        
        this.mentionSeen = true;
        this.mentionStart = atSymbolIndex; // Tracks where '@' is in the text
        this.builtUsername = tagDetected[1]; 
        
        
        this.mentionList = Array.from(this.usersMap.values()).filter(user =>
            user.toLowerCase().startsWith(this.builtUsername.toLowerCase())
        );
    } else {
        this.mentionSeen = false;
        this.builtUsername = '';
        this.mentionList = [];
        this.mentionIndex = 0;
    }
  }
/**
 * Event handler that determines if the user is keying down our user drop down list.
 * @param event 
 */
  onInputChange(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp': 
        event.preventDefault();
        this.arrowkeyLocation--;
        this.mentionIndex--;
        break;       
      case 'ArrowDown':  
        event.preventDefault();
        this.arrowkeyLocation++;
        this.mentionIndex++;
        break;
      case 'Enter':
        event.preventDefault();
        if(this.mentionSeen){
          event.preventDefault();
          this.selectMention(event);
          this.resetMention();
          break;
        }  
  }
  }
/**
 * Adds a comment to our comments container from our comments list. 
 */
  addComment() {
    const newCommentID = this.generateRandomId();
    const dateCreated = new Date();
    if (this.newCommentContent.trim()) {
      const mentions = this.newCommentContent?.match(/\B@\w+/g)?.map((element) => {return element;});
      mentions?.forEach(mention => {
        this.newCommentContent = this.newCommentContent.replace(mention, `<strong>${mention}</strong>`);
        this.notifyTaggedUser(mention,newCommentID,dateCreated);
              
      })

      this.comments.push({
        id: newCommentID,
        author: 'Me',
        text: this.newCommentContent,
        date: dateCreated
      });
      this.newCommentContent = ''; 
    }
  }

/**
 * 
 * @param index The index of selected element
 * @returns True if both indexes match.
 */
  isSelected(index: number): boolean {
    return index === this.mentionIndex;
  }

  /**
   * Called once a user has selected a user from the user drop down. Resets relevant field and captures state.
   * @param event 
   */
  selectMention(event: any) {
    const input = event.target;

    
    const mention = `@${this.mentionList[this.mentionIndex]} `;

    
    const textBeforeMention = this.newCommentContent.substring(0, this.mentionStart);
    

    
    const textAfterMention = this.newCommentContent.substring(this.mentionStart + this.builtUsername.length + 1);
    

    
    this.newCommentContent = `${textBeforeMention}${mention}${textAfterMention}`;

    
    this.resetMention();
    
    
    input.focus();
    input.selectionStart = textBeforeMention.length + mention.length;
    input.selectionEnd = textBeforeMention.length + mention.length; 
  }
/**
 * Called to reset all global states
 */
  resetMention() {
    this.mentionSeen = false;
    this.mentionList = [];
    this.builtUsername = '';
  }

  /**
   * Number Generator for generating a ID for our comment objects.
   * @returns A random 4 digit number.
   */
  generateRandomId(): number {
    return Math.floor(1000 + Math.random() * 9000);  
  }
/**
 * Prints a message to console in order to notify the user who was tagged in a comment.
 * @param taggedUser The username of the user that is to be notified.
 * @param commentID The Comment ID that the taggedUser was mentioned in.
 * @param creationDate The date when the user was tagged in the comment.
 */
  notifyTaggedUser(taggedUser: string, commentID: number, creationDate: Date){
    // Given an actual endpoint for a notifcation service , we have all the needed meta data to make a call to it. 
    console.log("Hey " + taggedUser + ", Ruben Mentioned you in Comment #" + commentID + " On " + creationDate.toDateString());     
  }
  toggleModal() {
    this.isModalVisible = !this.isModalVisible;
  }

}
