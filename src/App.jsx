import React from "react";
import { ChartComponent } from "./ChartComponent";
import { ErrorBoundary } from "./ErrorBoundary";

export default function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Trading Chart Demo</h1>
      <div style={{ height: '400px', width: '100%' }}>
        <ErrorBoundary>
          <ChartComponent />
        </ErrorBoundary>
      </div>
    </div>
  );
}
