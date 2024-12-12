//frontend/ src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import FlashcardSetPage from "./pages/FlashcardSetPage";
import CollectionPage from "./pages/collectionPage";
import Navbar from "./pages/Navbar";
import AdminPage from "./pages/AdminPage";



const App: React.FC = () => {
  return (
    <Router>
      {/* Navbar appears on every page */}
      <Navbar />
      {/* Main content area */}
      <div className="p-4">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/flashcard-sets" element={<FlashcardSetPage />} />
          <Route path="/collections" element={<CollectionPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
