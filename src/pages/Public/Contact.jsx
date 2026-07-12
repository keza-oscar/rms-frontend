import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate sending email
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', message: '' });
      setSubmitted(false);
    }, 3000);
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
          <a onClick={() => navigate('/public/order')}>Order</a>
          <a href="#contact">Contact</a>
          <button className="btn-login" onClick={() => navigate('/login')}>Staff</button>
        </div>
      </nav>

      <section className="contact-section">
        <h1>Get in Touch</h1>
        <p className="subtitle">Have questions? We'd love to hear from you.</p>

        <div className="contact-container">
          {/* CONTACT INFO */}
          <div className="contact-info">
            <div className="info-item">
              <h3>📍 Address</h3>
              <p>P.O.BOX 2946</p>
              <p>Dar es Salaam, Tanzania</p>
            </div>

            <div className="info-item">
              <h3>📞 Phone</h3>
              <p><a href="tel:+255676896563">+255 676 896 563</a></p>
              <p>Available 24/7</p>
            </div>

            <div className="info-item">
              <h3>📧 Email</h3>
              <p><a href="mailto:midtownfood@gmail.com">midtownfood@gmail.com</a></p>
              <p>Response within 2 hours</p>
            </div>

            <div className="info-item">
              <h3>🕐 Hours</h3>
              <p>24 Hours Every Day</p>
              <p>Always Open for You</p>
            </div>
          </div>

          {/* CONTACT FORM */}
          <form onSubmit={handleSubmit} className="contact-form">
            <h2>Send us a Message</h2>

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
              <label>Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+255 676 896 563"
              />
            </div>

            <div className="form-group">
              <label>Message *</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                required
                placeholder="Tell us how we can help..."
                rows="5"
              />
            </div>

            <button type="submit" className="btn-primary">Send Message</button>

            {submitted && (
              <div className="success-message">
                ✅ Thank you! We'll get back to you soon.
              </div>
            )}
          </form>
        </div>

        {/* MAP */}
        <div className="map-container" style={{marginTop: '40px'}}>
          <h2>Find Us on Google Maps</h2>
          <iframe
            width="100%"
            height="400"
            frameBorder="0"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.3894405935006!2d39.2025306!3d-6.7924203!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x185c48c8e8e8e8e9%3A0x1234567890!2sDar%20es%20Salaam!5e0!3m2!1sen!2stz!4v1234567890"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      <footer className="public-footer">
        <p>&copy; 2025 Midtown Restaurant</p>
      </footer>
    </div>
  );
}

export default Contact;