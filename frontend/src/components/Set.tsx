import React from 'react';

interface FlashcardSetProps {
  id: number;
  name: string;
  description: string;
}

const FlashcardSetItem: React.FC<FlashcardSetProps> = ({ id, name, description }) => {
  return (
    <li key={id}>
      <h3>{name}</h3>
      <p>{description}</p>
    </li>
  );
};

export default FlashcardSetItem;
