import React, { useState } from 'react';
import { ChartComponent } from './ChartComponent';
import { IndexComponent } from './IndexComponent';
import { ErrorBoundary } from './ErrorBoundary';
import { Tabs, Tab, Box } from '@mui/material';

export function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [symbol, setSymbol] = useState('TSLA');          // Actual symbol used for fetching
  const [inputSymbol, setInputSymbol] = useState('TSLA'); // Temporary input field value

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Update input as user types
  const handleInputChange = (event) => {
    setInputSymbol(event.target.value.toUpperCase());
  };

  // Only fetch when Enter is pressed
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setSymbol(inputSymbol.trim());
    }
  };

  return (
    <ErrorBoundary>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          {/* Tabs */}
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="SP500" />
            <Tab label="Stock Chart" />
          </Tabs>

          {/* Symbol input — visible only in Stock Chart tab */}
          {activeTab === 1 && (
            <Box>
              <input
                type="text"
                value={inputSymbol}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="Enter symbol and press Enter"
                style={{
                  padding: '6px 10px',
                  fontSize: '14px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              />
            </Box>
          )}
        </Box>

        {/* Tab content */}
        {activeTab === 0 && <IndexComponent />}
        {activeTab === 1 && <ChartComponent type="candlestick" symbol={symbol} />}
      </Box>
    </ErrorBoundary>
  );
}