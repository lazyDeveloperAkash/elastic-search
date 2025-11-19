import React, { useState } from "react";
import { useProduct } from "../context/productContext";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const { createProduct } = useProduct();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    discount: "",
    image: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await createProduct(form);
    setForm({
      title: "",
      description: "",
      price: "",
      discount: "",
      image: "",
      category: "",
    });
    setLoading(false);
    navigate("/");
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-md mt-6">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">Add New Product</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Product Title"
          required
          className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          required
          className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
        />

        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          required
          className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
        />

        <input
          name="discount"
          type="number"
          value={form.discount}
          onChange={handleChange}
          placeholder="Discount (%)"
          className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
        />

        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
        />

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition"
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
