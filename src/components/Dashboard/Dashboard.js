import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TransactionHistory from "../../utils/TransactionHistory";
import { useNavigate } from "react-router-dom";
import '../../styles/dashboard.css';
import MyCard from "../blocks/MyCard";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState('');
  const [currentSection, setCurrentSection] = useState('dashboard'); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/user/user", {
          method: "GET",
          credentials: "include",
        });
  
        console.log('Response status:', response.status); 
        if (!response.ok) {
          console.log('Redirecting to login...');
          return navigate("/login");
        }
  
        const data = await response.json();
        console.log('User data:', data); 
        setUser(data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/user/logout", {
        method: "POST",
        credentials: "include",
      });
  
      if (!response.ok) throw new Error("Failed to log out");
  
    
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err.message);
      setMessage("Logout failed. Please try again.");
    }
  };

  const handleWithdraw = async () => {
    if (!user) {
      setMessage('User data is not loaded yet.');
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5001/api/transactions/withdraw", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
  
      setMessage(data.message);
      setUser((prev) => ({ ...prev, balance: data.balance }));
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleTransfer = async () => {
    if (!user) {
      setMessage('User data is not loaded yet.');
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5001/api/transactions/transfer", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: user._id, 
          recipientId,
          amount,
        }),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
  
      setMessage(data.message);
      setUser((prev) => ({ ...prev, balance: data.balance }));
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data available</div>;

  return (
    <div className="main-container">
   
  
        {/* Main Dashboard Section */}
        <div className="dashboard">
          
          {currentSection === 'dashboard' && (
            <>
              <h1>Welcome, {user.name}!</h1>
  

              <div className="balance-info">
                <p><strong>Balance:</strong> ${user.balance}</p>
              </div>
              
             <MyCard />
              {/* Navigation Buttons */}
              <button onClick={() => setCurrentSection('withdraw')}>Withdraw Money</button>
              <button onClick={() => setCurrentSection('transfer')}>Transfer Money</button>
              <button onClick={handleLogout} className="logout-button">Logout</button>

  
              <div className="transaction-history">
               
                  <>
                    
                    <TransactionHistory/>
                  </>
                
              </div>
            </>
          )}
  
          {currentSection === 'withdraw' && (
            <>
              <button onClick={() => setCurrentSection('dashboard')} className="back-button">Back</button>
              <h2>Withdraw Money</h2>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <button onClick={handleWithdraw}>Withdraw</button>
            </>
          )}
  
          {currentSection === 'transfer' && (
            <>
              <button onClick={() => setCurrentSection('dashboard')} className="back-button">Back</button>
              <h2>Transfer Money</h2>
              <input
                type="text"
                placeholder="Recipient email"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
              />
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <button onClick={handleTransfer}>Transfer</button>
            </>
          )}
  
         
          {message && <p>{message}</p>}
        </div>
        <div className="dashboard-content">
        {/* News Section */}
        
        <div className="news">
        <h2>Latest Banking News</h2>
          <div className="news-section">
          
            <div className="news-item">
              
            </div>
            
          </div>
          <p className="news-description">
              🏔️ Breaking News! The world just got its most extreme banking experience – an ATM on Mount Everest! 
              Now, even at 14,000 feet, climbers can check their balance (which is usually just "low oxygen"), 
              withdraw cash (for what, though? Yeti snacks?), and transfer money (probably to pay Sherpas for carrying them down).
            </p>
            <p className="news-extra">
              💳 Next innovation? A contactless ATM for penguins in Antarctica or a crypto machine on Mars. Stay tuned! 🚀
            </p>
        </div>
      </div>


     
    </div>
  );
}

export default Dashboard;