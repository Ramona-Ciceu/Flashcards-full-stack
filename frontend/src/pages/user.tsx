import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    axios.get(`/api/users/${userId}`)
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error('Error fetching user:', error);
      });
  }, [userId]);

  return (
    <div>
      {user ? (
        <>
          <h1>{user.name}</h1>
          <p>Email: {user.email}</p>
          <h2>Flashcard Sets Created:</h2>
          <ul>
            {user.flashcardSets.map((set: any) => (
              <li key={set.id}>
                <a href={`/sets/${set.id}`}>{set.name}</a>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserProfile;
