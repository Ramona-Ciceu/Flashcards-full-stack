import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../utils/api"; // Adjust the import as needed

const SignUpPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default to 'user', can be changed if needed
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      const response = await signupUser({ username, password, role: 'user' });
      alert('Signup successful!');
    } catch (error) {
      console.error('Sign-up error:', error);
      alert('Sign-up failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
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
      <div className="mb-4">
        <label className="mr-2">Role:</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="p-2 border"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button
        onClick={handleSignUp}
        className="p-2 bg-green-500 text-white rounded-lg w-64 hover:bg-green-600"
      >
        Sign Up
      </button>
    </div>
  );
};

export default SignUpPage;
