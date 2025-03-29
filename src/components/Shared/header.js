import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../../styles/App.css';

const AppHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [auth, setAuth] = useState(false); 
  const navigate = useNavigate();

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleStartApp = () => {
    if (auth) {
      navigate('/dashboard'); 
    } else {
      navigate('/login'); 
    }
  };

  const handleScrollToReviews = (e) => {
    e.preventDefault();
    const reviewsSection = document.getElementById('reviews');
    
    window.scrollTo({
      top: reviewsSection.offsetTop - 150,
      behavior: 'smooth'
    });
  };

  const handleScrollToCalc = (e) => {
    e.preventDefault();
    const calcSection = document.getElementById('calc');
    
    window.scrollTo({
      top: calcSection.offsetTop - 250,
      behavior: 'smooth'
    });
  };

  return (
    <div className={`app-header ${scrolled ? 'scrolled' : ''}`}>
      <nav className="nav-left">
        <a href="https://github.com/DarrosHere" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="#reviews" onClick={handleScrollToReviews}>Reviews</a>
        <a href="#calc" onClick={handleScrollToCalc}>Calculator</a>
      </nav>
      <div className="nav-right">
        <button onClick={handleStartApp}>Start App</button>
      </div>
    </div>
  );
};

export default AppHeader;