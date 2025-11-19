import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProduct } from "../context/productContext";
import {
  ShoppingCart,
  Edit3,
  Star,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import ProductsList from "../components/ProductsList";

const ProductSingle = () => {
  const { id } = useParams();
  const { fetchSingleProduct, getRecomendations } = useProduct();
  const [product, setProduct] = useState(null);
  const [recomendations, setRecomendations] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      const [data, reco] = await Promise.all([
        fetchSingleProduct(id),
        getRecomendations(id),
      ]);
      setProduct(data);
      setRecomendations(reco);
    };
    loadProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
        <p className="mt-4 text-gray-600 font-medium">
          Loading product details...
        </p>
      </div>
    );
  }

  const originalPrice =
    product.discount > 0
      ? (product.price / (1 - product.discount / 100)).toFixed(2)
      : product.price;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div className="space-y-4">
              <div className="relative group overflow-hidden rounded-2xl bg-gray-100">
                <img
                  src={
                    product.image ||
                    "https://via.placeholder.com/600x600.png?text=No+Image"
                  }
                  alt={product.title}
                  className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {product.discount > 0 && (
                  <div className="absolute top-4 right-4 bg-linear-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                    {product.discount}% OFF
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                {[1, 2, 3, 4].map((idx) => (
                  <div
                    key={idx}
                    className={`w-20 h-20 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedImage === idx - 1
                        ? "border-blue-600 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={
                        product.image ||
                        `https://via.placeholder.com/100x100.png?text=${idx}`
                      }
                      alt={`Thumbnail ${idx}`}
                      className="w-full h-full object-cover rounded-lg"
                      onClick={() => setSelectedImage(idx - 1)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <div>
                {product.category && (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold mb-4">
                    <TrendingUp size={16} />
                    {product.category}
                  </div>
                )}

                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {product.title}
                </h1>

                <div className="flex items-center gap-2 mb-6">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={20}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm">
                    (4.8 - 127 reviews)
                  </span>
                </div>

                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  {product.description}
                </p>

                <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-5xl font-bold text-gray-900">
                      ₹{product.price}
                    </span>
                    {product.discount > 0 && (
                      <span className="text-2xl text-gray-400 line-through">
                        ₹{originalPrice}
                      </span>
                    )}
                  </div>
                  {product.discount > 0 && (
                    <p className="text-green-600 font-semibold text-lg">
                      You save ₹{(originalPrice - product.price).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <ShoppingCart size={22} />
                  Add to Cart
                </button>

                <Link
                  to={`/product/edit/${product.id}`}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-lg hover:border-gray-400 hover:bg-gray-50 transition-all"
                >
                  <Edit3 size={20} />
                  Edit
                </Link>
              </div>
            </div>
          </div>
        </div>

        {recomendations.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  You Might Also Like
                </h2>
                <p className="text-gray-600 mt-1">
                  Handpicked recommendations just for you
                </p>
              </div>
              <ArrowRight size={28} className="text-gray-400" />
            </div>

            <ProductsList products={recomendations} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSingle;
