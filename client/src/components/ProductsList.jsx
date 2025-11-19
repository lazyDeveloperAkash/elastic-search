import { useNavigate } from "react-router-dom";
import { useProduct } from "../context/productContext";
import ProductSkeleton from "./ProductSkeleton";

const ProductsList = ({ products }) => {
  const { loading } = useProduct();
  const navigate = useNavigate();

  if (loading) {
    return <ProductSkeleton />;
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-gray-500">
        No products available.
      </div>
    );
  }

  if (!loading && products.length === 0)
    <div className="text-center text-gray-500 mt-6">
      No products found matching “{searchTerm}”.
    </div>;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          onClick={() => navigate(`/product/${product.id}`)}
          className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2"
        >
          <div className="relative overflow-hidden">
            <img
              src={
                product.image ||
                "https://via.placeholder.com/400x300.png?text=No+Image"
              }
              alt={product.title}
              className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {product.discount > 0 && (
              <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                -{product.discount}%
              </div>
            )}
          </div>

          <div className="p-5">
            {product.category && (
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                {product.category}
              </span>
            )}

            <h3 className="text-lg font-bold text-gray-900 mt-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {product.title}
            </h3>

            <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{product.price}
                </p>
                {product.discount > 0 && (
                  <p className="text-sm text-green-600 font-semibold">
                    {product.discount}% off
                  </p>
                )}
              </div>

              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium group-hover:shadow-lg">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsList;
