export const fetchChartData = async (dataType = 'stock', resultType = 'full', symbol = 'TSLA') => {
    try {
        console.log(`Fetching data from http://localhost:8080/${dataType}/${resultType}/${symbol}`);
        const response = await fetch(`http://localhost:8080/${dataType}/${resultType}/${symbol}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched chart data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching chart data:', error);
        throw error;
    }
};