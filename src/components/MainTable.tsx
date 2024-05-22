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

const MainTable: React.FC = () => {
  const [data, setData] = useState<JobData[]>([]);
  const map = new Map();

  useEffect(() => {
    axios.get('http://localhost:5000/api/salaries')
      .then(response => {
        setData(response.data);
        console.log(map);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

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
        {data.map((job, index) => (
          <tr key={index}>
            <td>{job.work_year}</td>
            <td>{job.salary_in_usd}</td>
            <td>{job.job_title}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MainTable;
