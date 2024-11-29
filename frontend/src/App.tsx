//frontend/ src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FlashcardSetPage from "./pages/createFlashcardPage";
import CollectionPage from "./pages/collectionPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/flashcard-sets" element={<FlashcardSetPage />} />
        <Route path="/collections" element={<CollectionPage />} />
      </Routes>
    </Router>
  );
};

export default App;
