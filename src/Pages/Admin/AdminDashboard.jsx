import { useEffect, useState } from "react";
import api from "../../api/axios";
import "./AdminDasbord.css";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState({
    totalRevenue: 0,
    activeUsers: 0,
    totalProducts: 0,
    orders: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/admin/dashboard");
        setDashboard(res.data.dashboard);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="admin-dashboard">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="admin-dashboard">{error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Revenue</h4>
          <p className="stat-value">
            Rs {Number(dashboard.totalRevenue || 0).toLocaleString()}
          </p>
        </div>

        <div className="stat-card">
          <h4>Active Users</h4>
          <p className="stat-value">{dashboard.activeUsers}</p>
        </div>

        <div className="stat-card">
          <h4>Total Products</h4>
          <p className="stat-value">{dashboard.totalProducts}</p>
        </div>

        <div className="stat-card">
          <h4>Orders</h4>
          <p className="stat-value">{dashboard.orders}</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="recent-orders-container">
          <h3>Last 5 Orders</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Payment</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.recentOrders.length > 0 ? (
                dashboard.recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.orderId}</td>
                    <td>
                      <strong>
                        {order.shippingDetails?.fullName ||
                          order.userId?.username ||
                          "Unknown"}
                      </strong>
                      <br />
                      <small>
                        {order.shippingDetails?.city || order.userId?.email || "-"}
                      </small>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.paymentMethod}</td>
                    <td>Rs {Number(order.totalPrice || 0).toLocaleString()}</td>
                    <td>
                      <span
                        className={`status-pill ${order.status.toLowerCase()}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No recent orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
