import { useState } from 'react';
import { useCart } from '../Context/CartContex';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './CheckOut.css';
import Navbar from "../components/common/Navbar"
import Footer from "../components/common/Footer"
import { toast } from 'react-toastify';
function CheckOut() {

  const { cart, subtotal, resetCart } = useCart();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
  });

  function HandileInput(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (payment === null) {
      toast.error("Please select a payment method");
      return;
    }
    if (!form.fullName || !form.email || !form.address || !form.phone || !form.city || !form.pincode) {
      toast.warn("Please fill all delivery address fields")
      return;
    }

    const orderData = {
      address: form,
      payment: payment,
    };

    try {
      await api.post("/order", orderData);

      toast.success("Order Placed Succesfully")
      resetCart();
      navigate('/');
    } catch (err) {
      console.error("Checkout Error:", err);
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.")
    }
  };

  return (
    <div>
      <Navbar />
      <div className="checkout">
        <div className="checkout-wrapper">


          <div className="checkout-form-section">
            <h2>Shipping Details</h2>

            <form onSubmit={handleSubmit}>

              <div className="input-row">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  required
                  onChange={HandileInput}
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  required
                  maxLength="10"
                  onChange={HandileInput}
                />
              </div>

              <div className="input-row">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  onChange={HandileInput}
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  required
                  onChange={HandileInput}
                />
              </div>

              <div className="input-row">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  required
                  onChange={HandileInput}
                />
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  required
                  onChange={HandileInput}
                />
              </div>

              <h3>Payment Method</h3>

              <div className="payment-group">
                <label>
                  <input type="radio" name="paymentMethod" onChange={() => setPayment("COD")} />
                  Cash on Delivery
                </label>

                <label>
                  <input type="radio" name="paymentMethod" onChange={() => setPayment("Google Pay")} />
                  Google Pay
                </label>

                <label>
                  <input type="radio" name="paymentMethod" onChange={() => setPayment("PhonePe")} />
                  PhonePe
                </label>
              </div>
              <button type="submit" className="btn">
                Place Order
              </button>
            </form>
          </div>

          <div className="checkout-summary">
            <h3>Order Summary</h3>

            {cart.map((item) => (
              <div key={item._id} className="summary-row">
                <span>{item.productId.name} × {item.quantity}</span>
                <span>₹{item.productId.price * item.quantity}</span>
              </div>
            ))}
            <div className="summary-total">
              <span>Total</span>
              <strong>₹{subtotal}</strong>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );

}

export default CheckOut;
