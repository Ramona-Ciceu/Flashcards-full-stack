import React from 'react';

interface FlashcardSet {
  id: number;
  name: string;
  description: string;
}

interface FlashcardSetListProps {
  sets: FlashcardSet[];
}

const FlashcardSetList: React.FC<FlashcardSetListProps> = ({ sets }) => {
  return (
    <ul>
      {sets.map(set => (
        <li key={set.id}>
          <h2>{set.name}</h2>
          <p>{set.description}</p>
        </li>
      ))}
    </ul>
  );
};

export default FlashcardSetList;
