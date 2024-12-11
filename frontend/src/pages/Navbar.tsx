import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the username from localStorage
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token from localStorage
    localStorage.removeItem('username'); // Clear the username from localStorage
    navigate('/login'); // Redirect to login page after logging out
  };

  return (
    <nav className="bg-cyan-500 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Display the logged-in user's name */}
        {username ? (
          <>
            <span className="ml-4 font-semibold text-gray-200">{username}</span>
            <button
              onClick={handleLogout}
              className="ml-4 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <span className="ml-4 font-semibold text-gray-200">Guest</span>
        )}

        {/* Navigation Links */}
        <div className="flex space-x-4">
          <Link to="/HomePage">Home</Link>
          <Link to="/flashcard-sets" className="hover:text-gray-200">
            Flashcard Sets
          </Link>
          <Link to="/collections" className="hover:text-gray-200">
            Collections
          </Link>
          <Link to="/admin" className="hover:text-gray-200">Admin</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
