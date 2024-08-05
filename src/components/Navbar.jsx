import { HeartIcon } from "@heroicons/react/24/outline";
import React from "react";

function Navbar({ numOfResults, children }) {
  return (
    <div className="navbar">
      <div className="navbar__logo">LOGO</div>
      {children}
    </div>
  );
}

export default Navbar;
