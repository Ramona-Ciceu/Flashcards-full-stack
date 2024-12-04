import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllFlashcardCollections, getFlashcardCollectionsByUser, deleteFlashcardCollection } from '../utils/api'; 

const CollectionPage = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useParams(); // Assuming userId is passed as a URL param

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        if (userId) {
          const userCollections = await getFlashcardCollectionsByUser(Number(userId), 0); 
          setCollections(userCollections);
        } else {
          const allCollections = await getAllFlashcardCollections();
          setCollections(allCollections);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError('Failed to load collections');
      }
    };

    fetchCollections();
  }, [userId]);

  const handleDelete = async (collectionId: number) => {
    try {
      await deleteFlashcardCollection(collectionId);
      setCollections((prev) => prev.filter((collection) => collection.id !== collectionId));
    } catch (error) {
      setError('Failed to delete collection');
    }
  };

  if (loading) return <div>Loading collections...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Flashcard Collections</h2>
      <button onClick={() => navigate('/create-collection')}>Create New Collection</button>
      <div className="collections-list">
        {collections.length === 0 ? (
          <p>No collections found.</p>
        ) : (
          collections.map((collection) => (
            <div key={collection.id} className="collection-item">
              <h3>{collection.name}</h3>
              <p>{collection.comment}</p>
              <button onClick={() => navigate(`/collection/${collection.id}`)}>View Collection</button>
              <button onClick={() => handleDelete(collection.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CollectionPage;
