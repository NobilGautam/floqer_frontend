import React from 'react';
import { Line } from 'react-chartjs-2';
import { useLocation } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Box, Heading } from '@chakra-ui/react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Analytics: React.FC = () => {
  const location = useLocation();
  const mapData: [number, any][] = location.state?.mapData || [];

  const years = mapData.map(([year]) => year);
  const totalJobs = mapData.map(([_, details]) => details.count);
  const avgSalaries = mapData.map(([_, details]) => details.avgsal);

  const data = {
    labels: years,
    datasets: [
      {
        label: 'Total Number of Jobs',
        data: totalJobs,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: 'Average Salary',
        data: avgSalaries,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.2)',
      },
    ],
  };

  return (
    <Box className="flex flex-col items-center p-4">
      <Heading as="h2" size="xl" className="mb-6">
        Analytics
      </Heading>
      <Box className="w-full md:w-3/4 lg:w-1/2 bg-white p-4 shadow-md rounded-md">
        <Line data={data} />
      </Box>
    </Box>
  );
};

export default Analytics;
