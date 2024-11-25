import React from 'react';
import ReactDOM from 'react-dom/client'; // For React 18+
import './index.css'; // Ensure Tailwind is imported
import HomePage from './pages/HomePage'; // Import your HomePage component

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <HomePage /> {/* Render your component here */}
  </React.StrictMode>
);

