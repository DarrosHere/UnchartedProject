import React from "react";
import { useNavigate } from "react-router-dom";

const RegisterButton = () => {
  const navigate = useNavigate();

  return (
    <button
      className="view-button"
      onClick={() => navigate('/register')}
    >
      Apply Now
    </button>
  );
};

const Matrix = () => {
  return (
    <div className='matrix'>
      <div className='matrix-text'>
        <h1 className='matrix-title'>Our fees are so unreal, even Neo can’t escape them!</h1>
        <RegisterButton />
        <p className='matrix-description'>440% fee for the first transaction.</p>
      </div>
    </div>
  );
};

export default Matrix;