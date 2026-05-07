import api from "../../api/axios"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import "./Products.css"

function AdminProducts() {
  const [product, setProduct] = useState([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 12,
  })

  const navigate = useNavigate()

  useEffect(() => {
    api.get(`/admin/products?keyword=${search}&page=${page}&limit=12`)
      .then((res) => {
        setProduct(res.data.products)
        setPagination(res.data.pagination)
      })
      .catch((error) => {
        console.log("fetch failed", error)
        toast.error("Could not load products.")
      })
  }, [search, page])

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/admin/products/${id}`)
        if (product.length === 1 && page > 1) {
          setPage((prev) => prev - 1)
        } else {
          setProduct((prev) => prev.filter((item) => item._id !== id))
          setPagination((prev) => ({
            ...prev,
            totalProducts: Math.max(prev.totalProducts - 1, 0),
          }))
        }
        toast.success("Product deleted successfully!")
      } catch (error) {
        console.log("delete failed", error)
        toast.error("Could not delete product. Please try again.")
      }
    }
  }

  return (
    <div className="admin-products-page">
      <div className="admin-products-header">
        <h2 className="admin-products-title">Manage Products</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by product name..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <button
          className="add-product-btn"
          onClick={() => navigate("/adminpanel/addproduct")}
        >
          Add Product
        </button>
      </div>

      <div className="admin-products-grid">
        {product.map((item) => (
          <div key={item._id} className="admin-product-card">
            <div className="product-image-wrapper">
              <img
                src={item.image}
                alt={item.name}
                className="product-image"
              />
            </div>

            <div className="product-info">
              <h3 className="product-name">{item.name}</h3>
              <p className="product-price">Rs. {item.price}</p>
              <p className="product-brand"> Brand: <span>{item.brand}</span></p>
            </div>

            <div className="product-actions">
              <button
                className="edit-btn"
                onClick={() => navigate(`/adminpanel/editproduct/${item._id}`)}
              >
                Edit
              </button>

              <button
                className="delete-btn-edit"
                onClick={() => deleteProduct(item._id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination-bar">
        <p className="pagination-summary">
          Page {pagination.currentPage} of {pagination.totalPages}
        </p>

        <div className="pagination-actions">
          <button
            className="page-btn"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>

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
  )
}

export default AdminProducts
