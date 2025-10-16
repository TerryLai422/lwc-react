import { createChart, ColorType, LineSeries } from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';
import { fetchChartData } from './api/chartApi';

const ChartComponent = props => {
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data when component mounts
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const data = await fetchChartData();
                setChartData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const {
        colors: {
            backgroundColor = 'white',
            lineColor = '#2962FF',
            textColor = 'black',
            areaTopColor = '#2962FF',
            areaBottomColor = 'rgba(41, 98, 255, 0.28)',
        } = {},
    } = props;

    const chartContainerRef = useRef();

    useEffect(() => {
        // Validate chartContainerRef first
        if (!chartContainerRef.current) {
            console.error('Chart container reference is missing');
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

        // Replace addLineSeries with addSeries
        const newSeries = chart.addSeries(LineSeries, {
            lineColor,
            topColor: areaTopColor,
            bottomColor: areaBottomColor,
        });

        try {
            newSeries.setData(chartData);
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