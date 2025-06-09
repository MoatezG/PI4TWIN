import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Changed useHistory to useNavigate

const API_URL = "http://localhost:5000/api";

function VerifyEmail() {
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate(); // Changed history to navigate

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    const verifyEmail = async () => {
      try {
        const response = await fetch(`${API_URL}/users/verify-email?token=${token}`);
        const data = await response.json();
        if (response.ok) {
            setMessage('Email verified successfully. You can now log in.');
            navigate('/auth/sign-in'); // Navigate back to login page
          } else {
            setMessage(data.error || 'Failed to verify email. Please try again.');
          }
      } catch (error) {
        setMessage('An error occurred while verifying your email.');
      }
    };

    verifyEmail();
  }, [location, navigate]); // Changed history to navigate

  return (
    <div className="verify-email-container">
      <h1>Verify Email</h1>
      <p>{message}</p>
    </div>
  );
}

export default VerifyEmail;
