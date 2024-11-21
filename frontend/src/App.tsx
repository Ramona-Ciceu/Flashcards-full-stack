import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FlashcardPage from './pages/flashcardPage';
import HomePage from './pages/HomePage';
import UserProfilePage from './pages/UserProfilePage';
import UserSetsPage from './pages/userSetsPage';
import CreateFlashcardSetPage from './pages/CreateFlashcardSetPage';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/set/:setId/flashcards" element={<FlashcardPage />} />
        <Route path="/user/:userId" element={<UserProfilePage />} />
        <Route path="/user/:userId/sets" element={<UserSetsPage />} />
        <Route path="/create-flashcard-set" element={<CreateFlashcardSetPage />} />
      </Routes>
    </Router>
  );
};

export default App;
