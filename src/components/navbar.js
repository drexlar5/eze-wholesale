import React, { useState } from "react";
import swal from "sweetalert";
import { navigate } from "@reach/router";
import { Button, Form } from "react-bootstrap";
import { useMutation } from "react-query";
import { saveProducts, getProducts } from "../api/api";
import { useProducts } from "../context/context";
import "./css/navbar.css";


function Navbar() {
  const [state, setState] = useState(null);
  const [filter, setFilter] = useState(null);
  const pageNumber = 1;
  const { product: category, updateProductsCategory } = useProducts();
  
  const limit = 12;

  const [mutateSaveProducts, { status }] = useMutation(saveProducts);

  const saveProductsField = async (value) => {
    await mutateSaveProducts({ value });
  };

  const getProductsField = async (value) => {
    let data = await getProducts(
      "products",
      { page: pageNumber, limit },
      value,
      category
    );

    const linkId = category === "buyRequests" ? "buy-request" : "sell-request";

    setFilter(null);
    navigate(`/${linkId}`, {
      state: { category, data, query: value, pageNumber},
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!state) {
      return swal("Error", "Select an excel file before submitting", "error");
    }
    saveProductsField(state);
    event.target.reset();
    setState(null);
  };

  const handleFilterChange = (event) => {
    event.preventDefault();
    const filterName = event.target.name;
    const filterValue = event.target.value;
    setFilter({...filter, [filterName]: filterValue});
  };

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    if (!filter?.min || !filter?.max) {
      return swal("Error", "Enter a valid min and max value", "error");
    }
    getProductsField(filter);
  };

  const handleChange = (event) => {
    event.preventDefault();
    const currentPath = event.target.files;
    setState(currentPath[0]);
  };

  return (
    <div className={"navbar-div"}>
      <div className={"categories-div"}>
        <h2>Categories</h2>
        <Button variant="link" className={"link"} onClick={() => swal("Info", "Coming Soon", "info")}>
          All
        </Button>
        <Button
          variant="link"
          className={"link"}
          onClick={() => {
            const linkId = "buy-request";
            updateProductsCategory("buyRequests");
            navigate(`/${linkId}`, {
              state: { category: "buyRequests" },
            });
          }}
        >
          Buy Iphone
        </Button>
        <Button
          variant="link"
          className={"link"}
          onClick={() => {
            const linkId = "sell-request";
            updateProductsCategory("sellRequests");
            navigate(`/${linkId}`, {
              state: { category: "sellRequests" },
            });
          }}
        >
          Sell Iphone 
        </Button>
        <Button variant="link" className={"link"} onClick={() => swal("Info", "Coming Soon", "info")}>
          Ipad
        </Button>
        <Button variant="link" className={"link"} onClick={() => swal("Info", "Coming Soon", "info")}>
          Macbook
        </Button>
        <Button variant="link" className={"link"} onClick={() => swal("Info", "Coming Soon", "info")}>
          Airpods
        </Button>
      </div>
      <div className={"categories-div"}>
        <h2>Price Filter</h2>
        <Form onSubmit={handleFilterSubmit}>
          <Form.Group className={"form"}>
            <Form.Control
              type="text"
              name="min"
              value={filter?.min ? filter.min : ""}
              onChange={handleFilterChange}
              placeholder="Min"
            />
          </Form.Group>
          <p className="filter-divider">|</p>
          <Form.Group className={"form"}>
            <Form.Control
              type="text"
              name="max"
              value={filter?.max ? filter.max : ""}
              onChange={handleFilterChange}
              placeholder="Max"
            />
          </Form.Group>
          <Button type="submit" className={"button"}>
            Filter
          </Button>
        </Form>
      </div>
      <div className={"categories-div"}>
        <h2>Upload Excel File</h2>
        <Form onSubmit={handleSubmit} >
          <Form.Group className={"form-group"}>
            <Form.File
              id="file"
              label=""
              className={"file"}
              onChange={handleChange}
            />
          </Form.Group>
          <Button type="submit" id={"button"}>
            Load iPhones
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Navbar;
