// frontend/src/pages/HomePage.tsx

import  { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Set {
  id: Number;
  name: string;
}

const HomePage = () => {
  const [sets, setSets] = useState<any[]>([]);

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const response = await axios.get('http://localhost:3000/set');
        setSets(response.data as Set[]);
      } catch (error) {
        console.error('Error fetching sets:', error);
      }
    };
    fetchSets();
  }, []);

  return (
    <div>
      <h1>Flashcard Sets</h1>
      <ul>
        {sets.map((set) => (
          <li key={set.id}>
            <Link to={`/set/${set.id}`}>{set.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
