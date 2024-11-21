//Flashcard component allows to display flashcards in react frontend
//The code will render a flashcard with question and solution
//The user clicks on "Show answer" to reveal the solution.

import React, { useState } from 'react';

interface FlashcardProps {
  id: number;
  question: string;
  answer: string;

  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const Flashcard: React.FC<FlashcardProps> = ({ question, answer, difficulty }) => {
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  const handleToggleAnswer = () => {
    // Toggle answer visibility
    setShowAnswer((prev) => !prev); 
  };

  return (
    <div className="flashcard">
      <div className="flashcard-header">
        <h3>{question}</h3>
        <span className="difficulty">{difficulty}</span> {/* Show difficulty */}
      </div>
      {showAnswer && (
        <div className="answer">
          <p>{answer}</p>
        </div>
      )}
      <button onClick={handleToggleAnswer}>
        {showAnswer ? 'Hide Answer' : 'Show Answer'}
      </button>
    </div>
  );
};

export default Flashcard;

