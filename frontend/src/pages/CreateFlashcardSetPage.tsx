import React, { useState } from 'react';
import axios from 'axios';

const CreateFlashcardSetPage: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/sets', { name, description });
      setName('');
      setDescription('');
    } catch (error) {
      console.error('Error creating flashcard set:', error);
    }
  };

  return (
    <div>
      <h1>Create Flashcard Set</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateFlashcardSetPage;
