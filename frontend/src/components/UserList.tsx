import React, { useEffect, useState } from 'react';
import { fetchUsers } from '../utils/api'; // Import the API function to fetch users
import UserItem from './UserItem';

const UserList: React.FC = () => {
  // Define state for users list and loading status
  const [users, setUsers] = useState<{
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  }[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users when the component mounts
  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const data = await fetchUsers(); // Call the API function
        setUsers(data); // Update state with fetched data
      } catch (err) {
        setError('Failed to load users');
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchUsersData(); // Invoke the function to fetch data
  }, []); // Empty dependency array to run effect only once on mount

  // Handle loading and error states
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (users.length === 0) {
    return <p>No users found</p>;
  }

  // Render the list of users
  return (
    <div>
      {users.map(user => (
        <UserItem
          key={user.id}
          id={user.id}
          username={user.username}
          email={user.email}
          firstName={user.firstName}
          lastName={user.lastName}
          role={user.role}
        />
      ))}
    </div>
  );
};

export default UserList;
