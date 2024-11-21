import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import UserItem from '../components/UserItem';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  return (
    <div>
      <h1>User Profile</h1>
      {user ? (
        <UserItem
          id={user.id}
          username={user.username}
          email={user.email}
          firstName={user.firstName}
          lastName={user.lastName}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserProfilePage;
