import React from "react";

export const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className="
  w-full
  flex
  flex-col
  gap-0
  rounded-2xl
  bg-neutral-white
  border-neutral-40
  break-words
  transition-all
  duration-200
  shadow-neutral-20
  shadow-lg
  hover:shadow-2xl
  "
  >
    {children}
  </div>
);
