import React from 'react';
import { useNavigate } from 'react-router-dom';

function TestPage() {
  const navigate = useNavigate();

  return (
    <div className="public-container">
      <nav className="public-nav"><div className="nav-brand"><h1>MIDTOWN</h1></div></nav>
      <section className="menu-section">
        <h1>Test Page</h1>
        <p className="subtitle">The public website routes are working.</p>
        <button className="btn-primary" onClick={() => navigate('/public/')}>Return Home</button>
      </section>
    </div>
  );
}

export default TestPage;
