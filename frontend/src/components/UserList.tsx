import React from 'react';
import UserItem from './UserItem';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface UserListProps {
  users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
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
        />
      ))}
    </div>
  );
};

export default UserList;
