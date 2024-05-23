import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Radio, RadioGroup, Stack, Button, Heading, Box, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

interface JobData {
  work_year: number;
  experience_level: string;
  employment_type: string;
  job_title: string;
  salary: number;
  salary_currency: string;
  salary_in_usd: number;
  employee_residence: string;
  remote_ratio: number;
  company_location: string;
  company_size: string;
}

interface JobDetails {
  title: string;
  jcount: number;
}

interface Details {
  count: number;
  jd: JobDetails[];
  totalSalary: number;
  avgsal: number;
}

const MainTable: React.FC = () => {
  const [data, setData] = useState<JobData[]>([]);
  const [map, setMap] = useState<Map<number, Details>>(new Map());
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [sortField, setSortField] = useState<string>('year');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/salaries')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    const tempMap = new Map<number, Details>();

    data.forEach((item) => {
      const { work_year, job_title, salary_in_usd } = item;

      if (!tempMap.has(work_year)) {
        tempMap.set(work_year, { count: 0, jd: [], totalSalary: 0, avgsal: 0 });
      }

      const yearDetails = tempMap.get(work_year);
      if (yearDetails) {
        yearDetails.count += 1;
        yearDetails.totalSalary += salary_in_usd / 1000;

        const jobIndex = yearDetails.jd.findIndex(job => job.title === job_title);
        if (jobIndex !== -1) {
          yearDetails.jd[jobIndex].jcount += 1;
        } else {
          yearDetails.jd.push({ title: job_title, jcount: 1 });
        }
      }
    });

    tempMap.forEach((details, year) => {
      details.avgsal = (details.totalSalary / details.count) * 1000;
    });

    setMap(tempMap);
  }, [data]);

  const handleRowClick = (year: number) => {
    setSelectedYear(selectedYear === year ? null : year); // Toggle selection
    setShowDetails(selectedYear !== year || !showDetails); // Toggle details visibility
  };

  const selectedYearDetails = selectedYear !== null ? map.get(selectedYear) : null;

  const handleNavigateToAnalytics = () => {
    navigate('/analytics', { state: { mapData: Array.from(map.entries()) } });
  };

  const sortedData = Array.from(map.entries()).sort(([yearA, detailsA], [yearB, detailsB]) => {
    let compareResult = 0;
    switch (sortField) {
      case 'year':
        compareResult = yearA - yearB;
        break;
      case 'avgSalary':
        compareResult = detailsA.avgsal - detailsB.avgsal;
        break;
      case 'jobs':
        compareResult = detailsA.count - detailsB.count;
        break;
      default:
        break;
    }
    return sortOrder === 'asc' ? compareResult : -compareResult;
  });

  return (
    <Box className='flex items-center flex-col p-4'>
      <Box className='w-full flex flex-row justify-between items-center mb-6'>
        <RadioGroup onChange={setSortField} value={sortField}>
          <Stack direction='row'>
            <Radio value='year'>Year</Radio>
            <Radio value='avgSalary'>Avg. Salary</Radio>
            <Radio value='jobs'>Jobs</Radio>
          </Stack>
        </RadioGroup>
        <Stack direction='row' spacing={4}>
          <Button colorScheme='teal' variant='outline' onClick={() => setSortOrder('asc')}>Ascending</Button>
          <Button colorScheme='teal' variant='outline' onClick={() => setSortOrder('desc')}>Descending</Button>
        </Stack>
      </Box>

      <Table variant='striped' colorScheme='teal' className='w-[80%] mb-10'>
        <Thead>
          <Tr>
            <Th>Year</Th>
            <Th>Average Salary</Th>
            <Th>Number of Jobs</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedData.map(([year, details]) => (
            <Tr key={year} onClick={() => handleRowClick(year)} style={{ cursor: 'pointer' }}>
              <Td>{year}</Td>
              <Td>{details.avgsal.toFixed(2)}</Td>
              <Td>{details.count}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Button colorScheme='teal' size='lg' onClick={handleNavigateToAnalytics} className='mb-6'>Analytics</Button>

      {selectedYearDetails && showDetails && (
        <>
          <Heading as='h2' size='lg' mb={4}>Details for {selectedYear}</Heading>
          <Table variant='striped' colorScheme='teal' className='w-[80%]'>
            <Thead>
              <Tr>
                <Th>Job Title</Th>
                <Th>Number of Roles</Th>
              </Tr>
            </Thead>
            <Tbody>
              {selectedYearDetails.jd.map((jobDetail, index) => (
                <Tr key={index}>
                  <Td>{jobDetail.title}</Td>
                  <Td>{jobDetail.jcount}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </>
      )}
    </Box>
  );
};

export default MainTable;
