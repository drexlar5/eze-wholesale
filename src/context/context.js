import React, {useState} from "react";

const ProductsContext = React.createContext();
const useProducts = () => React.useContext(ProductsContext);

const ProductsProvider = (props) => {
    const [product, setProducts] = useState("buyRequests");

    const updateProductsCategory = (value) => {
        setProducts(value);
    }

  return <ProductsContext.Provider value={{ product, updateProductsCategory }} {...props} />;
};

export { useProducts, ProductsProvider };