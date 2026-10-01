import React, { useEffect, useState } from 'react';
import { getOrdersApi, cancelOrderApi } from '../services/api';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const statusColors = {
  Processing: 'warning',
  Shipped: 'info',
  Delivered: 'success',
  Cancelled: 'danger',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await cancelOrderApi(id);
      toast.success('Order cancelled');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container my-5">
      <h3 className="mb-4">My Orders</h3>

      {orders.length === 0 ? (
        <p className="text-muted">You haven't placed any orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="card shadow-sm mb-3">
            <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
              <div>
                <strong>Order #{order._id.slice(-8).toUpperCase()}</strong>
                <span className="text-muted small ms-2">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="d-flex gap-2 align-items-center">
                <span className={`badge bg-${statusColors[order.orderStatus] || 'secondary'}`}>
                  {order.orderStatus}
                </span>
                <span className="badge bg-light text-dark border">{order.paymentStatus}</span>
              </div>
            </div>
            <div className="card-body">
              {order.items.map((item, idx) => (
                <div key={idx} className="d-flex justify-content-between small mb-1">
                  <span>{item.title} x {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total</strong>
                <strong className="price-tag">₹{order.totalAmount.toFixed(2)}</strong>
              </div>
              <p className="small text-muted mt-2 mb-0">
                Shipping to: {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.state} {order.shippingAddress.zipCode}, {order.shippingAddress.country}
              </p>
              {(order.orderStatus === 'Processing') && (
                <button
                  className="btn btn-sm btn-outline-danger mt-3"
                  onClick={() => handleCancel(order._id)}
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
