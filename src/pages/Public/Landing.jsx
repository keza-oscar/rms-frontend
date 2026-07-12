import React from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="public-container landing-page">
      <nav className="public-nav landing-nav">
        <div className="nav-brand" onClick={() => navigate('/public/')}>
          <h1>MIDTOWN</h1><span>RESTAURANT</span>
        </div>
        <div className="nav-links">
          <button onClick={() => navigate('/public/menu')}>Menu</button>
          <button onClick={() => navigate('/public/reservations')}>Reserve</button>
          <button onClick={() => navigate('/public/order')}>Order</button>
          <button className="btn-login" onClick={() => navigate('/login')}>Staff</button>
        </div>
      </nav>

      <main>
        <section className="landing-hero">
          <div className="hero-copy">
            <p className="eyebrow">DAR ES SALAAM - GOOD FOOD, BETTER MOMENTS</p>
            <h2>Come hungry.<br /><em>Leave inspired.</em></h2>
            <p className="hero-description">A warm table, a lively kitchen and the comfort of your favourite dishes—right in the heart of the city.</p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => navigate('/public/reservations')}>Reserve a Table</button>
              <button className="text-button" onClick={() => navigate('/public/menu')}>Explore the menu <span aria-hidden="true">-&gt;</span></button>
            </div>
            <div className="hero-note"><span className="pulse-dot" />Open daily - dine in or order ahead</div>
          </div>
          <div className="hero-gallery" aria-label="A selection of Midtown dishes">
            <img className="hero-main-image" src="/images/menu/ugali-fish.jpg" alt="An East African meal" />
            <img className="hero-detail-image" src="/images/menu/chocolate-cake.jpg" alt="Chocolate cake" />
            <div className="gallery-caption"><span>EST.</span><strong>2025</strong><span>MADE WITH CARE</span></div>
          </div>
        </section>

        <section className="landing-intro">
          <div><p className="eyebrow">THE MIDTOWN WAY</p><h2>Local flavour. <em>Lasting memories.</em></h2></div>
          <p>Whether you are dropping in for a quick lunch, bringing friends together, or treating yourself at home, Midtown makes every meal feel like an occasion.</p>
        </section>

        <section className="experience-grid">
          <article className="experience-card"><p className="card-number">01</p><h3>Made for your appetite</h3><p>From familiar favourites to something new, find your next plate.</p><button className="card-link" onClick={() => navigate('/public/menu')}>View menu <span aria-hidden="true">-&gt;</span></button></article>
          <article className="experience-card featured-card"><p className="card-number">02</p><h3>Good food, your way</h3><p>Build your order online and enjoy Midtown wherever you are.</p><button className="card-link" onClick={() => navigate('/public/order')}>Start an order <span aria-hidden="true">-&gt;</span></button></article>
          <article className="experience-card"><p className="card-number">03</p><h3>Save a seat</h3><p>Planning a catch-up or celebration? We will have the table ready.</p><button className="card-link" onClick={() => navigate('/public/reservations')}>Make a reservation <span aria-hidden="true">-&gt;</span></button></article>
        </section>

        <section className="landing-cta">
          <div><p className="eyebrow">YOUR TABLE IS WAITING</p><h2>Bring your people.<br /><em>We will bring the flavour.</em></h2></div>
          <button className="btn-primary" onClick={() => navigate('/public/reservations')}>Book your table</button>
        </section>
      </main>
      <footer className="public-footer"><p>&copy; 2025 Midtown Restaurant - Dar es Salaam</p></footer>
    </div>
  );
}

export default Landing;
