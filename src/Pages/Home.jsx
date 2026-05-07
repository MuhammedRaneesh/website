import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useState, useEffect } from "react";
import api from "../api/axios";
import { NavLink, Link } from "react-router-dom";
import "./Home.css"

function Home() {
  const [product, setProduct] = useState([]);

  useEffect(() => {
    api.get("/products")
      .then((res) => setProduct(res.data.products))
      .catch((error) => console.log("failled", error))
  }, []);

  return (
    <div>
      <Navbar />
      <div className="hero-section">

        <div className="background-container">
          <video autoPlay loop muted playsInline className="background-video">
            <source
              src="/coverr-sneakers-on-a-step-machine-6641-1080p.mp4"
              type="video/mp4"
            />
          </video>
          
        </div>

        <div className="hero-content">
          <div className="content-wrapper">
            <span className="eyebrow">STRIDE</span>
            <h1 className="headline">
              <span className="line">Step Into</span>
              <span className="line">Tomorrow</span>
            </h1>
            <p className="subheadline">
              Where innovation meets street culture. Discover the future of footwear.
            </p>
            <NavLink to={"/shop"} className="nav-bar">
              <div className="cta-group">
                <button className="cta-primary">
                  Explore Collection
                  <span className="arrow">→</span>
                </button>
              </div>
            </NavLink>
          </div>
        </div>
      </div>
      <div className="brand-sec">
        <div className="brand-conti">
          <h2 className="brand-heading">Our Philosophy</h2>

          <p className="brand-text">
            <span className="name">STRIDE</span> blends luxury with street energy.
            Crafted for those who move fast, think bold, and refuse limits.
            Every step is power. Every stride is identity.
          </p>
        </div>
      </div>
      <div className="product-sec">
        <div className="product-cont">
          <h2 className="product-titilr">LATEST DROPS</h2>

          <div className="product-show">
            {product.slice(-6).map((item) => (
              <div className="product-card" key={item._id}>
                <Link to={`/shop/${item._id}`} className="product-dir">
                  <img src={item.image} alt="item.name" />
                  <div className="product-info">
                    <h3>{item.brand}</h3>
                    <h3>{item.name}</h3>
                    <p>₹{item.price}</p>
                  </div>
                </Link>
              </div>
            ))}
            <NavLink to={"/shop"} className="view-bar">
              <div className="view-group">
                <button className="view-primary">
                  View All Collection →
                </button>
              </div>
            </NavLink>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;