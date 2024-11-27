import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/LandingPage.css'; // Ensure the correct path for your CSS file

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <h1>Expense Reimbursement System</h1>
      <p>Efficient, Transparent, and Easy Expense Management</p>
      <button onClick={() => navigate('/login')}>Login</button>
      <button onClick={() => navigate('/register')}>Register</button>
    </div>
  );
};

export default LandingPage;
