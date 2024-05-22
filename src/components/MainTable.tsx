import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
  totalSalary: number; // Accumulating total salary
  avgsal: number;
}

const MainTable: React.FC = () => {
  const [data, setData] = useState<JobData[]>([]);
  const [map, setMap] = useState<Map<number, Details>>(new Map());

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
        yearDetails.totalSalary += salary_in_usd/1000;

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
      // Debugging output to check calculation
      console.log(`Year: ${year}, Total Salary: ${details.totalSalary}, Count: ${details.count}, Avg Salary: ${details.avgsal}`);
    });

    setMap(tempMap);
  }, [data]);

  return (
    <table>
      <thead>
        <tr>
          <th>Year</th>
          <th>Average Salary</th>
          <th>Number of Jobs</th>
        </tr>
      </thead>
      <tbody>
        {Array.from(map.entries()).map(([year, details]) => (
          <tr key={year}>
            <td>{year}</td>
            <td>{details.avgsal.toFixed(2)}</td>
            <td>{details.count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MainTable;
