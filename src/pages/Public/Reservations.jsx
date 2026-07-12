import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Reservations() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    specialRequests: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          guests: 2,
          specialRequests: ''
        });
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to make reservation');
    }
  };

  return (
    <div className="public-container">
      <nav className="public-nav">
        <div className="nav-brand">
          <h1>MIDTOWN</h1>
        </div>
        <div className="nav-links">
          <a onClick={() => navigate('/public/')}>Home</a>
          <a onClick={() => navigate('/public/menu')}>Menu</a>
          <a href="#reservations">Reserve</a>
          <a onClick={() => navigate('/public/order')}>Order</a>
          <button className="btn-login" onClick={() => navigate('/login')}>Staff</button>
        </div>
      </nav>

      <section className="reservation-section">
        <h1>Make a Reservation</h1>
        <p className="subtitle">Book your table at Midtown Restaurant</p>

        <div className="reservation-form-container">
          <form onSubmit={handleSubmit} className="reservation-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="Your name"
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                  placeholder="+255 676 896 563"
                />
              </div>

              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Time *</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Number of Guests *</label>
                <select
                  value={formData.guests}
                  onChange={(e) => setFormData({...formData, guests: e.target.value})}
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>

              <div className="form-group full-width">
                <label>Special Requests</label>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                  placeholder="Any special requests? (Allergies, celebrations, etc.)"
                  rows="4"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary">Confirm Reservation</button>
          </form>

          {submitted && (
            <div className="success-message">
              ✅ Reservation confirmed! We'll contact you soon.
            </div>
          )}
        </div>

        <div className="reservation-info">
          <h3>📞 Call us for urgent bookings</h3>
          <p>+255 676 896 563</p>
        </div>
      </section>

      <footer className="public-footer">
        <p>&copy; 2025 Midtown Restaurant</p>
      </footer>
    </div>
  );
}

export default Reservations;
