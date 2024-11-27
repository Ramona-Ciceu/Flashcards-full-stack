import { Link } from 'react-router-dom';
import { useState, ChangeEvent, FormEvent } from 'react';
import React from 'react';

const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginDetails, setLoginDetails] = useState({ username: '', password: '' });

  // Explicitly type the event as ChangeEvent<HTMLInputElement>
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Explicitly type the event as FormEvent<HTMLFormElement>
  const handleLoginSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Login Details:', loginDetails);
    // Add your login logic here
  };

  return (
    <header className="bg-blue-500 text-white p-4">
      <nav className="flex justify-between items-center">
        <h1 className="text-lg font-bold">TestVar</h1>
        <div className="flex items-center">
          <Link to="/" className="px-4 hover:underline">Home</Link>
          <Link to="/sets" className="px-4 hover:underline">Flashcard Sets</Link>
          <Link to="/create-set" className="px-4 hover:underline">Create Set</Link>
          <button
            onClick={() => setIsLoginOpen((prev) => !prev)}
            className="px-4 py-2 bg-white text-blue-500 font-bold rounded hover:bg-blue-100 transition"
          >
            Login
          </button>
        </div>
      </nav>

      {isLoginOpen && (
        <div className="bg-white text-black p-4 mt-2 rounded shadow-lg max-w-sm mx-auto">
          <form onSubmit={handleLoginSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={loginDetails.username}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={loginDetails.password}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded font-bold hover:bg-blue-600 transition"
            >
              Login
            </button>
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;
