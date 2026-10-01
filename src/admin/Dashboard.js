import React, { useEffect, useState } from 'react';
import { FaBook, FaShoppingBag, FaUsers, FaRupeeSign } from 'react-icons/fa';
import { getDashboardStatsApi } from '../services/api';
import AdminSidebar from './AdminSidebar';
import Loader from '../components/Loader';
import './Dashboard.css';

const statusColors = {
  Processing: 'warning',
  Shipped: 'info',
  Delivered: 'success',
  Cancelled: 'danger',
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStatsApi();
        setStats(res.data.stats);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Books', value: stats?.totalBooks, icon: <FaBook />, color: '#4e73df' },
    { label: 'Total Orders', value: stats?.totalOrders, icon: <FaShoppingBag />, color: '#1cc88a' },
    { label: 'Total Users', value: stats?.totalUsers, icon: <FaUsers />, color: '#f6c23e' },
    { label: 'Revenue', value: `₹${stats?.totalRevenue?.toFixed(2) || 0}`, icon: <FaRupeeSign />, color: '#e74a3b' },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <h3 className="mb-4">Admin Dashboard</h3>

        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="row g-4 mb-4">
              {cards.map((card) => (
                <div className="col-md-3" key={card.label}>
                  <div className="card dashboard-card p-3 d-flex flex-row align-items-center gap-3">
                    <div className="stat-icon-wrap" style={{ backgroundColor: card.color }}>
                      {card.icon}
                    </div>
                    <div>
                      <p className="mb-0 text-muted small">{card.label}</p>
                      <h4 className="mb-0">{card.value ?? 0}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="row g-4">
              <div className="col-md-5">
                <div className="card dashboard-card p-3">
                  <h6>Orders by Status</h6>
                  {stats?.ordersByStatus?.map((s) => (
                    <div key={s._id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <span className={`badge bg-${statusColors[s._id] || 'secondary'}`}>{s._id}</span>
                      <strong>{s.count}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-md-7">
                <div className="card dashboard-card p-3">
                  <h6>Recent Orders</h6>
                  <div className="table-responsive">
                    <table className="table table-sm admin-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats?.recentOrders?.map((order) => (
                          <tr key={order._id}>
                            <td>#{order._id.slice(-8).toUpperCase()}</td>
                            <td>{order.user?.username}</td>
                            <td>₹{order.totalAmount.toFixed(2)}</td>
                            <td>
                              <span className={`badge bg-${statusColors[order.orderStatus] || 'secondary'}`}>
                                {order.orderStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
