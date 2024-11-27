import React from 'react';
import ReactDOM from 'react-dom/client'; 
import './index.css'; // Ensure Tailwind is imported
import App from './App';

// Create the root element in the DOM
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Render the App component inside the root element
root.render(
  <React.StrictMode>
    <App /> {/* Render the App component */}
  </React.StrictMode>,
);