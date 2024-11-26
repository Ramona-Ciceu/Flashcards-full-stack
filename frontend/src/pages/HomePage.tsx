import React, { useEffect, useState } from 'react';
import { fetchSets } from '../utils/api';  // Import the fetchSets function from api.ts
import '../index.css';

const HomePage: React.FC = () => {
  const [flashcardSets, setFlashcardSets] = useState<any[]>([]);

  useEffect(() => {
    const loadFlashcardSets = async () => {
      try {
        const data = await fetchSets();  // Use the fetchSets function from api.ts
        setFlashcardSets(data);
      } catch (error) {
        console.error('Error fetching flashcard sets:', error);
      }
    };

    loadFlashcardSets();  // Load flashcard sets when the component mounts
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center">Welcome to TestVar - Flashcards</h1>
      <ul>
        {flashcardSets.length > 0 ? (
          flashcardSets.map((set) => (
            <li key={set.id}>
              <a href={`/sets/${set.id}`}>{set.name}</a>
            </li>
          ))
        ) : (
          <li>No flashcards available.</li>
        )}
      </ul>
    </div>
  );
};

export default HomePage;
