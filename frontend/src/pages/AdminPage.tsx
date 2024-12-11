import React, { useEffect, useState } from "react";
import {
  fetchUser,
  fetchUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../utils/api"; // Adjust the import based on your API functions
import { User } from "../Types/type"; // Adjust the import based on your type definitions

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("user");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

  useEffect(() => {
    async function loadUsers() {
      try {
        const usersData = await fetchUser();
        if (usersData) {
          setUsers(usersData);
        }
      } catch (error) {
        setError("Failed to load users.");
      }
    }
    loadUsers();
  }, []);

  const handleCreateUser = async () => {
    try {
      const newUser = await createUser({ username, password, role });
      setUsers((prevUsers) => [...prevUsers, newUser]);
      setUsername("");
      setPassword("");
      setRole("user");
      setShowCreateForm(false); // Hide the form after creating a user
    } catch (error) {
      setError("Failed to create user.");
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUserId) {
      alert("Please select a user to update.");
      return;
    }
    try {
      await updateUser(selectedUserId, { username, password, role });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUserId
            ? { ...user, username, password, role }
            : user
        )
      );
      setSelectedUserId(null);
      setUsername("");
      setPassword("");
      setRole("user");
      setShowCreateForm(false); // Hide the form after updating a user
    } catch (error) {
      setError("Failed to update user.");
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      setError("Failed to delete user.");
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold text-center mb-8">Admin Page</h1>

      {/* Toggle Create User Form */}
      <button
        onClick={() => setShowCreateForm(!showCreateForm)}
        className="mb-6 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        {showCreateForm ? "Hide Form" : "Show Create User Form"}
      </button>

      {/* Create User Form */}
      {showCreateForm && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={handleCreateUser}
            className="w-full bg-green-500 text-white py-3 rounded-lg mt-2 font-semibold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            Create User
          </button>
          <button
            onClick={handleUpdateUser}
            className="w-full bg-blue-500 text-white py-3 rounded-lg mt-2 font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Update User
          </button>
        </div>
      )}

      {/* Display Users as Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="text-gray-600">
                <td className="px-6 py-4 border-b">{user.username}</td>
                <td className="px-6 py-4 border-b">{user.role}</td>
                <td className="px-6 py-4 border-b">
                  <button
                    onClick={() => {
                      setUsername(user.username);
                      setPassword(user.password);
                      setRole(user.role);
                      setSelectedUserId(user.id);
                    }}
                    className="bg-blue-500 text-white py-1 px-3 rounded mr-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
