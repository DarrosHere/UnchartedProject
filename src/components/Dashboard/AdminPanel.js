import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import '../../styles/AdminPanel.css';
import StatsPieChart from '../../utils/StatsPieChart';


ChartJS.register(ArcElement, Tooltip, Legend);

const AdminPanel = () => {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [cardDetails, setCardDetails] = useState({ cardNumber: '', expirationDate: '', cvv: '' });
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState(null); 
  const [showStats, setShowStats] = useState(false);
  const [newBalance, setNewBalance] = useState('');

  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/admin/stats', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error fetching statistics');
        }

        const statsData = await response.json();
        setStats(statsData); 
      } catch (error) {
        setMessage(error.message);
      }
    };

    fetchStats();
  }, []);

  const handleToggleStats = () => {
    setShowStats(!showStats); 
  };

  const handleSearchUser = async () => {
    try {
      const userResponse = await fetch(`http://localhost:5001/api/admin/search-user?email=${email}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        throw new Error(errorData.message || 'Error searching for user');
      }

      const userData = await userResponse.json();
      setUser(userData);
      setMessage('');

      const transactionsResponse = await fetch(`http://localhost:5001/api/admin/transactions?email=${email}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!transactionsResponse.ok) {
        const errorData = await transactionsResponse.json();
        throw new Error(errorData.message || 'Error fetching transactions');
      }

      const transactionsData = await transactionsResponse.json();
      setTransactions(transactionsData);
    } catch (error) {
      setUser(null);
      setTransactions([]);
      setMessage(error.message);
    }
  };

  const handleCreateCard = async () => {
    if (!email || !cardDetails.cardNumber || !cardDetails.expirationDate || !cardDetails.cvv) {
      setMessage('Please fill in all fields before creating a card.');
      return;
    }

    try {
      const formattedDate = new Date(cardDetails.expirationDate).toISOString();

      const response = await fetch('http://localhost:5001/api/admin/create-card-for-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          cardNumber: cardDetails.cardNumber,
          expirationDate: formattedDate,
          cvv: cardDetails.cvv,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error creating card');
      }

      const responseData = await response.json();
      setMessage(responseData.message);
      setCardDetails({ cardNumber: '', expirationDate: '', cvv: '' });
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleUpdateBalance = async () => {
    if (!email || !newBalance) {
      setMessage('Please provide a valid email and balance.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/admin/update-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, balance: parseFloat(newBalance) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error updating balance');
      }

      const responseData = await response.json();
      setMessage(responseData.message);

      
      setUser((prevUser) => ({ ...prevUser, balance: responseData.newBalance }));
      setNewBalance('');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-panel">
        <h1>Admin Panel</h1>

        {/* Search User Section */}
        <div>
          <h2>Search User by Email</h2>
          <input
            type="email"
            placeholder="Enter user email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSearchUser}>Search</button>
        </div>

        {message && <p>{message}</p>}

        {user && (
          <div>
            <h3>User Details</h3>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Balance: ${user.balance}</p>

            {/* Update Balance Section */}
            <div className='update-balance-section'>
              <h3>Update User Balance</h3>
              <input
                type="number"
                placeholder="Enter new balance"
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
              />
              <button onClick={handleUpdateBalance}>Update Balance</button>
            </div>

            {/* Cards Section */}
            <h4>Cards:</h4>
            <ul>
              {user.cards.map((card) => (
                <li key={card._id}>
                  Card Number: **** **** **** {card.cardNumber.slice(-4)}, 
                  Expiration Date: {new Date(card.expirationDate).toLocaleDateString('en-US')}
                </li>
              ))}
            </ul>

            {/* Transactions Section */}
            <h4>Transactions:</h4>
            <ul>
              {transactions.map((transaction) => (
                <li key={transaction._id}>
                  <p>Type: {transaction.type}</p>
                  <p>Amount: ${transaction.amount}</p>
                  <p>Date: {new Date(transaction.date).toLocaleDateString('en-US')}</p>
                  {transaction.sender && (
                    <p>Sender: {transaction.sender.name} ({transaction.sender.email})</p>
                  )}
                  {transaction.recipient && (
                    <p>Recipient: {transaction.recipient.name} ({transaction.recipient.email})</p>
                  )}
                </li>
              ))}
            </ul>

            {/* Create Card Section */}
            <div>
              <h3>Create Card for User</h3>
              <input
                type="text"
                placeholder="Card Number"
                value={cardDetails.cardNumber}
                onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
              />
              <input
                type="date"
                placeholder="Expiration Date"
                value={cardDetails.expirationDate}
                onChange={(e) => setCardDetails({ ...cardDetails, expirationDate: e.target.value })}
              />
              <input
                type="text"
                placeholder="CVV"
                value={cardDetails.cvv}
                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
              />
              <button onClick={handleCreateCard}>Create Card</button>
            </div>
          </div>
        )}

        {/* Statistics Section */}
        <button onClick={handleToggleStats}>
          {showStats ? 'Hide Statistics' : 'Show Statistics'}
        </button>
        {showStats && stats && <StatsPieChart stats={stats} />}
      </div>
    </div>
  );
};

export default AdminPanel;