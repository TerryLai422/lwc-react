import React, { useState } from 'react';
import { ChartComponent } from './ChartComponent';
import { IndexComponent } from './IndexComponent';
import { ErrorBoundary } from './ErrorBoundary';
import { Tabs, Tab, Box, ToggleButton, ToggleButtonGroup } from '@mui/material';

export function App() {
  const [activeTab, setActiveTab] = useState(0);

  // For Stock Chart tab
  const [symbol, setSymbol] = useState('TSLA');
  const [inputSymbol, setInputSymbol] = useState('TSLA');

  // For Index tab
  const [indexSymbol, setIndexSymbol] = useState('SPX');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle typing in stock symbol
  const handleInputChange = (event) => {
    setInputSymbol(event.target.value.toUpperCase());
  };

  // Only update symbol when Enter is pressed
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setSymbol(inputSymbol.trim());
    }
  };

  // Handle index change
  const handleIndexChange = (event, newIndex) => {
    if (newIndex !== null) setIndexSymbol(newIndex);
  };

  return (
    <ErrorBoundary>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        {/* Header section with Tabs and optional input */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Indices" />
            <Tab label="Stock Chart" />
          </Tabs>

          {/* Symbol input — only visible on Stock Chart tab */}
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

        {/* Tab 1: Indices */}
        {activeTab === 0 && (
          <Box>
            {/* Index selection buttons */}
            <Box sx={{ mb: 2, textAlign: 'center' }}>
              <ToggleButtonGroup
                color="primary"
                value={indexSymbol}
                exclusive
                onChange={handleIndexChange}
                size="small"
              >
                <ToggleButton value='SPX' >S&P 500</ToggleButton>
                <ToggleButton value='NDX' >Nasdaq 100</ToggleButton>
                <ToggleButton value='DJI' >Dow Jones</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Display the selected index */}
            <IndexComponent index={indexSymbol} />
          </Box>
        )}

        {/* Tab 2: Stock Chart */}
        {activeTab === 1 && (
          <ChartComponent type="candlestick" symbol={symbol} />
        )}
      </Box>
    </ErrorBoundary>
  );
}