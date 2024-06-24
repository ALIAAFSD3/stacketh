'use client';

import { useEffect, useState } from 'react';
import { AreaChart, Card, Title } from '@tremor/react';
import { subDays, format } from 'date-fns';

const dataFormatter = (number) => number.toString();

export default function AreaChartHero() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/getData');
      const data = await response.json();

      // Get today's date and date 7 days ago
      const today = new Date();
      const sevenDaysAgo = subDays(today, 7);

      // Format the date as required by your data
      const formattedSevenDaysAgo = format(sevenDaysAgo, 'yyyy/MM/dd');

      // Filter data for the last 7 days
      const filteredData = data.filter(item => item.date >= formattedSevenDaysAgo);

      // Create a map to aggregate lgas values by date
      const dailyDataMap = new Map();

      filteredData.forEach(item => {
        const date = item.date;
        const lgas = parseFloat(item.lgas);

        if (!dailyDataMap.has(date)) {
          dailyDataMap.set(date, { date, lgasValues: [lgas] });
        } else {
          dailyDataMap.get(date).lgasValues.push(lgas);
        }
      });

      // Process the aggregated data to find min, average, and max lgas
      const formattedData = Array.from(dailyDataMap.entries()).map(([date, { lgasValues }]) => {
        const minLgas = Math.min(...lgasValues);
        const maxLgas = Math.max(...lgasValues);
        const avgLgas = parseFloat((lgasValues.reduce((a, b) => a + b, 0) / lgasValues.length).toFixed(1));

        return {
          date,
          minLgas,
          avgLgas,
          maxLgas,
        };
      });

      setChartData(formattedData);
    };

    fetchData();
  }, []);

  return (
    
    <Card>
      <Title>Gas Prices Min Ave adn Max</Title>
      
      <AreaChart
      className="h-80"
      data={chartData}
      index="date"
      categories={['maxLgas' ,'avgLgas', 'minLgas' ]}
      colors={['indigo', 'rose', 'green']}
      valueFormatter={dataFormatter}
      yAxisWidth={60}
      showAnimation={true}
    />
    </Card>
  );
}
