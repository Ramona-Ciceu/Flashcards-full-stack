import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../utils/api'; // Import the createUser function

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // Default to 'user'
  const [role, setRole] = useState('user'); 
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      const user = { username, password, role };
      // Create user through API
      const response = await createUser(user); 
      
      if (response.username) {
        alert('Signup successful! You can now log in.');
        navigate('/login'); // Navigate to login page
      } else {
        setErrorMessage('Failed to create user.');
      }
    } catch (error) {
      console.error(error)
      setErrorMessage('An error occurred during registration. Please try again.');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Create a New Account</h1>
      <p className="text-xl font-bold mb-6 hover:bg-green-600 ">Sign Up</p>

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
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="p-2 border mb-4 w-64"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <button
        onClick={handleSignUp}
        className="p-2 bg-blue-500 text-white rounded-lg mb-4 w-64 hover:bg-green-600"
      >
        Sign Up
      </button>

      <button
        onClick={() => navigate('/login')}
        className="p-2 bg-gray-500 text-white rounded-lg w-64 hover:bg-green-600"
      >
        Already have an account? Login
      </button>
    </div>
  );
};

export default SignupPage;
