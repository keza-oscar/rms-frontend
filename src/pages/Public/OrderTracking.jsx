import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function OrderTracking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = location.state || {};

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (orderId) {
          const response = await fetch(`http://localhost:5000/api/orders/${orderId}`);
          const data = await response.json();
          setOrder(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return <div className="public-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="public-container">
      <nav className="public-nav">
        <div className="nav-brand">
          <h1>MIDTOWN</h1>
        </div>
        <div className="nav-links">
          <button onClick={() => navigate('/public/')}>Home</button>
          <button onClick={() => navigate('/public/order')}>New Order</button>
        </div>
      </nav>

      <section className="tracking-section">
        <h1>Track Your Order</h1>

        {order ? (
          <div className="tracking-container">
            <div className="order-header">
              <h2>Order #{order.order_id}</h2>
              <span className="status-badge">{order.status}</span>
            </div>

            <div className="timeline">
              <div className="timeline-item completed">
                <div className="timeline-dot">📋</div>
                <div className="timeline-content">
                  <h4>Order Received</h4>
                  <p>Your order has been received</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot">👨‍🍳</div>
                <div className="timeline-content">
                  <h4>Preparing</h4>
                  <p>Chef is preparing your meal</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot">🚚</div>
                <div className="timeline-content">
                  <h4>Out for Delivery</h4>
                  <p>Your order is on the way</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot">✅</div>
                <div className="timeline-content">
                  <h4>Delivered</h4>
                  <p>Enjoy your meal!</p>
                </div>
              </div>
            </div>

            <div className="order-details">
              <h3>Order Details</h3>
              <div className="details-grid">
                <div className="detail">
                  <span className="label">Order Time:</span>
                  <span>{new Date(order.order_date).toLocaleString()}</span>
                </div>
                <div className="detail">
                  <span className="label">Total Amount:</span>
                  <span>{(order.total_amount || 0).toLocaleString()} TZS</span>
                </div>
                <div className="detail">
                  <span className="label">Status:</span>
                  <span>{order.status}</span>
                </div>
              </div>
            </div>

            <div className="contact-box">
              <h3>📞 Need Help?</h3>
              <p>Call: +255 676 896 563</p>
              <p>Email: midtownfood@gmail.com</p>
            </div>
          </div>
        ) : (
          <div className="error-message">
            <p>Order not found</p>
            <button onClick={() => navigate('/public/order')}>Place New Order</button>
          </div>
        )}
      </section>

      <footer className="public-footer">
        <p>&copy; 2025 Midtown Restaurant</p>
      </footer>
    </div>
  );
}

export default OrderTracking;
