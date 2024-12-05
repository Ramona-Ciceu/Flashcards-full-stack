import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getAllFlashcardCollections,
  deleteFlashcardCollection,
  updateFlashcardCollection,
  createFlashcardCollection,
  addSetToCollection,
  fetchFlashcardSet
} from '../utils/api'; 
import { Collection } from '../Types/type';

const CollectionPage: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [editingCollectionID, setEditingCollectionId] = useState<number | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | null>(null);

  useEffect(() => {
    async function LoadCollections() {
      if (!loaded) {
        const data = await getAllFlashcardCollections();
        setCollections(data);
        setLoaded(true);
      }
    }
    LoadCollections();
  }, [loaded]);

  const handleAddCollection = async () => {
    if (!newCollectionName) {
      alert("Please provide a title for the collection.");
      return;
    }
    try {
      const user_id = localStorage.getItem('token') || '';
      const set_id = localStorage.getItem('setId') || '';
      if (!user_id || !set_id) {
        alert("User ID or Set ID is missing.");
        return;
      }
      
      const newCollection = await createFlashcardCollection(
        newCollectionName,  
        parseInt(set_id),    
        parseInt(user_id),   
        newCollectionName    
      );
      setCollections([...collections, newCollection]);
      setNewCollectionName(""); // Clear the input after adding
    } catch (error) {
      alert("Error creating collection.");
    }
  };

  const handleSelectCollection = async (setId: number) => {
    setSelectedCollectionId(setId);
    const sets = await fetchFlashcardSet(setId);
    console.log(sets);
    // Assuming you want to add sets to the collection, not replace them
    setCollections((prevCollections) =>
      prevCollections.map((collection) =>
        collection.id === setId ? { ...collection, sets } : collection
      )
    );
  };

  const handleEditSet = async (collectionId: number, newComment: string, setId: number, userId: number, newTitle: string) => {
    try {
      const updatedSet = await updateFlashcardCollection(
        collectionId,          
        newComment,            
        setId,                
        userId,                
        newTitle               
      );
      setCollections(collections.map((set) => (set.id === setId ? updatedSet : set)));
      setNewCollectionName(""); // Reset input field after update
    } catch (error) {
      alert("Error updating set.");
    }
  };

  const handleDelete = async (collectionId: number) => {
    try {
      await deleteFlashcardCollection(collectionId);
      setCollections((prev) => prev.filter((collection) => collection.id !== collectionId));
    } catch (error) {
      setError('Failed to delete collection');
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold text-center mb-8">Collections</h1>

      {/* Create Collection Form */}
      <div className="mb-6">
        <div className="space-y-4">
          <input
            type="text"
            name="title"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            placeholder="Enter collection title"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="comment"
            value={newCollectionName} // You may want a separate state for comment
            onChange={(e) => setNewCollectionName(e.target.value)}
            placeholder="Enter collection comment"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddCollection}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Create Collection
          </button>
        </div>
      </div>

      {/* Select Collection */}
      <div className="mb-6">
        <select
          onChange={(e) => setSelectedCollectionId(Number(e.target.value))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={undefined}>Select a collection</option>
          {collections.map((collection) => (
            <option key={collection.id} value={collection.id}>
              {collection.title}
            </option>
          ))}
        </select>
      </div>

      {/* Display Existing Collections */}
      <div>
        {collections.map((collection) => (
          <div key={collection.id} className="flex justify-between items-center mb-4 p-4 border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold">{collection.title}</h3>
            <button
              onClick={() => handleDelete(collection.id)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionPage;
