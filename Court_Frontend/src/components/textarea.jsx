import React from "react";

const Textarea = ({ className = "", ...props }) => {
  return (
    <textarea
      className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${className}`}
      {...props}
    />
  );
};

export default Textarea;
