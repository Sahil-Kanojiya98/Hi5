import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const TimeAgo = ({ date }) => {
  const dateObj = new Date(date);  
  const timeAgo = formatDistanceToNow(dateObj, { addSuffix: true });
  return <span>{timeAgo}</span>;
};

export default TimeAgo;