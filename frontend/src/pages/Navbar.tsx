import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";


const Navbar: React.FC = () => {

  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve the username from localStorage
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);
  }, []);
    
  return (
    <nav className="bg-cyan-500 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
           {/* Display the logged-in user's name */}
           {username && (
         <span className="ml-4 font-semibold text-gray-200">
           {username}
         </span>
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
      
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
