import api from "../api/axios"
import Navbar from "../components/common/Navbar"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import "./Shop.css"
import Footer from "../components/common/Footer"

function Shop() {
  const [filter, setFilter] = useState([])
  const [activeBrand, setActiveBrand] = useState("ALL")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const limit = 12

  const handleBrand = (brand) => {
    setActiveBrand(brand)
    setPage(1)
  }
  useEffect(() => {
    let url = `/products?page=${page}&limit=${limit}`

    if (search.trim()) {
      url = `/products?keyword=${encodeURIComponent(search.trim())}&page=${page}&limit=${limit}`
    } else if (activeBrand !== "ALL") {
      url = `/products?brand=${encodeURIComponent(activeBrand)}&page=${page}&limit=${limit}`
    }
    api.get(url)
      .then((responce) => {
        setFilter(responce.data.products)
        setPagination(responce.data.pagination)
      })
      .catch((err) => {
        console.log(err)
        toast.error("failed")
      })

  }, [search, activeBrand, page])


  return (
    <>
      <Navbar />
      <div className="page-shop">

        <div className="filter-header">
          <div className="brand-filter">
            {["ALL", "Nike", "Adidas", "Puma", "New Balance"].map((b) => (
              <button
                key={b}
                className={activeBrand === b ? "active" : ""}
                onClick={() => handleBrand(b)}
              >
                {b}
              </button>
            ))}
            <div className="search-box">
              <input
                type="text"
                value={search}
                placeholder="Search products..."
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
              />
            </div>
          </div>
        </div>
        <hr />

        <div className="products-container">
          {filter.length > 0 ? (
            filter.map((item) => (
              <div key={item._id} className="product-card">
                <img src={item.image} alt={item.name} width="100" />
                <h3>{item.name}</h3>
                <p className="price">₹{item.price}</p>
                <p>Brand: {item.brand}</p>
                <Link to={`/shop/${item._id}`}>View Details</Link>
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="pagination-controls">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </button>
            <span>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              disabled={page === pagination.totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default Shop
