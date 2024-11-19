// frontend/src/pages/HomePage.tsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const [sets, setSets] = useState<any[]>([]);

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const response = await axios.get('http://localhost:3000/sets');
        setSets(response.data);
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
            <Link to={`/sets/${set.id}`}>{set.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
