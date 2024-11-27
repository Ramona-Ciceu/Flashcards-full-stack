import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FlashcardPage from './pages/flashcardPage';
import UserProfilePage from './pages/UserProfilePage';

function App() {
  return (
    <Router>
      {/* Routing for pages */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/flashcards"
          element={
            <>
              {/* Navigation Bar specific to Flashcard Page */}
              <nav className="bg-blue-500 p-2">
                <ul className="flex space-x-4">
                  <li>
                    <Link to="/flashcards/view" className="text-white hover:text-gray-400">View Flashcards</Link>
                  </li>
                  <li>
                    <Link to="/flashcards/create" className="text-white hover:text-gray-400">Create Flashcard</Link>
                  </li>
                </ul>
              </nav>
              <FlashcardPage />
            </>
          }
        />
        <Route path="/userprofile" element={<UserProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
