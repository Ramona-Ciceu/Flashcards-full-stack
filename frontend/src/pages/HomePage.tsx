// src/pages/HomePage.tsx
import React from "react";
import { useNavigate } from "react-router-dom"; // To navigate to the other pages

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const goToFlashcardSetPage = () => {
    navigate("/flashcard-sets"); // Navigate to the flashcard sets page
  };

  const goToCollectionPage = () => {
    navigate("/collections"); // Navigate to the collection page
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Welcome to TestVar Flashcards</h1>
      <p className="text-lg mb-6">Create your own sets and collections!</p>
      
      <button
        onClick={goToFlashcardSetPage}
        className="p-3 bg-blue-500 text-white rounded-lg mb-4 hover:bg-blue-600"
      >
        Go to Flashcard Sets
      </button>

      <button
        onClick={goToCollectionPage}
        className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Go to Collections
      </button>
    </div>
  );
};

export default HomePage;
