import { createChart, ColorType, LineSeries, CandlestickSeries, HistogramSeries } from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';
import { fetchChartData } from './api/chartApi';
import { calculateMovingAverageIndicatorValues } from './utils/moving-average-calculation';
import { privateDecrypt } from 'crypto';

const IndexComponent = props => {
    const chartContainerRef = useRef(null);
    const [chartData, setChartData] = useState([]);
    const [ma50To200HData, setMA50To200Data] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const {
        index = 'SPX',
        colors: {
            backgroundColor = 'white',
            lineColor = 'blue',
            textColor = 'black',
            areaTopColor = '#2962FF',
            areaBottomColor = 'rgba(41, 98, 255, 0.28)'
        } = {},
    } = props;

    // Fetch chart data
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);                      
                const [chartData, ma50To200HData] = await Promise.all([
                    fetchChartData('index', 'full', index),
                    fetchChartData('market', 'single', 'MA_50_200'),
                ]);
                setChartData(chartData);
                setMA50To200Data(ma50To200HData);                
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [index]);

    // 52 week high/low indicator
    const addMA50To200Data = (chart, ma50To200HData) => {
        const ma50To200Pane = chart.addPane(true);
        ma50To200Pane.setHeight(100); 
        const ma50To200Series = ma50To200Pane.addSeries(LineSeries, {
            color: 'red',
            priceFormat: { type: 'percent' },
            priceScaleId: 'percent'
        });
        ma50To200Series.setData(ma50To200HData);          
    };

        // Moving averages for price
    const addMovingAverages = (chart, data) => {
        const movingAverages = [
            { length: 20, color: 'orange' },
            { length: 50, color: 'green' },
            { length: 200, color: 'pink' }
        ];

        for (const ma of movingAverages) {
            const maData = calculateMovingAverageIndicatorValues(data, { length: ma.length });
            const maSeries = chart.addSeries(LineSeries, {
                color: ma.color,
                lineWidth: 1,
                lastValueVisible: false,
                priceLineVisible: false
            });
            maSeries.setData(maData);
        }
    };

    // 20-day moving average for volume
    const calculateVolumeMovingAverage = (volumeData, length = 20) => {
        const result = [];
        for (let i = 0; i < volumeData.length; i++) {
            if (i < length - 1) continue;
            const slice = volumeData.slice(i - length + 1, i + 1);
            const avg = slice.reduce((sum, d) => sum + (d.value || 0), 0) / length;
            result.push({ time: volumeData[i].time, value: avg });
        }
        return result;
    };

    // Volume histogram + 20-day MA
    const addVolumeSeries = (chart, data) => {
        const volumePane = chart.addPane(true);
        volumePane.setHeight(100); 
        // Separate price scale for volume
        const volumeSeries = volumePane.addSeries(HistogramSeries, {
            priceFormat: { type: 'volume' },
            priceScaleId: 'volume'
        });

        const volumeData = data
            .filter(d => d.volume !== undefined)
            .map(d => ({
                time: d.time,
                value: d.volume,
                color: d.open && d.close
                    ? d.close > d.open
                        ? 'rgba(38, 166, 154, 0.8)' // green
                        : 'rgba(239, 83, 80, 0.8)' // red
                    : 'rgba(100, 149, 237, 0.5)', // neutral for line chart
            }));

        volumeSeries.setData(volumeData);

        // Add 20-day moving average for volume
        const volMAData = calculateVolumeMovingAverage(volumeData, 20);
        const volMASeries = volumePane.addSeries(LineSeries, {
            color: 'rgba(120, 80, 239, 0.8)',
            lineWidth: 1.5,
            priceScaleId: 'volume',
            lastValueVisible: false,
            priceLineVisible: false
        });
        volMASeries.setData(volMAData);
    };
    
    useEffect(() => {
        if (!chartContainerRef.current) return;
        if (!chartData || chartData.length === 0) return;

        // Create chart
        const chart = createChart(chartContainerRef.current, {
            layout: { background: { type: ColorType.Solid, color: backgroundColor }, textColor },
            width: chartContainerRef.current.clientWidth,
            height: 600
        });

        chart.applyOptions({
            layout: {
                panes: {
                    separatorColor: '#0d00ff74',
                    separatorHoverColor: '#00ff00',
                    enableResize: false,
                },
            },
        });
        
        // Main price series
        const mainSeries = chart.addSeries(CandlestickSeries, {
            color: lineColor,
            topColor: areaTopColor,
            bottomColor: areaBottomColor,
            title: index,
            lastValueVisible: false,
            priceLineVisible: false
        });

        try {
            mainSeries.setData(chartData);
            addMovingAverages(chart, chartData);
            addVolumeSeries(chart, chartData);
            addMA50To200Data(chart, ma50To200HData);

            chart.timeScale().fitContent();
        } catch (err) {
            console.error('Error setting chart data:', err);
        }

        const handleResize = () => chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [chartData, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]);

    if (isLoading) return <div>Loading chart data...</div>;
    if (error) return <div>Error loading chart data: {error}</div>;

    return (
        <div
            ref={chartContainerRef}
            style={{ width: '95%', height: '600px', margin: '0 auto' }}
        />
    );
};

export { IndexComponent };
