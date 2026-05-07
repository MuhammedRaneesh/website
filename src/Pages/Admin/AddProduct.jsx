import api from "../../api/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Add.css";

function AddProduct() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    brand: "",
    name: "",
    category: "",
    price: "",
    sizes: [],
    description: "",
    image: null,
  });

  const Sizes = [6, 7, 8, 9, 10, 11, 12];

  const handilChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setProduct({
      ...product,
      image: e.target.files[0] || null,
    });
  };

  const toggleSize = (size) => {
    let newSizes = [...product.sizes];

    if (newSizes.includes(size)) {
      newSizes = newSizes.filter((s) => s !== size);
    } else {
      newSizes.push(size);
    }

    setProduct({
      ...product,
      sizes: newSizes,
    });
  };

  const handilSubmit = async (e) => {
    e.preventDefault();

    if (
      !product.brand ||
      !product.name ||
      !product.category ||
      !product.price ||
      !product.description ||
      !product.image ||
      product.sizes.length === 0
    ) {
      return toast.error("Please fill in all required fields");
    }

    const formData = new FormData();
    formData.append("brand", product.brand);
    formData.append("name", product.name);
    formData.append("category", product.category);
    formData.append("price", product.price);
    formData.append("description", product.description);
    formData.append("image", product.image);

    product.sizes.forEach((size) => {
      formData.append("sizes", size);
    });

    try {
      await api.post("/admin/products", formData);
      toast.success("Product added successfully!");
      navigate("/adminpanel/products");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to add product.");
    }
  };

  return (
    <div className="edit-page">
      <div className="edit-card">
        <h2 className="edit-title">Add New Sneaker</h2>

        <form onSubmit={handilSubmit} className="edit-form">
          <div className="form-group">
            <label className="form-label">Brand</label>
            <input
              className="form-input"
              type="text"
              name="brand"
              placeholder="e.g. Nike"
              value={product.brand}
              onChange={handilChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              className="form-input"
              type="text"
              name="name"
              placeholder="e.g. Air Jordan 1"
              value={product.name}
              onChange={handilChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <input
              className="form-input"
              type="text"
              name="category"
              placeholder="e.g. Basketball"
              value={product.category}
              onChange={handilChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Price (Rs.)</label>
            <input
              className="form-input"
              type="number"
              name="price"
              value={product.price}
              onChange={handilChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Available Sizes</label>
            <div className="sizes-container">
              {Sizes.map((size) => (
                <label key={size} className="size-item">
                  <input
                    type="checkbox"
                    className="size-checkbox"
                    checked={product.sizes.includes(size)}
                    onChange={() => toggleSize(size)}
                  />
                  <span className="size-label">{size}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              name="description"
              placeholder="Write something about this sneaker..."
              value={product.description}
              onChange={handilChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Choose Image</label>
            <input
              className="form-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <button type="submit" className="update-btn">
            Add Product to Store
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
