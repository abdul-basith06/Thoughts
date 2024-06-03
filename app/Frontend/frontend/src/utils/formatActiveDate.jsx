import React from 'react';

const formatActiveDate = (lastLogin) => {
  const currentDate = new Date();
  const loginDate = new Date(lastLogin);
  const timeDifference = currentDate.getTime() - loginDate.getTime();
  const secondsDifference = Math.floor(timeDifference / 1000);
  const minutesDifference = Math.floor(secondsDifference / 60);
  const hoursDifference = Math.floor(minutesDifference / 60);
  const daysDifference = Math.floor(hoursDifference / 24);

  if (daysDifference === 0) {
    if (hoursDifference === 0) {
      if (minutesDifference < 1) {
        return "Just now";
      } else {
        return `${minutesDifference}m ago`;
      }
    } else {
      return `${hoursDifference}h ago`;
    }
  } else if (daysDifference === 1) {
    return "Yesterday";
  } else if (daysDifference < 7) {
    return `${daysDifference}d ago`;
  } else {
    return "A week ago or more";
  }
};

const FormatActiveDate = ({ lastLogin }) => {
  return (
    <p className="text-md">
      Active: {formatActiveDate(lastLogin)}
    </p>
  );
};

export default FormatActiveDate;
