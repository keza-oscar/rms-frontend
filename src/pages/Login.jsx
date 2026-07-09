import React, { useState } from 'react';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      const data = await response.json();
      // NOW INCLUDES role_id!
      onLogin(data.token, data.user);
    } catch (err) {
      setError('Cannot connect to server. Make sure backend is running on port 5000.');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <div className="login-logo">🍽️</div>
          <h2>Mr. Appetite RMS</h2>
          <p>Restaurant Management System</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'rgba(212, 165, 116, 0.1)', borderRadius: '8px' }}>
          <p style={{ fontSize: '12px', color: '#b0b8c1', marginBottom: '8px' }}>Demo Credentials:</p>
          <p style={{ fontSize: '12px', color: '#ffffff', marginBottom: '5px' }}>Admin: <strong>rms_db</strong> / <strong>kezaoscar46</strong></p>
          <p style={{ fontSize: '12px', color: '#b0b8c1' }}>Try different roles for different dashboards!</p>
        </div>
      </div>
    </div>
  );
}

export default Login;