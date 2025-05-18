// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // Your global styles with Tailwind
import { AuthProvider } from './contexts/AuthContext.tsx'; // Import AuthProvider
import { Toaster } from 'sonner';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider> {/* Wrap App with AuthProvider */}
    <Toaster />
      <App />
       {/* Add Toaster for global toast notifications */}
    </AuthProvider>
  </React.StrictMode>
);