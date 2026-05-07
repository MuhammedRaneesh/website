import { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import "./Order.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingOrderId, setSavingOrderId] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    limit: 12,
  });

  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get(`/admin/orders?page=${page}&limit=12`);
      setOrders(res.data.orders || []);
      setPagination(
        res.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalOrders: 0,
          limit: 12,
        }
      );
    } catch (error) {
      console.log("order error", error);
      setError("Could not load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const handleStatus = async (id, currentStatus) => {
    setSavingOrderId(id);

    try {
      const res = await api.patch(`/admin/orders/${id}`, {
        status: currentStatus,
      });

      setOrders((prev) =>
        prev.map((ord) =>
          ord._id === id ? { ...ord, status: res.data.order.status } : ord
        )
      );
      toast.success("Order status updated successfully.");
    } catch (error) {
      console.log("failled", error);
      toast.error(error.response?.data?.message || "Failed to update order status.");
    } finally {
      setSavingOrderId("");
    }
  };

  if (loading) {
    return <div className="orders-feedback">Loading orders...</div>;
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="orders-feedback orders-feedback-error">
          <p>{error}</p>
          <button
            className="page-btn"
            onClick={fetchOrders}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h2 className="orders-title">Order Management</h2>
      </div>

      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr className="orders-table-head">
              <th>Order ID</th>
              <th>Customer</th>
              <th>Contact</th>
              <th>City</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr className="orders-row" key={order._id}>
                  <td className="orders-cell order-id-cell">
                    <span className="order-id-text">#{order.orderId}</span>
                  </td>
                  <td className="orders-cell">
                    <div className="customer-block">
                      <strong>{order.shippingDetails?.fullName || "-"}</strong>
                      <span>{order.userId?.email || "No email available"}</span>
                    </div>
                  </td>
                  <td className="orders-cell">
                    {order.shippingDetails?.phone || "-"}
                  </td>
                  <td className="orders-cell">
                    {order.shippingDetails?.city || "-"}
                  </td>
                  <td className="orders-cell total-amount">
                    Rs {order.totalPrice}
                  </td>
                  <td className="orders-cell payment-method">
                    {order.paymentMethod}
                  </td>

                  <td className="orders-cell">
                    <select
                      className={`status-select status-${order.status.toLowerCase()}`}
                      value={order.status}
                      onChange={(e) => handleStatus(order._id, e.target.value)}
                      disabled={savingOrderId === order._id}
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="orders-cell order-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
                
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data-cell">
                  <div className="empty-state">
                    <p>
                      No orders found.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="orders-meta">
        <p className="orders-summary">
          Showing {orders.length} orders on page {pagination.currentPage}. Total
          orders: {pagination.totalOrders}
        </p>

        <div className="pagination-actions">
          <button
            className="page-btn"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="pagination-text">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            className="page-btn"
            onClick={() =>
              setPage((prev) => Math.min(prev + 1, pagination.totalPages))
            }
            disabled={page === pagination.totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;
