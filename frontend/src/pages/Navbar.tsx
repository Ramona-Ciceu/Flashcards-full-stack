import React from "react";
import { Link } from "react-router-dom";


const Navbar: React.FC = () => {
    
  return (
    <nav className="bg-cyan-500 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand Logo */}
        <h1 className="text-xl font-bold">
          <Link to="/">Home</Link>
        </h1>
        {/* Navigation Links */}
        <div className="flex space-x-4">
          <Link to="/login" className="hover:text-gray-200">
            Login
          </Link>
          <Link to="/signup" className="hover:text-gray-200">
            Sign Up
          </Link>
          <Link to="/flashcard-sets" className="hover:text-gray-200">
            Flashcard Sets Page
          </Link>
          <Link to="/collections" className="hover:text-gray-200">
            Collections
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
