import React from "react";

const AppLayout = ({
  sidebar,
  topbar,
  children,
}) => {
  return (
    <div className="app-layout">
      {sidebar && <aside className="app-layout-sidebar">{sidebar}</aside>}

      <div className="app-layout-main">
        {topbar && <header className="app-layout-topbar">{topbar}</header>}

        <main className="app-layout-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;