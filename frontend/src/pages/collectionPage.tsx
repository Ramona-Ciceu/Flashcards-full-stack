// src/pages/CollectionPage.tsx
import React, { useState } from "react";

const CollectionPage: React.FC = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const [selectedSet, setSelectedSet] = useState<string>("");

  // Add a set to the collection
  const handleAddToCollection = () => {
    if (!selectedSet) {
      alert("Please select a set to add.");
      return;
    }
    setCollections([...collections, selectedSet]);
    setSelectedSet(""); // Reset the selection
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-4">Collections</h2>
      
      <div className="mb-6">
        <input
          type="text"
          value={selectedSet}
          onChange={(e) => setSelectedSet(e.target.value)}
          placeholder="Enter set name"
          className="p-2 border mb-4 w-full"
        />
        <button
          onClick={handleAddToCollection}
          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Add to Collection
        </button>
      </div>

      <h3 className="text-2xl font-semibold mb-4">My Collections</h3>
      <ul>
        {collections.map((collection, index) => (
          <li key={index} className="border-b py-2">
            {collection}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollectionPage;
