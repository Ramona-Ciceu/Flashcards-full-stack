import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Collection {
  id: number;
  name: string;
  description: string;
  sets: Set[];
}

interface Set {
  id: number;
  name: string;
  description: string;

}

const CollectionPage: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [newCollection, setNewCollection] = useState({ name: '', description: '' });

  // Fetch collections when the component mounts
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get('/api/collections');
        setCollections(response.data);
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };
    fetchCollections();
  }, []);

  // Handle form submission to create a new collection
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/collections', newCollection);
      setCollections([...collections, response.data]);
      setNewCollection({ name: '', description: '' }); // Reset form
    } catch (error) {
      console.error('Error creating collection:', error);
    }
  };

  return (
    <div>
      <h1>Collections</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newCollection.name}
          onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
          placeholder="Collection Name"
        />
        <textarea
          value={newCollection.description}
          onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
          placeholder="Collection Description"
        />
        <button type="submit">Create Collection</button>
      </form>

      <h2>All Collections</h2>
      <ul>
        {collections.map((collection) => (
          <li key={collection.id}>
            <h3>{collection.name}</h3>
            <p>{collection.description}</p>
            <h4>Sets in this collection:</h4>
            <ul>
              {collection.sets.map((set) => (
                <li key={set.id}>
                  <strong>{set.name}</strong>: {set.description}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollectionPage;
