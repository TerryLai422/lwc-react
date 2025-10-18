export const fetchChartData = async (type = 'line', symbol = 'TSLA') => {
    try {
        const response = await fetch(`http://localhost:8080/stockdata/${type}/${symbol}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // console.log('Fetched chart data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching chart data:', error);
        throw error;
    }
};