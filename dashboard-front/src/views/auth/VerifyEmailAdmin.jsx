import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function VerifyEmailAdmin() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/auth/sign-in-admin');
  }, [navigate]);

  return (
    <div className="verify-email-container">
      <h1>Admin Email Verification</h1>
      <p>Redirecting to login...</p>
    </div>
  );
}

export default VerifyEmailAdmin;
