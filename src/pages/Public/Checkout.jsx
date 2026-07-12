import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart = [], total = 0 } = location.state || {};

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'card'
  });

  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // Simulate payment processing (Stripe test mode)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create order in backend
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          delivery_address: formData.address,
          items: cart,
          total_amount: total,
          payment_method: formData.paymentMethod,
          status: 'Pending'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(true);
        setTimeout(() => {
          navigate('/public/order-tracking', { state: { orderId: data.order_id } });
        }, 2000);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="public-container">
        <nav className="public-nav">
          <h1>MIDTOWN</h1>
          <button onClick={() => navigate('/public/order')}>← Back to Order</button>
        </nav>
        <p style={{textAlign: 'center', padding: '40px'}}>No items in cart</p>
      </div>
    );
  }

  return (
    <div className="public-container">
      <nav className="public-nav">
        <div className="nav-brand">
          <h1>MIDTOWN</h1>
        </div>
        <div className="nav-links">
          <button onClick={() => navigate('/public/')}>Home</button>
          <button onClick={() => navigate('/public/order')}>← Back</button>
        </div>
      </nav>

      <section className="checkout-section">
        <h1>Complete Your Order</h1>

        <div className="checkout-container">
          {/* ORDER SUMMARY */}
          <div className="order-summary-box">
            <h3>Order Summary</h3>
            {cart.map(item => (
              <div key={item.item_id} className="summary-item">
                <span>{item.item_name} x{item.quantity}</span>
              </div>
            ))}
            <div className="summary-total">
              <strong>Total: {total} TZS</strong>
            </div>
          </div>

          {/* CHECKOUT FORM */}
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h3>Delivery Information</h3>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
            <textarea
              placeholder="Delivery Address"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              required
            />
            <h3>Payment Method</h3>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
            >
              <option value="card">Credit/Debit Card</option>
              <option value="cash">Cash on Delivery</option>
            </select>
            <button type="submit" disabled={processing}>
              {processing ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
      </section>

      <footer className="public-footer">
        <p>&copy; 2025 Midtown Restaurant</p>
      </footer>
    </div>
  );
}

export default Checkout;
