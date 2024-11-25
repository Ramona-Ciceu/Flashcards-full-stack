import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import FlashcardSetList from '../components/SetList';
import React from 'react';

interface FlashcardSet {
  id: number;
  name: string;
  description: string;
}

const UserSetsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [sets, setSets] = useState<FlashcardSet[]>([]);

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/backend/users/${userId}/sets`);
        setSets(response.data);
      } catch (error) {
        console.error('Error fetching user sets:', error);
      }
    };

    if (userId) {
      fetchSets();
    }
  }, [userId]);

  return (
    <div>
      <h1>User Flashcard Sets</h1>
      <FlashcardSetList flashcardSets={sets} />
    </div>
  );
};

export default UserSetsPage;
