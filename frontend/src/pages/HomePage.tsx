import  { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [flashcardSets, setFlashcardSets] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/api/sets') // Adjust this API path based on your backend
      .then(response => {
        setFlashcardSets(response.data);
      })
      .catch(error => {
        console.error('Error fetching flashcard sets:', error);
      });
  }, []);

  return (
    <div>
      <h1>Welcome to TestVar - Flashcards</h1>
      <ul>
        {flashcardSets.map(set => (
          <li key={set.id}>
            <a href={`/sets/${set.id}`}>{set.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
