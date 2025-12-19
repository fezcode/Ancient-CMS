import React from 'react';
import Sidebar from './Sidebar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex bg-ancient-950 min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-72 p-10">
        {children}
      </main>
    </div>
  );
};

export default Layout;
