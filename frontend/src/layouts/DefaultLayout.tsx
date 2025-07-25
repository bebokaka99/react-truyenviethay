// src/layouts/DefaultLayout.tsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header'; 

const DefaultLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet /> {/* Outlet sẽ render các route con */}
      </main>
      {/* có thể thêm Footer ở đây nếu muốn */}
    </div>
  );
};

export default DefaultLayout;