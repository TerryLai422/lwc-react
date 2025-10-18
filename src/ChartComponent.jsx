import { createChart, ColorType, LineSeries, CandlestickSeries, HistogramSeries } from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';
import { fetchChartData } from './api/chartApi';
import { calculateMovingAverageIndicatorValues } from './utils/moving-average-calculation';


const ChartComponent = props => {
    const chartContainerRef = useRef(null);
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const {
        symbol = 'TSLA', // Add default symbol prop
        type = 'line',
        colors: {
            backgroundColor = 'white',
            lineColor = 'blue',
            textColor = 'black',
            areaTopColor = '#2962FF',
            areaBottomColor = 'rgba(41, 98, 255, 0.28)',
        } = {},
    } = props;

    // Update useEffect to use symbol prop
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const data = await fetchChartData(type, symbol);
                setChartData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [symbol, type]); // Add symbol to dependency array


    // Helper: create and apply multiple moving averages
    const addMovingAverages = (chart, data) => {
        const movingAverages = [
            { length: 20, color: 'orange' },
            { length: 50, color: 'green' },
            { length: 200, color: 'pink' },
        ];

        for (const ma of movingAverages) {
            const maData = calculateMovingAverageIndicatorValues(data, {
                length: ma.length
            });

            const maSeries = chart.addSeries(LineSeries, {
                color: ma.color,
                lineWidth: 1,
            });

            maSeries.setData(maData);
        }
    };

    // Helper: calculate simple moving average for volume
    const calculateVolumeMovingAverage = (data, length = 20) => {
        const result = [];
        for (let i = 0; i < data.length; i++) {
            if (i < length - 1) continue;
            const slice = data.slice(i - length + 1, i + 1);
            const avg = slice.reduce((sum, d) => sum + (d.value || 0), 0) / length;
            result.push({ time: data[i].time, value: avg });
        }
        return result;
    };

    // Helper: add volume histogram
    const addVolumeHistogram = (chart, data) => {
        const volumeSeries = chart.addSeries(HistogramSeries, {
            priceFormat: { type: 'volume' },
            priceScaleId: 'volume', // separate scale from price
            scaleMargins: {
                top: 0.9, // bottom 10% for volume
                bottom: 0,
            },
        });

        const volumeData = data
            .filter(item => item.volume !== undefined)
            .map(item => ({
                time: item.time,
                value: item.volume,
                color:
                    item.close && item.open
                        ? item.close > item.open
                            ? 'rgba(38, 166, 154, 0.8)' // green for up day
                            : 'rgba(239, 83, 80, 0.8)'  // red for down day
                        : 'rgba(100, 149, 237, 0.5)', // neutral (for line data)
            }));

        volumeSeries.setData(volumeData);

        // Add 20-day moving average for volume
        const volMAData = calculateVolumeMovingAverage(volumeData, 20);
        const volMASeries = chart.addSeries(LineSeries, {
            color: 'rgba(80, 91, 239, 0.8)', // orange line
            lineWidth: 1.5,
            priceScaleId: 'volume', // share same scale
        });
        volMASeries.setData(volMAData);
    };

    useEffect(() => {
        // Validate chartContainerRef first
        if (!chartContainerRef.current) {
            return;
        }

        // Validate data with more detailed logging
        if (!chartData || !Array.isArray(chartData)) {
            console.error('Chart data must be an array');
            return;
        }

        if (chartData.length === 0) {
            console.warn('Chart data array is empty');
            return;
        }

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: backgroundColor },
                textColor,
            },
            width: chartContainerRef.current.clientWidth,
            height: 300,
        });

        const seriesDefinition = type == 'line' ? LineSeries: CandlestickSeries;
        
        const mainSeries = chart.addSeries(seriesDefinition, {
            color: lineColor,
            topColor: areaTopColor,
            bottomColor: areaBottomColor,
        });

        try {
            mainSeries.setData(chartData);
            addMovingAverages(chart, chartData);
            addVolumeHistogram(chart, chartData);

            chart.timeScale().fitContent();
        } catch (error) {
            console.error('Error setting chart data:', error);
            return;
        }

        const handleResize = () => {
            chart.applyOptions({ 
                width: chartContainerRef.current.clientWidth 
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [chartData, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]);

    if (isLoading) {
        return <div>Loading chart data...</div>;
    }

    if (error) {
        return <div>Error loading chart data: {error}</div>;
    }

    return (
        <div
            ref={chartContainerRef}
            style={{ 
                width: '100%', 
                height: '300px'
            }}
        />
    );
};

export { ChartComponent };