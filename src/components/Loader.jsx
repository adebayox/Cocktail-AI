import React from "react";

const Loader = () => {
  return (
    <div className="fixed bg-[rgba(0,0,0,0.6)] inset-0 z-[9999] grid place-items-center">
      <span className="loader"></span>
    </div>
  );
};

export default Loader;
