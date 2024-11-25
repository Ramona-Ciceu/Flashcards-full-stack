import React, { useEffect, useState } from 'react';
import { fetchUserById } from '../utils/api';; // Import the API function to fetch user data

interface UserProps {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string; 
}

const UserItem: React.FC<UserProps> = ({ id,  username, email, firstName, lastName, role }) => {
  // Define state for user data and loading status
  const [user, setUser] = useState<{
    id:number,
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  } | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data by ID when the component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await fetchUserById(id); // Call the API function
        setUser(data); // Update state with fetched data
      } catch (err) {
        setError('Failed to load user data');
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchUser(); // Invoke the function
  }, [id]); // Re-run effect if id changes

  // Handle loading and error states
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return <p>User not found</p>;
  }

  // Display user data
  return (
    <div key={id}>
      <h2>{user.username}</h2>
      <p>Name: {user.firstName} {user.lastName}</p>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
};

export default UserItem;

