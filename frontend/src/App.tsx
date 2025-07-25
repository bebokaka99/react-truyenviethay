// src/App.tsx

import React from 'react';
import AppRouter from './router';
import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider

function App() {
  return (
    <div className="App">
      <AuthProvider> {/* Bọc AppRouter trong AuthProvider */}
        <AppRouter />
      </AuthProvider>
    </div>
  );
}

export default App;