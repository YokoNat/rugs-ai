import React from "react";

interface Props {
  loading: boolean;
}

const ProgressBar: React.FC<Props> = ({ loading }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-1 z-[120] transition-all duration-700 bg-gradient-to-r from-buff-500 to-tea_green-500 ${
        loading ? "w-full" : "w-0"
      }`}
    />
  );
};

export default ProgressBar; 