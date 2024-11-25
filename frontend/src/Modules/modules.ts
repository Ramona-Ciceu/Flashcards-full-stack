export interface Flashcard {
    question: string;
    answer: string;
    difficulty?: string;
  }
  
  export interface FlashcardSet {
    id: number;
    name: string;
    description: string;
    flashcards: Flashcard[];
    comments: { comment: string; author: string }[];
  }
  
  export interface Error {
    message: string;
  }
  
  export interface User {
    id: number;
    username: string;
    email: string;
  }
  
  export interface Collection {
    comment: string;
    set: FlashcardSet;
    user: User;
  }
  