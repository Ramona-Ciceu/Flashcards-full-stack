import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Send login request directly from here
      const response = await axios.post('http://localhost:3000/login', {
        username,
        password,
      });

      localStorage.setItem("username", response.data.user.username);
    

      console.log(response)
      console.log(response.data.user_id)

      // If the response contains a token, login is successful
      if (response.data.user_id) {
        localStorage.setItem('token', response.data.user_id); // Store the token
        alert('Login successful!');
        navigate('/HomePage'); // Navigate to the home page
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
        className="p-2 bg-blue-500 text-white rounded-lg mb-4 w-64 hover:bg-green-600"
      >
        Login
      </button>

      <button
        onClick={() => navigate('/signup')}
        className="p-2 bg-gray-500 text-white rounded-lg w-64 hover:bg-green-600"
      >
        Sign Up
      </button>
    </div>
  );
};

export default LoginPage;
