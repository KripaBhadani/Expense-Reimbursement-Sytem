import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="content">
        <h1>Expense Reimbursement System</h1>
        <p>Efficient, Transparent, and Easy Expense Management</p>
        <div className="button-container">
          <button onClick={() => navigate('/login')}>Login</button>
          <button onClick={() => navigate('/register')}>Register</button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
