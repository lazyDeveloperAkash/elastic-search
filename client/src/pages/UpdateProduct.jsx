import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../context/productContext";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchSingleProduct, updateProduct } = useProduct();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    discount: 0,
    image: "",
    category: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      const data = await fetchSingleProduct(id);
      if (data) setForm(data);
      setLoading(false);
    };
    loadProduct();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProduct(id, form);
    navigate(`/product/${id}`);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-blue-700">
        Loading product...
      </div>
    );

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-md mt-6">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">Edit Product</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {["title", "description", "price", "discount", "image", "category"].map(
          (field) => (
            <input
              key={field}
              name={field}
              value={form[field] || ""}
              onChange={handleChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
            />
          )
        )}

        <button
          type="submit"
          className="bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
