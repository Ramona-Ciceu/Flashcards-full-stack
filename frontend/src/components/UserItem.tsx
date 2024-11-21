import React from 'react';

interface UserProps {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

const UserItem: React.FC<UserProps> = ({ id, username, email, firstName, lastName }) => {
  return (
    <div key={id}>
      <h2>{username}</h2>
      <p>Name: {firstName} {lastName}</p>
      <p>Email: {email}</p>
    </div>
  );
};

export default UserItem;
