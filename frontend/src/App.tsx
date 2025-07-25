// src/App.tsx

import React from 'react';
import AppRouter from './router';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <div className="App"> {/* Loại bỏ các lớp CSS flex-col min-h-screen khỏi đây, vì chúng đã ở DefaultLayout */}
      <AuthProvider>
        {/* Header và main đã được chuyển vào DefaultLayout */}
        <AppRouter />
      </AuthProvider>
    </div>
  );
}

export default App;