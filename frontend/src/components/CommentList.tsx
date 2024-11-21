import React from 'react';
import CommentItem from './CommentItem';

interface Comment {
  comment: string;
  author: {
    username: string;
  };
}

interface CommentListProps {
  comments: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  return (
    <ul>
      {comments.map((comment, index) => (
        <CommentItem key={index} comment={comment.comment} author={comment.author} />
      ))}
    </ul>
  );
};

export default CommentList;
