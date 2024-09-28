import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const TimeAgo = ({ date , className }) => {
  const dateObj = new Date(date);  
  const timeAgo = formatDistanceToNow(dateObj, { addSuffix: true });
  return <span className={className} >{timeAgo}</span>;
};

export default TimeAgo;