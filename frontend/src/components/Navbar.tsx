import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <ul className="flex space-x-4 text-white">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/create-flashcard-set">Create Set</Link></li>
        <li><Link to="/login">Login</Link></li>
        {/* Add other navigation links as needed */}
      </ul>
    </nav>
  );
};

export default Navbar;
