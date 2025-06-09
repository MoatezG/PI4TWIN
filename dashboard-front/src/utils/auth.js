// src/utils/auth.js
export const getCurrentUser = () => {
    const userData = localStorage.getItem('user');
    if (!userData) return null;
    return JSON.parse(userData);
  };
  
  export const getUserRole = () => {
    const user = getCurrentUser();
    console.log('User role:', user?.role);
    return user?.role; // 'provider' or 'demander'
  };