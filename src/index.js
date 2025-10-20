import React from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from './ErrorBoundary';
import { App } from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
      <App/>
  </ErrorBoundary>
);
