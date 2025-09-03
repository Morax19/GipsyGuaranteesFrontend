import { jwtDecode } from 'jwt-decode';

/**
 * Extracts the current user's ID from a JWT stored in sessionStorage.
 * @param {string} tokenKey - The key used to store the token in sessionStorage.
 * @returns {string|null} - The user ID, or null if not found or invalid.
 */
export const getCurrentUserInfo = (tokenKey = 'session_token') => {
  const token = sessionStorage.getItem(tokenKey);
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return {
      user_id: decoded.user_id,
      user_first_name: decoded.user_first_name,
      email_address: decoded.email_address,
      role: decoded.role,
    };
  } catch (err) {
    console.error('Error decoding JWT:', err);
    return null;
  }
};