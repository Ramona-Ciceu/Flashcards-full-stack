import React, { useEffect, useState } from "react";
import {
  getAllFlashcardCollections,
  deleteFlashcardCollection,
  updateFlashcardCollection,
  createFlashcardCollection,
  addSetToCollection,
  fetchSets,
} from "../utils/api";
import { Collection, Sets } from "../Types/type";

const CollectionPage: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [sets, setSets] = useState<Sets[]>([]);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | null>(null);
  const [selectedSetId, setSelectedSetId] = useState<number | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCollectionsAndSets() {
      if (!loaded) {
        const collectionsData = await getAllFlashcardCollections();
        const setsData = await fetchSets();
        setCollections(collectionsData);
        setSets(setsData);
        setLoaded(true);
      }
    }
    loadCollectionsAndSets();
  }, [loaded]);

  const handleAddCollection = async () => {
    if (!newCollectionName) {
      alert("Please provide a title for the collection.");
      return;
    }
  
    // Replace these with actual values from your application
    const comment = "New collection comment"; // Or get it from user input
    const setId = selectedSetId || 0; // Ensure a valid setId is provided
    const userId = localStorage.getItem('token') || '' 
  
    try {
      const newCollection = await createFlashcardCollection( newCollectionName);
      setCollections([...collections, newCollection]);
      setNewCollectionName("");
    } catch (error) {
      alert("Error creating collection.");
    }
  };
  
  const handleAddSetToCollection = async () => {
    if (!selectedCollectionId || !selectedSetId) {
      alert("Please select a collection and a set.");
      return;
    }
    try {
      await addSetToCollection(selectedCollectionId, selectedSetId);
      // Update the state with the updated collection
      setCollections((prevCollections) =>
        prevCollections.map((collection) =>
          collection.id === selectedCollectionId
            ? { ...collection, sets: [...(collection.sets || []), sets.find((s) => s.id === selectedSetId)!] }
            : collection
        )
      );
    } catch (error) {
      alert("Error adding set to collection.");
    }
  };

  const handleDeleteCollection = async (collectionId: number) => {
    try {
      await deleteFlashcardCollection(collectionId);
      setCollections(collections.filter((collection) => collection.id !== collectionId));
    } catch (error) {
      setError("Failed to delete collection");
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold text-center mb-8">Collections</h1>

      {/* Create Collection Form */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter collection name"
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddCollection}
          className="w-full bg-blue-500 text-white py-3 rounded-lg mt-3 font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Create Collection
        </button>
      </div>

      {/* Select Collection and Set */}
      <div className="mb-6">
        <select
          value={selectedCollectionId || ""}
          onChange={(e) => setSelectedCollectionId(Number(e.target.value))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a Collection</option>
          {collections.map((collection) => (
            <option key={collection.id} value={collection.id}>
              {collection.title}
            </option>
          ))}
        </select>

        <select
          value={selectedSetId || ""}
          onChange={(e) => setSelectedSetId(Number(e.target.value))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-3"
        >
          <option value="">Select a Set</option>
          {sets.map((set) => (
            <option key={set.id} value={set.id}>
              {set.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleAddSetToCollection}
          className="w-full bg-green-500 text-white py-3 rounded-lg mt-3 font-semibold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          Add Set to Collection
        </button>
      </div>

      {/* Display Collections */}
      <div>
        {collections.map((collection) => (
          <div key={collection.id} className="p-4 border border-gray-200 rounded-lg shadow-sm mb-4">
            <h2 className="text-2xl font-semibold">{collection.title}</h2>
            
            <button
              onClick={() => handleDeleteCollection(collection.id)}
              className="text-red-500 text-sm underline mt-2"
            >
              Delete Collection
            </button>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Sets in this Collection:</h3>
              {collection.sets?.length ? (
                collection.sets.map((set) => <p key={set.id}>{set.name}</p>)
              ) : (
                <p>No sets added yet.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionPage;
