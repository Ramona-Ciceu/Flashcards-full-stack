import React, { useState } from 'react';
import axios from 'axios';

interface CommentFormProps {
  setId: number;
}

const CommentForm: React.FC<CommentFormProps> = ({ setId }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:3000/api/set/${setId}/comment`, { comment });
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Comment:
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      </label>
      <button type="submit">Add Comment</button>
    </form>
  );
};

export default CommentForm;
