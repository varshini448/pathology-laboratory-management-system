import React from "react";

const Header = ({ title, subtitle, actions }) => {
  return (
    <header className="common-header">
      <div className="common-header-content">
        <div>
          {title && <h1>{title}</h1>}
          {subtitle && <p>{subtitle}</p>}
        </div>

        {actions && <div className="common-header-actions">{actions}</div>}
      </div>
    </header>
  );
};

export default Header;