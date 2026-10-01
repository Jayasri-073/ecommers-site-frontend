import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrderApi } from '../services/api';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { cart, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [placing, setPlacing] = useState(false);

  if (!cart.items || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      setPlacing(true);
      const res = await createOrderApi({ shippingAddress, paymentMethod });
      toast.success('Order placed successfully!');
      await fetchCart();
      navigate(`/orders`, { state: { newOrderId: res.data.order._id } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="container my-5">
      <h3 className="mb-4">Checkout</h3>
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card shadow-sm p-4">
            <h5>Shipping Address</h5>
            <form id="checkout-form" onSubmit={handlePlaceOrder}>
              <div className="mb-3">
                <label className="form-label">Street Address</label>
                <input
                  type="text"
                  name="street"
                  className="form-control"
                  value={shippingAddress.street}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    name="city"
                    className="form-control"
                    value={shippingAddress.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    name="state"
                    className="form-control"
                    value={shippingAddress.state}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Zip Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    className="form-control"
                    value={shippingAddress.zipCode}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    name="country"
                    className="form-control"
                    value={shippingAddress.country}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <h5 className="mt-4">Payment Method</h5>
              {['COD', 'Card', 'UPI', 'PayPal'].map((method) => (
                <div className="form-check" key={method}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id={method}
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor={method}>
                    {method === 'COD' ? 'Cash on Delivery' : method}
                  </label>
                </div>
              ))}
            </form>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card shadow-sm p-4">
            <h5>Order Summary</h5>
            {cart.items.map((item) => (
              <div key={item._id} className="d-flex justify-content-between small mb-2">
                <span>{item.book?.title} x {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <hr />
            <div className="d-flex justify-content-between mb-3">
              <strong>Total</strong>
              <strong className="price-tag">₹{cart.totalPrice?.toFixed(2)}</strong>
            </div>
            <button
              type="submit"
              form="checkout-form"
              className="btn brand-btn w-100"
              disabled={placing}
            >
              {placing ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
