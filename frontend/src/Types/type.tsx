//src/Types/type.tsx

export interface Flashcard {
  id: number,
  setId: number;
  question: string;
  solution: string;
  difficulty: string;
}

export interface Sets {
  id: number;
  name: string;
}

  export interface FlashcardSetPageProps {
    setId: number; // Define the type for setId as number
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
    id:number;
    title: string;
    comment: string;
    setId:number;
    userId: number;
  }
  