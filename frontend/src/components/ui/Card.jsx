import React from "react";

const Card = ({
  children,
  title,
  subtitle,
  actions,
  className = "",
}) => {
  return (
    <section className={`ui-card ${className}`}>
      {(title || subtitle || actions) && (
        <header className="ui-card-header">
          <div>
            {title && <h2>{title}</h2>}
            {subtitle && <p>{subtitle}</p>}
          </div>

          {actions && (
            <div className="ui-card-actions">
              {actions}
            </div>
          )}
        </header>
      )}

      <div className="ui-card-body">
        {children}
      </div>
    </section>
  );
};

export default Card;