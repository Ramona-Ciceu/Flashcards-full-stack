import React, { useEffect, useState } from 'react';
import { fetchSets } from '../utils/api'; // Import the API function to fetch sets
import FlashcardSetItem from './Set';

interface FlashcardSet {
  id: number;
  name: string;
  description: string;
}

const FlashcardSetList: React.FC = () => {
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlashcardSets = async () => {
      try {
        const data = await fetchSets(); // Fetch all flashcard sets
        setSets(data); // Assuming data is an array of sets
      } catch (err) {
        setError('Failed to fetch flashcard sets');
      } finally {
        setLoading(false);
      }
    };
    fetchFlashcardSets();
  }, []);

  if (loading) return <p>Loading flashcard sets...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ul>
      {sets.map((set) => (
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
