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
    setId: number; 
  }
  
  
 
  
  export interface Error {
    message: string;
  }
  
  export interface User {
    id: number;
    username: string;
    
  }
  
  export interface Collection {
    id:number;
    title: string;
    comment: string;
    createdAt:string;
    updatedAt:string
    set?:Sets[]
  }


export interface UserType {
  id: number;
  username: string;
  role: string;
  limit: number;
}
