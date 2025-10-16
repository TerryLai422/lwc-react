export const fetchChartData = async () => {
    try {
        // const response = await fetch('YOUR_API_ENDPOINT_HERE');
        // if (!response.ok) {
        //     throw new Error('Network response was not ok');
        // }
        // const data = await response.json();
        const initialData = [
            { time: '2018-12-22', value: 32.51 },
            { time: '2018-12-23', value: 31.11 },
            { time: '2018-12-24', value: 27.02 },
            { time: '2018-12-25', value: 27.32 },
            { time: '2018-12-26', value: 25.17 },
            { time: '2018-12-27', value: 28.89 },
            { time: '2018-12-28', value: 25.46 },
            { time: '2018-12-29', value: 23.92 },
            { time: '2018-12-30', value: 22.68 },
            { time: '2018-12-31', value: 20.67 },
        ];
        return initialData;
    } catch (error) {
        console.error('Error fetching chart data:', error);
        throw error;
    }
};