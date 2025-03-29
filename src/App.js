import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom'; 
import Cookies from 'js-cookie'; 
import Login from './components/Auth/Login';
import Register from './components/Auth/Reg';
import Calculator from './utils/calc';
import './styles/App.css';
import Matrix from './components/blocks/matrix';
import Trusted from './components/blocks/trusted';
import Card from './utils/card';
import About from './components/blocks/mainAbout';
import MoneyRain from './utils/moneyRain';
import Header from './components/Shared/header';
import Review from './components/blocks/review';
import Footer from './components/Shared/footer';
import Dashboard from './components/Dashboard/Dashboard';
import AdminPanel from './components/Dashboard/AdminPanel';
import ResetPassword from './components/Auth/reset';
import SetName from './components/Auth/SetName';

const App = () => {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token'); 
    console.log('Token from cookie:', token); 
    if (token) {
      setAuth(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/set-name" element={<SetName />} />
        <Route path="/AdminPanel" element={<AdminPanel />} />
        <Route
          path="/*"
          element={
            <div className="app-container">
              <Header setAuth={setAuth} />
              <div className="parallax"></div>
              <div className="content">
                <MoneyRain />
                <Routes>
                  <Route path="/login" element={<Login setAuth={setAuth} />} />
                  <Route path="/register" element={<Register setAuth={setAuth} />} />
                  <Route path="/" />
                  <Route path="/about" element={<h1>Reviews</h1>} />
                </Routes>

                <About />
                <Trusted />
                <Card />
                <Matrix />

                <div className="calculator-section">
                  <Calculator />
                </div>

                <Review />

                <div className="credit-card">
                  <h1 className="credit-card-title">Get your free credit card now!</h1>
                  <p className="credit-card-description">
                    Apply now and get a free credit card with a 100% interest rate!
                  </p>
                  
                  <RegisterButton />
                </div>
              </div>
              <Footer />
            </div>
          }
        />

        <Route
          path="/dashboard"
          element={
            auth ? <Dashboard /> : <h1>You must log in to access the dashboard.</h1>
          }
        />
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route path="/register" element={<Register setAuth={setAuth} />} />
      </Routes>
    </Router>
  );
};

const RegisterButton = () => {
  const navigate = useNavigate(); // 

  return (
    <button
      className="view-button"
      onClick={() => navigate('/register')} 
    >
      Apply Now
    </button>
  );
};

export default App;