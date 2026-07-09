import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';

function AdvancedAnalytics() {
  const { get } = useApi();
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersRes = await get('/orders');
        const inventoryRes = await get('/inventory');
        const menuRes = await get('/menu');

        if (ordersRes) setOrders(Array.isArray(ordersRes) ? ordersRes : []);
        if (inventoryRes) setInventory(Array.isArray(inventoryRes) ? inventoryRes : []);
        if (menuRes) setMenu(Array.isArray(menuRes) ? menuRes : []);

        // Calculate analytics
        calculateAnalytics(ordersRes, menuRes, inventoryRes);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [get]);

  const calculateAnalytics = (ordersData, menuData, inventoryData) => {
    if (!ordersData || !Array.isArray(ordersData)) return;

    // Revenue by category
    const revenueByCategory = {};
    ordersData.forEach(order => {
      // This would need order details, approximating for now
      if (!revenueByCategory['General']) {
        revenueByCategory['General'] = 0;
      }
      revenueByCategory['General'] += order.total_amount || 0;
    });

    // Inventory health
    const lowStockCount = inventoryData?.filter(item => item.quantity < item.reorder_level).length || 0;
    const adequateStockCount = inventoryData?.filter(item => item.quantity >= item.reorder_level).length || 0;

    // Peak hours (approximation)
    const hourCounts = {};
    ordersData.forEach(order => {
      const hour = new Date(order.order_date).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    const peakHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0];

    setAnalytics({
      revenueByCategory,
      lowStockCount,
      adequateStockCount,
      peakHour: peakHour ? `${peakHour[0]}:00` : 'N/A',
      peakHourOrders: peakHour ? peakHour[1] : 0,
      totalOrders: ordersData.length,
      averageOrderValue: ordersData.length > 0 
        ? Math.round(ordersData.reduce((sum, o) => sum + (o.total_amount || 0), 0) / ordersData.length)
        : 0,
      totalRevenue: ordersData.reduce((sum, o) => sum + (o.total_amount || 0), 0)
    });
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1>Advanced Analytics 📈</h1>
        <p>Deep insights into business performance</p>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <>
          {/* KEY METRICS */}
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Total Revenue</span>
              <div className="stat-value" style={{ fontSize: '28px' }}>
                {(analytics.totalRevenue || 0).toLocaleString()} TZS
              </div>
              <div className="stat-change">All time</div>
            </div>

            <div className="stat-card">
              <span className="stat-label">Average Order Value</span>
              <div className="stat-value">
                {(analytics.averageOrderValue || 0).toLocaleString()} TZS
              </div>
              <div className="stat-change">Per transaction</div>
            </div>

            <div className="stat-card">
              <span className="stat-label">Peak Hour</span>
              <div className="stat-value" style={{ fontSize: '28px' }}>
                {analytics.peakHour}
              </div>
              <div className="stat-change">{analytics.peakHourOrders} orders</div>
            </div>

            <div className="stat-card">
              <span className="stat-label">Inventory Status</span>
              <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#27ae60' }}>
                    {analytics.adequateStockCount}
                  </div>
                  <div style={{ fontSize: '11px', color: '#b0b8c1' }}>Adequate</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#e74c3c' }}>
                    {analytics.lowStockCount}
                  </div>
                  <div style={{ fontSize: '11px', color: '#b0b8c1' }}>Low Stock</div>
                </div>
              </div>
            </div>
          </div>

          {/* DETAILED BREAKDOWN */}
          <div className="table-container" style={{ marginTop: '30px' }}>
            <div className="table-header">
              <h3 className="table-title">💼 Business Metrics Summary</h3>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px'
              }}>
                <div style={{
                  padding: '15px',
                  backgroundColor: '#252f3f',
                  borderRadius: '8px',
                  borderLeft: '4px solid #d4a574'
                }}>
                  <div style={{ fontSize: '12px', color: '#b0b8c1', marginBottom: '8px' }}>
                    Total Orders
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '700' }}>
                    {analytics.totalOrders || 0}
                  </div>
                </div>

                <div style={{
                  padding: '15px',
                  backgroundColor: '#252f3f',
                  borderRadius: '8px',
                  borderLeft: '4px solid #27ae60'
                }}>
                  <div style={{ fontSize: '12px', color: '#b0b8c1', marginBottom: '8px' }}>
                    Busiest Time
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '700' }}>
                    {analytics.peakHour}
                  </div>
                </div>

                <div style={{
                  padding: '15px',
                  backgroundColor: '#252f3f',
                  borderRadius: '8px',
                  borderLeft: '4px solid #3498db'
                }}>
                  <div style={{ fontSize: '12px', color: '#b0b8c1', marginBottom: '8px' }}>
                    Inventory Health
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '700' }}>
                    {analytics.adequateStockCount}/{(analytics.adequateStockCount || 0) + (analytics.lowStockCount || 0)}
                  </div>
                </div>
              </div>

              <div style={{
                marginTop: '20px',
                padding: '15px',
                backgroundColor: '#1a2332',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#b0b8c1',
                lineHeight: '1.8'
              }}>
                <strong style={{ color: '#fff' }}>📊 Quick Insights:</strong>
                <br />
                • Average transaction value is {(analytics.averageOrderValue || 0).toLocaleString()} TZS
                <br />
                • Busiest hour is {analytics.peakHour} with {analytics.peakHourOrders} orders
                <br />
                • {analytics.lowStockCount} item(s) need urgent restocking
                <br />
                • Total revenue generated: {(analytics.totalRevenue || 0).toLocaleString()} TZS
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdvancedAnalytics;