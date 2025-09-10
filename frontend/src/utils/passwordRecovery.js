import { jwtDecode } from 'jwt-decode';

export const getTempToken = (tokenKey = 'temp_token') => {
  const token = localStorage.getItem(tokenKey);
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return {
      user_id: decoded.user_id,
      user_first_name: decoded.user_first_name,
      email_address: decoded.email_address,
      temp_password: decoded.temp_password,
      role: decoded.role,
    };
  } catch (err) {
    console.error('Error decoding JWT:', err);
    return null;
  }
};