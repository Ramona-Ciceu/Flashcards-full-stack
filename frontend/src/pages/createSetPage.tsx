
import { useState } from 'react';
import { createSet } from '../utils/api';

const CreateSet = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [userId] = useState(1); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createSet({ name, description, userId });
    setName('');
    setDescription('');
    alert('Set created successfully!');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h1 className="text-2xl font-bold">Create New Flashcard Set</h1>
      <input
        type="text"
        placeholder="Set Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 my-2 w-full"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 my-2 w-full"
      ></textarea>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">
        Create
      </button>
    </form>
  );
};

export default CreateSet;

