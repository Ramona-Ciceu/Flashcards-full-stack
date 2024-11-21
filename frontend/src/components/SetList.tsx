import React from 'react';
import FlashcardSetItem from './Set';

interface FlashcardSet {
  id: number;
  name: string;
  description: string;
}

interface FlashcardSetListProps {
  flashcardSets: FlashcardSet[];
}

const FlashcardSetList: React.FC<FlashcardSetListProps> = ({ flashcardSets }) => {
  return (
    <ul>
      {flashcardSets.map(set => (
        <FlashcardSetItem
          key={set.id}
          id={set.id}
          name={set.name}
          description={set.description}
        />
      ))}
    </ul>
  );
};

export default FlashcardSetList;
