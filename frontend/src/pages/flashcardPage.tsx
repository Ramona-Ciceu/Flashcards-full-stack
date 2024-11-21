import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import FlashcardList from '../components/flashcardList';
import CommentForm from '../components/CommentForm';
import CommentList from '../components/CommentList';

interface Flashcard {
  id: number;
  question: string;
  solution: string;
  difficulty: string;
}

interface Comment {
  comment: string;
  author: {
    username: string;
  };
}

const FlashcardPage: React.FC = () => {
  const { setId } = useParams<{ setId: string }>();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/sets/${setId}/cards`);
        setFlashcards(response.data);
      } catch (error) {
        console.error('Error fetching flashcards:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/sets/${setId}`);
        setComments(response.data.comments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    if (setId) {
      fetchFlashcards();
      fetchComments();
    }
  }, [setId]);

  return (
    <div>
      <h1>Flashcards</h1>
      <FlashcardList flashcards={flashcards} />
      <h2>Comments</h2>
      <CommentList comments={comments} />
      <CommentForm setId={Number(setId)} />
    </div>
  );
};

export default FlashcardPage;
