import api from "../../api/axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./Edit.css";

function Edit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState({
    brand: "",
    name: "",
    category: "",
    price: "",
    sizes: [],
    description: "",
    image: "",
  });
  const [newImage, setNewImage] = useState(null);

  const Sizes = [6, 7, 8, 9, 10, 11, 12];

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data.product);
      })
      .catch((error) => {
        toast.error("Product not found");
        console.log(error);
        navigate("/adminpanel/products");
      });
  }, [id, navigate]);

  const handilChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0] || null);
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

    const formData = new FormData();
    formData.append("brand", product.brand);
    formData.append("name", product.name);
    formData.append("category", product.category);
    formData.append("price", product.price);
    formData.append("description", product.description);

    product.sizes.forEach((size) => {
      formData.append("sizes", size);
    });

    if (newImage) {
      formData.append("image", newImage);
    }

    try {
      await api.put(`/admin/products/${id}`, formData);
      toast.success("Updated successfully!");
      navigate("/adminpanel/products");
    } catch (error) {
      console.log(error);
      toast.error("Update failed.");
    }
  };

  return (
    <div className="edit-page">
      <div className="edit-card">
        <h2 className="edit-title">Edit Sneaker</h2>

        <form onSubmit={handilSubmit} className="edit-form">
          <div className="form-group">
            <label className="form-label">Current Image</label>
            {product.image && (
              <img
                src={newImage ? URL.createObjectURL(newImage) : product.image}
                alt={product.name}
                className="edit-preview-image"
              />
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Brand</label>
            <input
              className="form-input"
              type="text"
              name="brand"
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
              value={product.category}
              onChange={handilChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Price</label>
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
              value={product.description}
              onChange={handilChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Choose New Image</label>
            <input
              className="form-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <button type="submit" className="update-btn">
            Update Sneaker
          </button>
        </form>
      </div>
    </div>
  );
}

export default Edit;
