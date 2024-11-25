import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Import React Router components
import HomePage from './pages/HomePage';
import FlashcardPage from './pages/flashcardPage';
import LoginPage from './pages/loginPage';

const App: React.FC = () => {
  return (
    <Router>
      {/* Navigation bar */}
      <nav className="bg-gray-800 p-4">
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="text-white hover:text-gray-400">Home</Link>
          </li>
          <li>
            <Link to="/flashcards" className="text-white hover:text-gray-400">Flashcard Set</Link>
          </li>
          <li>
            <Link to="/login" className="text-white hover:text-gray-400">Login</Link>
          </li>
        </ul>
      </nav>

      {/* Routing for pages */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/flashcards" element={<FlashcardPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;
