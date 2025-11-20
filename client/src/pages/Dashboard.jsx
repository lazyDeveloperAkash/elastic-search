import { useEffect } from "react";
import { useProduct } from "../context/productContext";
import ProductList from "../components/ProductsList";
import SearchBar from "../components/SearchBar";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { fetchProducts, products } = useProduct();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2
            onClick={fetchProducts}
            className="text-3xl font-bold text-blue-700 mb-6 text-center cursor-pointer"
          >
            Search Products
          </h2>
          <button
            onClick={() => navigate("/product/create")}
            className="p-2 bg-blue-700 rounded-lg text-white cursor-pointer"
          >
            Create Product
          </button>
        </div>
        <SearchBar />
        <ProductList products={products} />
      </div>
    </div>
  );
};

export default Dashboard;
