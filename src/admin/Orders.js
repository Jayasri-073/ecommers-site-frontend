import React, { useEffect, useState } from 'react';
import { getOrdersApi, updateOrderApi } from '../services/api';
import AdminSidebar from './AdminSidebar';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import './Dashboard.css';

const statusColors = {
  Processing: 'warning',
  Shipped: 'info',
  Delivered: 'success',
  Cancelled: 'danger',
};

const ORDER_STATUSES = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
const PAYMENT_STATUSES = ['Pending', 'Paid', 'Failed'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrdersApi();
      setOrders(res.data.orders);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, field, value) => {
    try {
      setUpdatingId(id);
      await updateOrderApi(id, { [field]: value });
      toast.success('Order updated');
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, [field]: value } : o))
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <h3 className="mb-4">Manage Orders</h3>

        <div className="card dashboard-card p-3">
          {loading ? (
            <Loader />
          ) : (
            <div className="table-responsive">
              <table className="table table-hover admin-table align-middle">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Order Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>#{order._id.slice(-8).toUpperCase()}</td>
                      <td>
                        {order.user?.username}
                        <br />
                        <span className="text-muted small">{order.user?.email}</span>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>{order.items.length} item(s)</td>
                      <td>₹{order.totalAmount.toFixed(2)}</td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={order.paymentStatus}
                          disabled={updatingId === order._id}
                          onChange={(e) => handleStatusChange(order._id, 'paymentStatus', e.target.value)}
                        >
                          {PAYMENT_STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          className={`form-select form-select-sm border-${statusColors[order.orderStatus] || 'secondary'}`}
                          value={order.orderStatus}
                          disabled={updatingId === order._id}
                          onChange={(e) => handleStatusChange(order._id, 'orderStatus', e.target.value)}
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && <p className="text-center text-muted py-3">No orders found.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
