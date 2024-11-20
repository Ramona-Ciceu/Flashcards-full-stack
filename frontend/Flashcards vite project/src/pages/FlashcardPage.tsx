// frontend/src/pages/FlashcardPage.tsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface flashcard {
  id: number;
  question: string;
  solution: string;
  difficulty: string; 
}


const FlashcardPage = () => {
  const { setId } = useParams() as { setId: string };
  const [flashcards, setFlashcards] = useState<any[]>([]);


  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/set/${setId}/flashcard`);
        setFlashcards(response.data as flashcard[]);
        
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
            <p>{flashcard.solution}</p>
            <p>Difficulty: {flashcard.difficulty}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FlashcardPage;
