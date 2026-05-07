import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Shop from "./Pages/Shop";
import Login from "./Pages/Auth/Login"
import Signup from "./Pages/Auth/Signup"
import ProductDetails from "./Pages/ProductDetails";
import CartPage from "./Pages/Cart"
import ProtectedRoute from "./components/ProtectedRoute";
import CheckOut from "./Pages/CheckOut";
import OrderPage from "./Pages/OrderPage";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminLayout from "./Pages/Admin/AdminLayout";
import AdminOrders from "./Pages/Admin/AdminOrders";
import AdminUsers from "./Pages/Admin/AdminUsers";
import AdminProducts from "./Pages/Admin/AdminProducts";
import AdminLogin from "./Pages/Admin/AdminLogin";
import Error from "./Pages/Error";
import Edit from "./Pages/Admin/Edit";
import AddProduct from "./Pages/Admin/AddProduct";
import About from "./Pages/About";
function AppRoutes() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/shop/:id" element={<ProductDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Register" element={<Signup />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<Error />} />
      <Route
        path="/order"
        element={
          <ProtectedRoute>
            <OrderPage />
          </ProtectedRoute>
        }
      />
      <Route path="/cart" element={
        <ProtectedRoute >
          <CartPage />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/adminpanel" element={
        <ProtectedRoute adminOnly={true}>
          <AdminLayout />
        </ProtectedRoute>
      } >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="editproduct/:id" element={<Edit />} />
        <Route path="Addproduct" element={<AddProduct />} />
      </Route>
      <Route path="/checkout" element={
        <ProtectedRoute>
          <CheckOut />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default AppRoutes;
