import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/api'; // Import the login function

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Call the login API function
      const response = await loginUser(username, password);
      
      // If the response contains a token, login is successful
      if (response.token) {
        localStorage.setItem('token', response.token); // Store the token
        alert('Login successful!');
        navigate('/home'); // Navigate to the home page
      } else {
        setErrorMessage('Invalid credentials.');
      }
    } catch (error) {
      setErrorMessage('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome to TestVar Flashcards</h1>
      <p className="text-xl font-bold mb-6">Login</p>

      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="p-2 border mb-4 w-64"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 border mb-4 w-64"
      />

      <button
        onClick={handleLogin}
        className="p-2 bg-blue-500 text-white rounded-lg mb-4 w-64 hover:bg-blue-600"
      >
        Login
      </button>

      <button
        onClick={() => navigate('/signup')}
        className="p-2 bg-gray-500 text-white rounded-lg w-64 hover:bg-gray-600"
      >
        Sign Up
      </button>
    </div>
  );
};

export default LoginPage;
