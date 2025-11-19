import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/product");
      setProducts(data?.data);
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleProduct = async (id) => {
    try {
      const { data } = await axios.get(`http://localhost:8080/product/${id}`);
      return data.data;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData) => {
    try {
      const { data } = await axios.post(
        `http://localhost:8080/product`,
        productData
      );

      return data?.data;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const { data } = await axios.put(
        `http://localhost:8080/product/${id}`,
        productData
      );
      setProducts(
        products.map((pro) => (pro.id === data?.data?.id ? data?.data : pro))
      );
      return data?.data;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:8080/product/${id}`
      );
      setProducts(products.filter((pro) => pro.id !== data?.data?.id));
      return data?.data;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fuzzySearch = async (input) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:8080/product/search/${input}`
      );
      console.log(data);
      setProducts(data?.data);
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const getRecomendations = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:8080/product/recommend/${id}`
      );
      return data?.data;
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        fetchProducts,
        fetchSingleProduct,
        createProduct,
        updateProduct,
        deleteProduct,
        fuzzySearch,
        getRecomendations,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
