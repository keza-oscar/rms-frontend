import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';

function PaymentProcessing() {
  const { get, post } = useApi();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      const data = await get('/orders');
      if (data && Array.isArray(data)) {
        // Show only completed orders ready for payment
        const readyOrders = data.filter(
          (order) => order.status === 'Ready' || order.status === 'Completed'
        );
        setOrders(readyOrders);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async (order) => {
    setProcessing(true);
    try {
      const paymentData = await post('/payments', {
        order_id: order.order_id,
        payment_method: paymentMethod,
        amount: order.total_amount,
        payment_status: 'Completed',
      });

      if (paymentData) {
        alert(`✅ Payment processed successfully!\nAmount: ${order.total_amount} TZS`);
        setSelectedOrder(null);
        setPaymentMethod('cash');
        fetchPendingOrders();
      }
    } catch (error) {
      alert('❌ Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1>Payment Processing 💳</h1>
        <p>Process payments for completed orders</p>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* PENDING PAYMENTS LIST */}
          <div className="table-container">
            <div className="table-header">
              <h3 className="table-title">Ready for Payment</h3>
              <span style={{ color: '#d4a574', fontWeight: 'bold' }}>
                {orders.length} orders
              </span>
            </div>

            {orders.length > 0 ? (
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {orders.map((order) => (
                  <div
                    key={order.order_id}
                    onClick={() => setSelectedOrder(order)}
                    style={{
                      padding: '16px',
                      borderLeft: selectedOrder?.order_id === order.order_id ? '4px solid #d4a574' : '4px solid #2a3544',
                      backgroundColor: selectedOrder?.order_id === order.order_id ? '#252f3f' : 'transparent',
                      cursor: 'pointer',
                      marginBottom: '12px',
                      borderRadius: '6px',
                      transition: 'all 0.3s'
                    }}
                  >
                    <div style={{ fontWeight: '700', marginBottom: '8px' }}>
                      Order #{order.order_id}
                    </div>
                    <div style={{ fontSize: '12px', color: '#b0b8c1', marginBottom: '8px' }}>
                      {order.customer_name || 'Walk-in'} • Table {order.table_id || '-'}
                    </div>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#d4a574'
                    }}>
                      {(order.total_amount || 0).toLocaleString()} TZS
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>No pending payments</h3>
                <p>All orders processed!</p>
              </div>
            )}
          </div>

          {/* PAYMENT FORM */}
          <div className="table-container">
            <div className="table-header">
              <h3 className="table-title">Payment Details</h3>
            </div>

            {selectedOrder ? (
              <div style={{ padding: '20px' }}>
                {/* ORDER SUMMARY */}
                <div style={{
                  padding: '15px',
                  backgroundColor: '#252f3f',
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}>
                  <div style={{ color: '#b0b8c1', fontSize: '12px', marginBottom: '5px' }}>
                    Order Number
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '15px' }}>
                    #{selectedOrder.order_id}
                  </div>

                  <div style={{ color: '#b0b8c1', fontSize: '12px', marginBottom: '5px' }}>
                    Customer
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>
                    {selectedOrder.customer_name || 'Walk-in'}
                  </div>

                  <div style={{ color: '#b0b8c1', fontSize: '12px', marginBottom: '5px' }}>
                    Amount to Pay
                  </div>
                  <div style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#27ae60'
                  }}>
                    {(selectedOrder.total_amount || 0).toLocaleString()} TZS
                  </div>
                </div>

                {/* PAYMENT METHOD */}
                <div className="form-group">
                  <label>Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="select"
                  >
                    <option value="cash">💵 Cash</option>
                    <option value="card">💳 Card</option>
                    <option value="pesapal">📱 Pesapal</option>
                    <option value="bank">🏦 Bank Transfer</option>
                  </select>
                </div>

                {/* PAYMENT STATUS */}
                <div style={{
                  padding: '12px',
                  backgroundColor: 'rgba(39, 174, 96, 0.15)',
                  border: '1px solid #27ae60',
                  borderRadius: '6px',
                  marginBottom: '20px',
                  color: '#27ae60',
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  ✓ Ready for payment
                </div>

                {/* PROCESS BUTTON */}
                <button
                  onClick={() => handleProcessPayment(selectedOrder)}
                  disabled={processing}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '16px',
                    fontWeight: '700'
                  }}
                >
                  {processing ? 'Processing...' : '✓ Complete Payment'}
                </button>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="btn-secondary"
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginTop: '10px'
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">👈</div>
                <p>Select an order to process payment</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentProcessing;