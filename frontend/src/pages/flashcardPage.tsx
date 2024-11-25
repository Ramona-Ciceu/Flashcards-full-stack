import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchFlashcardSet, fetchSetById } from '../utils/api';  // Import from api.ts
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
  const { setId } = useParams<{ setId: string }>();  // Getting the `setId` from URL params
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);  // State to store flashcards
  const [comments, setComments] = useState<Comment[]>([]);  // State to store comments

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await fetchFlashcardSet(Number(setId));  // Fetch flashcards based on `setId`
        setFlashcards(response);  // Set the fetched flashcards
      } catch (error) {
        console.error('Error fetching flashcards:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetchSetById(Number(setId));  // Fetch comments for the set
        setComments(response.comments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    if (setId) {
      fetchFlashcards();
      fetchComments();
    }
  }, [setId]);  // Re-run effect if `setId` changes

  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-4xl font-bold text-center">Flashcard Page</h1>
      <div>
        <h1>Flashcards</h1>
        <FlashcardList flashcards={flashcards} />  {/* Passing flashcards as a prop */}
        <h2>Comments</h2>
        <CommentList comments={comments} />  {/* Passing comments as a prop */}
        <CommentForm setId={Number(setId)} />  {/* Passing setId to CommentForm */}
      </div>
    </div>
  );
};

export default FlashcardPage;
