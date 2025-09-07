import React from 'react';

const Message = ({ variant = 'info', children }) => {
  const base = "p-3 mb-4 rounded-lg text-sm font-medium";
  const styles = {
    danger: "bg-red-100 text-red-700 border border-red-300",
    success: "bg-green-100 text-green-700 border border-green-300",
    info: "bg-blue-100 text-blue-700 border border-blue-300",
  };

  return (
    <div className={`${base} ${styles[variant] || styles.info}`}>
      {children}
    </div>
  );
};

export default Message;
