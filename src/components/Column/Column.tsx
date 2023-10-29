import React from "react";
import "./Column.css";

interface ColumnProps {
  children: React.ReactNode;
  backgroundColor: string;
}

const Column: React.FC<ColumnProps> = ({ children, backgroundColor }) => {
  return (
    <div
      className="column"
      style={{
        backgroundColor
      }}>
      {children}
    </div>
  );
};

export default Column;
