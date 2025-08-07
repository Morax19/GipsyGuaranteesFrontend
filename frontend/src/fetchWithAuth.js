// A fetch wrapper to handle JWT 401 errors and auto-logout (no auto-refresh)
export async function fetchWithAuth(url, options = {}) {
  let token = localStorage.getItem('session_token');
  if (!options.headers) options.headers = {};
  if (token) options.headers['Authorization'] = `Bearer ${token}`;

  let response = await fetch(url, options);
  if (response.status === 401) {
    // On 401, logout immediately (do not refresh token here)
    localStorage.removeItem('session_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }
  return response;
}