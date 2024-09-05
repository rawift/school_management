
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { server_api } from '../server_ip';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';


ChartJS.register(ArcElement, Tooltip, Legend);

const AnalyticsPage = () => {
  const [view, setView] = useState('monthly');
  const [month, setMonth] = useState('01'); 
  const [year, setYear] = useState(new Date().getFullYear());
  const [analyticsData, setAnalyticsData] = useState({ totalSalary: 0, totalFee: 0 });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`${server_api}/user/analytics`, {
          params: { view, month, year },
          withCredentials: true,
        });
        const { totalSalary, totalFee } = response.data;

        if (view === 'monthly') {
          setAnalyticsData({
            totalSalary: totalSalary / 12,
            totalFee: totalFee / 12,
          });
        } else {
          setAnalyticsData({
            totalSalary,
            totalFee,
          });
        }

      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchAnalytics();
  }, [view, month, year]);


  const profit = analyticsData.totalFee - analyticsData.totalSalary;


  const data = {
    labels: ['Total Salary', 'Profit'],
    datasets: [
      {
        data: [analyticsData.totalSalary, profit],
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(75, 192, 192, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.label}: $${context.raw.toFixed(2)}`;
          },
        },
      },
    },
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Analytics</h2>

      <div className="mb-6">
        <label className="mr-2">View:</label>
        <button
          onClick={() => setView('monthly')}
          className={`px-4 py-2 rounded ${view === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
        >
          Monthly
        </button>
        <button
          onClick={() => setView('yearly')}
          className={`ml-2 px-4 py-2 rounded ${view === 'yearly' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
        >
          Yearly
        </button>
      </div>

      {view === 'monthly' && (
        <div className="mb-6">
          <label className="mr-2">Month:</label>
          <input
            type="month"
            value={`${year}-${month}`}
            onChange={(e) => {
              const [selectedYear, selectedMonth] = e.target.value.split('-');
              setYear(selectedYear);
              setMonth(selectedMonth);
            }}
            className="border border-gray-300 rounded px-2 py-1"
          />
        </div>
      )}

      {view === 'yearly' && (
        <div className="mb-6">
          <label className="mr-2">Year:</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          />
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
        <h3 className="text-xl font-semibold mb-4">Summary</h3>
        <p><strong>Total Salary:</strong> ${analyticsData.totalSalary.toFixed(2)}</p>
        <p><strong>Total Fee:</strong> ${analyticsData.totalFee.toFixed(2)}</p>
        <p><strong>Profit:</strong> ${profit.toFixed(2)}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Expenditure, Revenue & Profit</h3>
        <div className="flex justify-center">
          <div style={{ width: '200px', height: '200px' }}>
            <Pie data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
