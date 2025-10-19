import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChartComponent } from './ChartComponent';
import { IndicatorComponent } from './IndicatorComponent';
import { ErrorBoundary } from './ErrorBoundary';
import { App } from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    {/* <ChartComponent type="candlestick" symbol="TSLA"/> */}
     {/* <IndicatorComponent/> */}
      <App/>
  </ErrorBoundary>
);
