import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Flashcard from '../components/flashcardList';


interface Flashcard {
  question: string;
  answer: string;
  difficulty: 'Easy' | 'Medium' | 'Hard'; // Add difficulty here
}
interface Comment {
    id: number;
    text: string;
    createdAt: string;
    user: User;
  }

interface Set {
  id: number;
  name: string;
  description: string;
  user: User;
  flashcards: Flashcard[]; 
  comments: Comment[];
}
interface User {
    id: number;
    username: string;
    role: string; // 'user' or 'admin'
  }

const SetPage: React.FC = () => {
  const [sets, setSets] = useState<Set[]>([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState<User | null>(null); // Assuming you have user info from login

  useEffect(() => {
    // Fetch sets and user info
    const fetchSets = async () => {
      try {
        const setsResponse = await axios.get('/api/sets');
        setSets(setsResponse.data);
      } catch (error) {
        console.error('Error fetching sets:', error);
      }
    };
    fetchSets();
      // Fetch logged-in user info (assuming you have user data available)
    const fetchUser = async () => {
        try {
          const userResponse = await axios.get('/api/user');
          setUser(userResponse.data);
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      };
      fetchUser();
    }, []);

     // Handle adding a comment
  const handleAddComment = async (setId: number) => {
    if (!newComment.trim()) return;

    try {
      await axios.post(`/api/set/${setId}/comments`, {
        text: newComment,
        userId: user?.id, // Ensure user is logged in
      });

      // Refresh the comments for the set
      const response = await axios.get(`/api/set/${setId}/comments`);
      const updatedSets = sets.map((set) => {
        if (set.id === setId) {
          return { ...set, comments: response.data };
        }
        return set;
      });
      setSets(updatedSets);
      setNewComment(''); // Clear the input field
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('An error occurred while adding the comment');
    }
  };

  // Function to handle the delete request
  const handleDelete = async (id: number) => {
    try {
      // Make DELETE request to the backend
      await axios.delete(`/api/set/${id}`);
      // Remove the deleted set from the state
      setSets((prevSets) => prevSets.filter((set) => set.id !== id));
      alert('Flashcard set deleted successfully');
    } catch (error) {
      console.error('Error deleting set:', error);
      alert('An error occurred while deleting the flashcard set');
    }
  };

  return (
    <div>
      <h1>Flashcard Sets</h1>
      <ul>
        {sets.map((set) => (
          <li key={set.id}>
            <h2>{set.name}</h2>
            <p>{set.description}</p>
            <p>Created by: {set.user.username}</p>
            {user && user.role === 'admin' && (
              <button onClick={() => handleDelete(set.id)}>Delete</button>
            )}
            {user && set && ( <button onClick={() => handleAddComment(set.id)}>Add Comment</button>)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SetPage;