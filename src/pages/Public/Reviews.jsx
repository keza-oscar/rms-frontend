import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Reviews() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: 'John Doe',
      rating: 5,
      comment: 'Amazing food and atmosphere! The nostalgic vibe was perfect.',
      date: '2025-01-15'
    },
    {
      id: 2,
      name: 'Jane Smith',
      rating: 5,
      comment: 'Best restaurant in town. Service was excellent and food was delicious!',
      date: '2025-01-10'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      rating: 4,
      comment: 'Great experience overall. Would definitely come back.',
      date: '2025-01-05'
    },
    {
      id: 4,
      name: 'Sarah Williams',
      rating: 5,
      comment: 'The online ordering system is so convenient! Love Midtown!',
      date: '2025-01-01'
    }
  ]);

  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    comment: ''
  });

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (newReview.name && newReview.comment) {
      setReviews([
        {
          id: reviews.length + 1,
          name: newReview.name,
          rating: newReview.rating,
          comment: newReview.comment,
          date: new Date().toISOString().split('T')[0]
        },
        ...reviews
      ]);
      setNewReview({ name: '', rating: 5, comment: '' });
    }
  };

  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="public-container">
      <nav className="public-nav">
        <div className="nav-brand">
          <h1>MIDTOWN</h1>
        </div>
        <div className="nav-links">
          <button className="nav-link-btn" onClick={() => navigate('/public/')}>Home</button>
          <button className="nav-link-btn" onClick={() => navigate('/public/menu')}>Menu</button>
          <button className="nav-link-btn" onClick={() => navigate('/public/order')}>Order</button>
          <a href="#reviews">Reviews</a>
          <button className="btn-login" onClick={() => navigate('/login')}>Staff</button>
        </div>
      </nav>

      <section className="reviews-section">
        <h1>Customer Reviews</h1>

        {/* RATING SUMMARY */}
        <div className="rating-summary">
          <div className="rating-display">
            <div className="rating-stars">
              {'⭐'.repeat(Math.round(averageRating))}
            </div>
            <h2>{averageRating} / 5.0</h2>
            <p>Based on {reviews.length} reviews</p>
          </div>
        </div>

        {/* ADD REVIEW FORM */}
        <div className="add-review-box">
          <h3>Share Your Experience</h3>
          <form onSubmit={handleSubmitReview} className="review-form">
            <div className="form-group">
              <label>Your Name *</label>
              <input
                type="text"
                value={newReview.name}
                onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                required
                placeholder="Enter your name"
              />
            </div>

            <div className="form-group">
              <label>Rating *</label>
              <div className="star-rating">
                {[1,2,3,4,5].map(star => (
                  <button
                    key={star}
                    type="button"
                    className={`star ${newReview.rating >= star ? 'active' : ''}`}
                    onClick={() => setNewReview({...newReview, rating: star})}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Your Review *</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                required
                placeholder="Tell us about your experience..."
                rows="4"
              />
            </div>

            <button type="submit" className="btn-primary">Submit Review</button>
          </form>
        </div>

        {/* REVIEWS LIST */}
        <div className="reviews-list">
          <h3>Customer Reviews</h3>
          {reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div>
                  <h4>{review.name}</h4>
                  <div className="review-rating">
                    {'⭐'.repeat(review.rating)}
                    <span className="date">{review.date}</span>
                  </div>
                </div>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="public-footer">
        <p>&copy; 2025 Midtown Restaurant</p>
      </footer>
    </div>
  );
}

export default Reviews;