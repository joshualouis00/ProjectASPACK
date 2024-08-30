import React from 'react';

const DateTimeFormatted: React.FC = () => {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-11, so add 1
  const year = now.getFullYear();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

  return (
    <span>{formattedDateTime}</span>
  );
};

export default DateTimeFormatted;
