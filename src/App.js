import React, { useState, useEffect } from 'react';

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
    <div>
      <h1>Reward Points Calculator</h1>
      <div>
        {Object.keys(rewardData).map((month) => (
          <div key={month}>
            <h2>Reward Points for {month}:</h2>
            <ul>
              {rewardData[month].map((entry, index) => (
                <li key={index}>
                  Customer {entry.customerId}: {entry.points} points
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div>
        <h2>Total Reward Points per Customer:</h2>
        <ul>
          {Object.keys(totalPointsPerCustomer).map((customerId) => (
            <li key={customerId}>
              Customer {customerId}: {totalPointsPerCustomer[customerId]} points
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RewardsCalculator;
