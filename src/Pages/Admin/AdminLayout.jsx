import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import {
  LayoutGrid,
  Users,
  ShoppingBag,
  Package,
  LogOut,
} from 'lucide-react';
import "./Layout.css"
import api from '../../api/axios';
function AdminLayout() {
  const { logout } = useAuth();


  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    try {
      await api.delete(`/auth/logout`)
    } catch (error) {
      console.log(error)
    }
    logout();
  };

  return (
    <div className="admin-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">S</div>
          <h1 className="brand-name">STRIDE</h1>
        </div>

        <div className="sidebar-nav">
          <NavLink to="/adminpanel/dashboard" className="nav-link">
            <LayoutGrid size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/adminpanel/users" className="nav-link">
            <Users size={20} />
            <span>Users</span>
          </NavLink>

          <NavLink to="/adminpanel/orders" className="nav-link">
            <ShoppingBag size={20} />
            <span>Orders</span>
          </NavLink>

          <NavLink to="/adminpanel/products" className="nav-link">
            <Package size={20} />
            <span>Products</span>
          </NavLink>
        </div>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
      <div className='admin-content'>
        <Outlet />
      </div>

    </div>
  );
}

export default AdminLayout;