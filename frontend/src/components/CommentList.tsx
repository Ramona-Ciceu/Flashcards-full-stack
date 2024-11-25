import React from 'react';
import CommentItem from './CommentItem';

interface Comment {
  comment: string;
  author: {
    username: string;
  };
}

interface CommentListProps {
  comments: Comment[];  // Accept comments as a prop
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  if (!comments.length) {
    return <p>No comments yet.</p>;
  }

  return (
    <ul>
      {comments.map((comment, index) => (
        <CommentItem key={index} comment={comment.comment} author={comment.author} />
      ))}
    </ul>
  );
};

export default CommentList;
