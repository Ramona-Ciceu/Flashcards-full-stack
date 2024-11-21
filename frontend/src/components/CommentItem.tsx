import React from 'react';

interface CommentProps {
  comment: string;
  author: {
    username: string;
  };
}

const CommentItem: React.FC<CommentProps> = ({ comment, author }) => {
  return (
    <li>
      <p>{comment}</p>
      <small>by {author.username}</small>
    </li>
  );
};

export default CommentItem;
