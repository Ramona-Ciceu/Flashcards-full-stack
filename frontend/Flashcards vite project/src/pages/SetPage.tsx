// frontend/src/pages/SetPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const SetPage = () => {
  const { setId } = useParams();
  const [set, setSet] = useState<any>(null);

  useEffect(() => {
    const fetchSet = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/sets/${setId}`);
        setSet(response.data);
      } catch (error) {
        console.error('Error fetching set:', error);
      }
    };
    if (setId) {
      fetchSet();
    }
  }, [setId]);

  return (
    <div>
      <h1>{set?.name}</h1>
      <p>{set?.description}</p>
      <Link to={`/sets/${setId}/flashcards`}>View Flashcards</Link>
    </div>
  );
};

export default SetPage;
