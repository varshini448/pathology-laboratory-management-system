import React from "react";

const Navbar = ({ brand = "Pathology Laboratory", children }) => {
  return (
    <nav className="common-navbar" aria-label="Primary navigation">
      <div className="common-navbar-brand">{brand}</div>

      {children && (
        <div className="common-navbar-content">
          {children}
        </div>
      )}
    </nav>
  );
};

export default Navbar;