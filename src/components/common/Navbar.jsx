import { useState } from "react";
import api  from "../../api/axios";
import { NavLink, useNavigate } from "react-router-dom";
import { FaOpencart, FaUserCircle, FaChevronDown } from "react-icons/fa";
import "./Navbar.css";
import { useAuth } from "../../Context/AuthContext";
import { useCart } from "../../Context/CartContex";

function Navbar() {
    const { cart } = useCart();
    const navigate = useNavigate();
    const { authUser, logout } = useAuth();
    const [Dropdown, setDropdown] = useState(false);


    const handleLogout = async  () => {
        try {
            await api.delete("/auth/logout")
        } catch (error) {
            console.log(error.response?.data?.message || "Logout failed") ;
        }
        logout();
        setDropdown(false);
        navigate("/");
    };

    return (
        <nav className="navbar">
            <div className="logo-left" onClick={() => navigate("/")}>
                <h1 className="logo">STRIDE</h1>
            </div>

            <ul className="nav-menu">
                <li className="link">
                    <NavLink to="/">Home</NavLink>
                </li>
                <li className="link">
                    <NavLink to="/shop">Shop</NavLink>
                </li>
                <li className="link">
                    <NavLink to="/about">About</NavLink>
                </li>
                {authUser ? (
                    <li className="link">
                        <NavLink to="/order">My order</NavLink>
                    </li>
                ): ""}
            </ul>

            <div className="nav-right">
                <NavLink to="/cart" className="cart-wrapper">
                    <FaOpencart className="nav-icon" />
                    {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
                </NavLink>

                {authUser ? (
                    <div className="profile-container">
                        <div
                            className="profile-trigger"
                            onClick={() => setDropdown(!Dropdown)}
                        >
                            <FaUserCircle className="nav-icon" />
                            <span className="profile-text">{authUser.name}</span>

                            <FaChevronDown className={`arrow-icon ${Dropdown ? 'rotate' : ''}`} />
                        </div>

                        {Dropdown && (
                            <div className="dropdown-menu">
                                <div className="dropdown-item">
                                    <h3>{authUser.name}</h3>
                                    <p>{authUser.email}</p>
                                </div>
                                <div className="dropdown-item logout" onClick={handleLogout}>
                                    Logout
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <button onClick={() => navigate("/login")} className="login-btn">
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;