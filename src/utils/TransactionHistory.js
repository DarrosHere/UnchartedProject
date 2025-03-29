import React, { useEffect, useState } from 'react';
import '../styles/TransactionHistory.css';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/transactions/transactions", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }

        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        setError(error.message || 'Error occurred');
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="transaction-history-container">
      <h2>Transaction History</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {transactions.length > 0 ? (
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction._id || transaction.date}>
              <p><strong>Type:</strong> {transaction.type}</p>
              <p><strong>Amount:</strong> ${transaction.amount}</p>

              {transaction.sender && transaction.sender.name && (
                <p>
                  <strong>From:</strong> {transaction.sender.name} ({transaction.sender.email})
                </p>
              )}

              {transaction.recipient && transaction.recipient.name && (
                <p>
                  <strong>To:</strong> {transaction.recipient.name} ({transaction.recipient.email})
                </p>
              )}

              <p><strong>Date:</strong> {new Date(transaction.date).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        !error && <p>No transaction history available.</p>
      )}
    </div>
  );
};

export default TransactionHistory;