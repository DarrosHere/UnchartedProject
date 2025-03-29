import React, { useState } from 'react';

const Transfer = () => {
  const [recipientId, setRecipientId] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [balance, setBalance] = useState(null);

  const handleTransfer = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await fetch('/api/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify({ recipientId, amount }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        setBalance(data.balance);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Error occurred');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while connecting to the server');
    }
  };

  return (
    <div>
      <h1>Transfer Money</h1>
      <form onSubmit={handleTransfer}>
        <input
          type="text"
          placeholder="Recipient ID"
          value={recipientId}
          onChange={(e) => setRecipientId(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button type="submit">Transfer</button>
      </form>
      {message && <p>{message}</p>}
      {balance !== null && <p>Updated Balance: ${balance}</p>}
    </div>
  );
};

export default Transfer;