import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './App.css';
<base href="/" />
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);