import { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import api from '../api/axios';
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import './Order.css';

function OrderHistory() {
  const { authUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/order");
        setOrders(response.data.order);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (authUser?.id) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [authUser]);

  if (loading) return <div className="loader">Loading your orders...</div>;

  return (
    <div>
      <Navbar />
      <div className="order-container">
        <div className="order-page-header">
          <div>
            <p className="order-eyebrow">Purchases</p>
            <h2>My Orders</h2>
          </div>
          <span className="order-count">{orders.length} orders</span>
        </div>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <h3>No orders yet</h3>
            <p>Your purchased shoes will appear here after checkout.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <p><strong>Order ID:</strong> #{order.orderId}</p>
                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
              </div>

              <div className="order-items">
                {order.products.map((item) => (
                  <div key={`${item.productId._id}-${item.size}`} className="item-row">
                    <img
                      src={item.productId.image}
                      alt={item.productId.name}
                      className="order-item-img"
                    />

                    <div className="item-details">
                      <div>
                        <span>{item.productId.name}</span>
                        <p>{item.productId.brand} - Size US {item.size} - Qty {item.quantity}</p>
                      </div>
                      <strong>Rs {item.price * item.quantity}</strong>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div>
                  <p><strong>Payment:</strong> {order.paymentMethod}</p>
                  {order.shippingDetails?.city && (
                    <p><strong>Ship to:</strong> {order.shippingDetails.city}</p>
                  )}
                </div>
                <p><strong>Total:</strong> Rs {order.totalPrice}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
}

export default OrderHistory;
