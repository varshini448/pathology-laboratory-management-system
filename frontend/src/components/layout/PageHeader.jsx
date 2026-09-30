import React from "react";

const PageHeader = ({
  title,
  description,
  eyebrow,
  actions,
  breadcrumbs,
}) => {
  return (
    <header className="page-header">
      {breadcrumbs && (
        <div className="page-header-breadcrumbs">
          {breadcrumbs}
        </div>
      )}

      <div className="page-header-content">
        <div>
          {eyebrow && (
            <p className="page-header-eyebrow">
              {eyebrow}
            </p>
          )}

          <h1>{title}</h1>

          {description && (
            <p className="page-header-description">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="page-header-actions">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
};

export default PageHeader;