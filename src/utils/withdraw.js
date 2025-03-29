import React, { useState } from 'react';

const Withdraw = () => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async (e) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      setMessage('Please enter a valid amount.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify({ amount }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        setBalance(data.balance);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Error occurred during withdrawal');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while connecting to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Withdraw Money</h1>
      <form onSubmit={handleWithdraw}>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>Withdraw</button>
      </form>
      {loading && <p>Processing your request...</p>}
      {message && <p>{message}</p>}
      {balance !== null && <p>Updated Balance: ${balance}</p>}
    </div>
  );
};

export default Withdraw;