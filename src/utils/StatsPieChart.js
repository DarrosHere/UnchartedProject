import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';


ChartJS.register(ArcElement, Tooltip, Legend);

const StatsPieChart = ({ stats }) => {
 
  const deposits = stats.deposits || 0;
  const withdrawals = stats.withdrawals || 0;
  const transfers = stats.transfers || 0;

  // Calculate additional statistics
  const totalTransactions = deposits + withdrawals + transfers;
  const averageTransferAmount = transfers / (stats.transferCount || 1); 

  return (
    <div>
      <h2>Platform Statistics</h2>
      <Pie
        data={{
          labels: ['Deposits', 'Withdrawals', 'Transfers'],
          datasets: [
            {
              data: [deposits, withdrawals, transfers],
              backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
        }}
      />
      <div className="stats-details">
        <h3>Additional Statistics</h3>
        <p><strong>Total Transactions:</strong> ${totalTransactions.toFixed(2)}</p>
        <p><strong>Average Transfer Amount:</strong> ${averageTransferAmount.toFixed(2)}</p>
        <p><strong>Total Deposits:</strong> ${deposits.toFixed(2)}</p>
        <p><strong>Total Withdrawals:</strong> ${withdrawals.toFixed(2)}</p>
        <p><strong>Total Transfers:</strong> ${transfers.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default StatsPieChart;