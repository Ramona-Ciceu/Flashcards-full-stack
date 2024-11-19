// frontend/src/App.tsx

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SetPage from './pages/SetPage';
import FlashcardPage from './pages/FlashcardPage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sets/:setId" element={<SetPage />} />
        <Route path="/sets/:setId/flashcards" element={<FlashcardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default App;
