import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChartComponent } from './ChartComponent';
import { ErrorBoundary } from './ErrorBoundary';

const root = createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <ChartComponent symbol="MMM"/>
  </ErrorBoundary>
);
