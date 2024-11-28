// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../utils/api";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
 
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Use the loginUser function from api.ts
      const response = await loginUser(username, password); // Pass username and password
      
      if (response.token) {
        alert("Login successful!");
        localStorage.setItem('token', response.token); // Store the token in localStorage or elsewhere
        navigate("/home");
      } else {
        alert("Invalid credentials.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };
  

  const goToSignUp = () => {
    navigate("/signup"); // Navigate to SignUpPage
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome to TestVar Flashcards</h1>
      <p className="text-xl font-bold mb-6">Login</p>
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
        onClick={goToSignUp}
        className="p-2 bg-gray-500 text-white rounded-lg w-64 hover:bg-gray-600"
      >
        Sign Up
      </button>
    </div>
  );
};

export default LoginPage;
