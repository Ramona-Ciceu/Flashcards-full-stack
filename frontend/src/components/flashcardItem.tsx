import React from 'react';

interface FlashcardProps {
  id: number;
  question: string;
  solution: string;
  difficulty: string;
}

const FlashcardItem: React.FC<FlashcardProps> = ({ id, question, solution, difficulty }) => {
  return (
    <li key={id}>
      <h3>{question}</h3>
      <p>{solution}</p>
      <p>Difficulty: {difficulty}</p>
    </li>
  );
};

export default FlashcardItem;
