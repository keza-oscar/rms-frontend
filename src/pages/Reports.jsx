import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { usePdfExport } from '../hooks/usePdfExport';

function Reports() {
  const { get } = useApi();
  const { exportToPdf } = usePdfExport();
  const [report, setReport] = useState({});
  const [topItems, setTopItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reportData = await get('/reports/daily-sales');
        if (reportData) setReport(reportData);

        const topData = await get('/reports/top-items');
        if (topData) setTopItems(Array.isArray(topData) ? topData : []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [get]);

  const handleExportPdf = () => {
    exportToPdf('report-content', `Sales-Report-${new Date().toLocaleDateString()}.pdf`);
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1>Daily Reports 📊</h1>
        <p>Today's performance overview</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button className="btn-primary" onClick={handleExportPdf}>
          📥 Export as PDF
        </button>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div id="report-content">
          {/* SALES METRICS */}
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Total Orders</span>
              <div className="stat-value">{report.total_orders || 0}</div>
              <div className="stat-change">All orders today</div>
            </div>
            <div className="stat-card">
              <span className="stat-label">Completed Orders</span>
              <div className="stat-value">{report.completed_orders || 0}</div>
              <div className="stat-change">Successful transactions</div>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total Revenue</span>
              <div className="stat-value" style={{ fontSize: '24px' }}>
                {(report.total_revenue || 0).toLocaleString()} TZS
              </div>
              <div className="stat-change">Today's total</div>
            </div>
            <div className="stat-card">
              <span className="stat-label">Avg Order Value</span>
              <div className="stat-value">
                {report.total_orders ? Math.round(report.total_revenue / report.total_orders) : 0} TZS
              </div>
              <div className="stat-change">Per order</div>
            </div>
            <div className="stat-card">
              <span className="stat-label">Completion Rate</span>
              <div className="stat-value">
                {report.total_orders ? Math.round((report.completed_orders / report.total_orders) * 100) : 0}%
              </div>
              <div className="stat-change">Success rate</div>
            </div>
            <div className="stat-card">
              <span className="stat-label">Pending Orders</span>
              <div className="stat-value" style={{ color: '#f39c12' }}>
                {(report.total_orders || 0) - (report.completed_orders || 0)}
              </div>
              <div className="stat-change">Still processing</div>
            </div>
          </div>

          {/* TOP SELLING ITEMS */}
          <div className="table-container" style={{ marginTop: '30px' }}>
            <div className="table-header">
              <h3 className="table-title">🏆 Top Selling Items</h3>
            </div>
            {topItems.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Item Name</th>
                    <th>Quantity Sold</th>
                    <th>Revenue</th>
                    <th>% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {topItems.map((item, index) => {
                    const percentage = report.total_revenue 
                      ? Math.round((item.total_revenue / report.total_revenue) * 100) 
                      : 0;
                    return (
                      <tr key={item.item_id}>
                        <td style={{ fontWeight: 'bold', fontSize: '16px' }}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} #{index + 1}
                        </td>
                        <td>{item.item_name}</td>
                        <td style={{ fontWeight: '600' }}>{item.total_quantity || 0}</td>
                        <td style={{ fontWeight: 'bold', color: '#d4a574' }}>
                          {(item.total_revenue || 0).toLocaleString()} TZS
                        </td>
                        <td style={{ color: '#27ae60', fontWeight: '600' }}>
                          {percentage}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <h3>No sales data available</h3>
              </div>
            )}
          </div>

          {/* SUMMARY SECTION */}
          <div
            style={{
              marginTop: '30px',
              padding: '20px',
              backgroundColor: '#1a2332',
              border: '1px solid #2a3544',
              borderRadius: '12px'
            }}
          >
            <h3 style={{ marginBottom: '15px' }}>📈 Today's Summary</h3>
            <p style={{ fontSize: '13px', color: '#b0b8c1', lineHeight: '1.8' }}>
              Generated on: {new Date().toLocaleString()}
              <br />
              Total Orders: {report.total_orders || 0} | Completed: {report.completed_orders || 0}
              <br />
              Revenue: {(report.total_revenue || 0).toLocaleString()} TZS | Average Order: {report.total_orders ? Math.round(report.total_revenue / report.total_orders) : 0} TZS
              <br />
              Success Rate: {report.total_orders ? Math.round((report.completed_orders / report.total_orders) * 100) : 0}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;