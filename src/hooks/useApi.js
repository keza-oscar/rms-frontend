import { useNavigate } from 'react-router-dom';

export const useApi = () => {
  const navigate = useNavigate();
  const API_URL = 'http://localhost:5000/api';

  const getToken = () => localStorage.getItem('token');

  const request = async (endpoint, method = 'GET', data = null) => {
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const token = getToken();
      if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
      }

      if (data) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(`${API_URL}${endpoint}`, options);

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return null;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API error');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  return {
    get: (endpoint) => request(endpoint, 'GET'),
    post: (endpoint, data) => request(endpoint, 'POST', data),
    put: (endpoint, data) => request(endpoint, 'PUT', data),
    delete: (endpoint) => request(endpoint, 'DELETE'),
  };
};