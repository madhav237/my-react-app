import React, { useState, useEffect } from 'react';
import './App.css';

const simulatedAPICall = () => {
  return new Promise((resolve) => {
    // Simulated API call to fetch transaction data after a delay
    setTimeout(() => {
      resolve([
        { customerId: 1, transactionAmount: 120, date: '2023-09-15' },
        { customerId: 2, transactionAmount: 75, date: '2023-09-20' },
        { customerId: 1, transactionAmount: 80, date: '2023-08-10' },
        { customerId: 2, transactionAmount: 110, date: '2023-08-25' },
        // ... Add more simulated transaction data with dates
      ]);
    }, 1000); // Simulating a 1-second delay
  });
};

const calculateRewardPoints = (transactionAmount) => {
  let points = 0;

  if (transactionAmount > 100) {
    points += (transactionAmount - 100) * 2;
    points += 50; // Additional 50 points for the first $50 over $100
  } else if (transactionAmount > 50) {
    points += (transactionAmount - 50);
  }

  return points;
};

const calculateTotalRewardPoints = (rewardData) => {
  const totalPoints = {};

  Object.keys(rewardData).forEach((month) => {
    rewardData[month].forEach((entry) => {
      const { customerId, points } = entry;
      if (!totalPoints[customerId]) {
        totalPoints[customerId] = 0;
      }
      totalPoints[customerId] += points;
    });
  });

  return totalPoints;
};

const RewardsCalculator = () => {
  const [rewardData, setRewardData] = useState({});

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const transactions = await simulatedAPICall();
        const rewardPointsData = {};

        transactions.forEach((transaction) => {
          const { customerId, transactionAmount, date } = transaction;
          const points = calculateRewardPoints(transactionAmount);
          const month = new Date(date).toLocaleString('en-US', { month: 'long', year: 'numeric' });

          if (!rewardPointsData[month]) {
            rewardPointsData[month] = [];
          }

          rewardPointsData[month].push({ customerId, points });
        });

        setRewardData(rewardPointsData);
      } catch (error) {
        console.error('Error fetching transaction data:', error);
      }
    };

    fetchTransactionData();
  }, []);

  const totalPointsPerCustomer = calculateTotalRewardPoints(rewardData);

  return (
    <div className="calculator-container">
      <h1 style={{ color: '#27ae60' }}>Reward Points Calculator</h1>
      <div>
        {Object.keys(rewardData).map((month) => (
          <div key={month} className="table-container">
            <h2 className="month-heading">Reward Points for {month}:</h2>
            <table>
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {rewardData[month].map((entry, index) => (
                  <tr key={index}>
                    <td>Customer {entry.customerId}</td>
                    <td><span style={{ color: '#e67e22' }}>{entry.points}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <div className="table-container">
        <h2 style={{ color: '#f39c12' }}>Total Reward Points per Customer:</h2>
        <table>
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Total Points</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(totalPointsPerCustomer).map((customerId) => (
              <tr key={customerId}>
                <td>Customer {customerId}</td>
                <td><span style={{ color: '#e74c3c' }}>{totalPointsPerCustomer[customerId]}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RewardsCalculator;