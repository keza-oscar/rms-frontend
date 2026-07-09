import React, { useState, useEffect } from 'react';
import RestaurantScene from '../components/3D/RestaurantScene';
import MenuCard3D from '../components/3D/MenuCard3D';
import { useApi } from '../hooks/useApi';

function Landing3D() {
  const { get } = useApi();
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await get('/menu');
        if (data && Array.isArray(data)) {
          setMenuItems(data.slice(0, 5));
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchMenu();
  }, [get]);

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px' }}>
      {/* HERO SECTION */}
      <div style={{
        textAlign: 'center',
        marginBottom: '60px'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '700',
          color: '#fff',
          marginBottom: '10px'
        }}>
          🍽️ Mr. Appetite RMS
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#b0b8c1',
          marginBottom: '40px'
        }}>
          Premium Restaurant Management System with 3D Experience
        </p>
      </div>

      {/* 3D SCENE */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        marginBottom: '60px'
      }}>
        <RestaurantScene />
      </div>

      {/* FEATURES */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '30px',
        maxWidth: '1200px',
        margin: '0 auto',
        marginBottom: '60px'
      }}>
        <div style={{
          padding: '30px',
          backgroundColor: '#1a2332',
          borderRadius: '12px',
          border: '1px solid #2a3544',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '15px' }}>📊</div>
          <h3 style={{ color: '#d4a574', marginBottom: '10px' }}>Smart Analytics</h3>
          <p style={{ color: '#b0b8c1', fontSize: '13px' }}>Real-time reports & insights</p>
        </div>

        <div style={{
          padding: '30px',
          backgroundColor: '#1a2332',
          borderRadius: '12px',
          border: '1px solid #2a3544',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '15px' }}>🔐</div>
          <h3 style={{ color: '#d4a574', marginBottom: '10px' }}>Role-Based Access</h3>
          <p style={{ color: '#b0b8c1', fontSize: '13px' }}>6 different user roles</p>
        </div>

        <div style={{
          padding: '30px',
          backgroundColor: '#1a2332',
          borderRadius: '12px',
          border: '1px solid #2a3544',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '15px' }}>⚡</div>
          <h3 style={{ color: '#d4a574', marginBottom: '10px' }}>Lightning Fast</h3>
          <p style={{ color: '#b0b8c1', fontSize: '13px' }}>Optimized performance</p>
        </div>
      </div>

      {/* 3D MENU PREVIEW */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        marginBottom: '60px'
      }}>
        <h2 style={{ color: '#fff', marginBottom: '20px', fontSize: '32px' }}>
          ✨ Interactive 3D Menu
        </h2>
        <MenuCard3D items={menuItems} />
      </div>

      {/* CTA BUTTON */}
      <div style={{ textAlign: 'center' }}>
        <a href="/login" style={{
          display: 'inline-block',
          padding: '16px 40px',
          backgroundColor: '#d4a574',
          color: '#0f1419',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '700',
          fontSize: '16px',
          transition: 'all 0.3s'
        }}>
          🚀 Enter System
        </a>
      </div>
    </div>
  );
}

export default Landing3D;