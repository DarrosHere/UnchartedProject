import React, { useState, useRef, useEffect } from 'react';
import '../styles/calc.css'; 

const Calculator = () => {
  const [amount, setAmount] = useState(1000); 
  const [apy, setApy] = useState(5); 
  const [result, setResult] = useState(null);
  const resultTextRef = useRef(null);

  const handleCalculate = () => {
    const principal = parseFloat(amount);
    const interestRate = parseFloat(apy) / 100;
    const finalAmount = principal / Math.pow(1 + interestRate, 1);
    const profit = finalAmount - principal;

    if (profit < 0) {
      setResult(`Estimated profit: $${(profit).toFixed(2)}`);
      if (resultTextRef.current) {
        resultTextRef.current.style.color = 'red';
      }
    } else {
      setResult(`Estimated profit: $${profit.toFixed(2)}`);
      if (resultTextRef.current) {
        resultTextRef.current.style.color = 'black';
      }
    }
  };

  useEffect(() => {
    if (resultTextRef.current) {
      if (result && result.includes('-')) {
        resultTextRef.current.style.color = 'red';
      } else {
        resultTextRef.current.style.color = 'black';
      }
    }
  }, [result]);

  return (
    <div className="calculator" id='calc'>
      <h1 className="calculator-title">Calculate your <span style={{ textDecoration: 'line-through' }}>losses</span> profit</h1>
      <div className="calculator-inputs">
        <div className="input-group">
          <label htmlFor="amount" className="input-label">Amount: ${amount}</label>
          <input
            type="range"
            id="amount"
            min="100"
            max="10000"
            step="100"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="calculator-slider"
          />
        </div>
        <div className="input-group">
          <label htmlFor="apy" className="input-label">APY: {apy}%</label>
          <input
            type="range"
            id="apy"
            min="1"
            max="50"
            step="0.1"
            value={apy}
            onChange={(e) => setApy(e.target.value)}
            className="calculator-slider"
          />
        </div>
        <button className="calculator-button" onClick={handleCalculate}>
          Calculate
        </button>
      </div>
      {result && (
        <div className="calculator-result">
          <p className="calculator-result-text" ref={resultTextRef}>{result}</p>
        </div>
      )}
      <p className="calculator-disclaimer">*Disclaimer: This is just an estimate. Actual profits may vary.</p>
    </div>
  );
};

export default Calculator;