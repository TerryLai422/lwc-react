// App.js
import React, { useState } from 'react';
import { ChartComponent } from './ChartComponent';

export const App = () => {
  const [symbol, setSymbol] = useState('TSLA');
  const [inputSymbol, setInputSymbol] = useState(symbol);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSymbol(inputSymbol.toUpperCase());
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Stock Chart Viewer</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter symbol (e.g. AAPL)"
          value={inputSymbol}
          onChange={(e) => setInputSymbol(e.target.value)}
          style={{
            padding: '8px',
            fontSize: '16px',
            width: '200px',
            marginRight: '10px',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '8px 16px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Load
        </button>
      </form>

      <ChartComponent type="candlestick" symbol={symbol} />
    </div>
  );
};
