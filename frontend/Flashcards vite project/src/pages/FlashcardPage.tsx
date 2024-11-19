// frontend/src/pages/FlashcardPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const FlashcardPage = () => {
  const { setId } = useParams();
  const [flashcards, setFlashcards] = useState<any[]>([]);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/sets/${setId}/flashcards`);
        setFlashcards(response.data);
      } catch (error) {
        console.error('Error fetching flashcards:', error);
      }
    };
    if (setId) {
      fetchFlashcards();
    }
  }, [setId]);

  return (
    <div>
      <h1>Flashcards</h1>
      <ul>
        {flashcards.map((flashcard) => (
          <li key={flashcard.id}>
            <h3>{flashcard.question}</h3>
            <p>{flashcard.answer}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FlashcardPage;
