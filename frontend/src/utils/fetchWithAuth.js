import { useNavigate } from 'react-router-dom';

export async function fetchWithAuth(url, options = {}) {
  const token = sessionStorage.getItem('session_token');

  if (!token) {
    // If there's no token, redirect to login
    window.location.href = '/';
    throw new Error('No authentication token found.');
  }

  // Set up the Authorization header
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  };

  const newOptions = { ...options, headers };

  let response = await fetch(url, newOptions);

  if (response.status === 401) {
    // If the token is invalid or expired, clear the session and redirect
    sessionStorage.removeItem('session_token');
    window.location.href = '/';
    throw new Error('Session expired. Please log in again.');
  }

  return response;
}