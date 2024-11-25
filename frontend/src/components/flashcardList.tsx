import React from 'react';
import FlashcardItem from './flashcardItem';

interface Flashcard {
  id: number;
  question: string;
  solution: string;
  difficulty: string;
}

interface FlashcardListProps {
  flashcards: Flashcard[];  
}

const FlashcardList: React.FC<FlashcardListProps> = ({ flashcards }) => {
  return (
    <ul>
      {flashcards.map((flashcard) => (
        <FlashcardItem
          key={flashcard.id}
          id={flashcard.id}
          question={flashcard.question}
          solution={flashcard.solution}
          difficulty={flashcard.difficulty}
        />
      ))}
    </ul>
  );
};

export default FlashcardList;
