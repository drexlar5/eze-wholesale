import React, { useState } from "react";
import swal from "sweetalert";
import { navigate } from "@reach/router";
import { Col, Row, Form, Button } from "react-bootstrap";
import { useProducts } from "../context/context";
import { getProducts } from "../api/api";
import "./css/header.css";

function Header() {
  const [state, setState] = useState(null);
  const { product: category } = useProducts();
  const pageNumber = 1;

  const limit = 12;

  const searchProductsField = async (value) => {
    let data = await getProducts(
      "products",
      { page: pageNumber, limit },
      value,
      category
    );

    const linkId = category === "buyRequests" ? "buy-request" : "sell-request";

    navigate(`/${linkId}`, {
      state: { category, data, query: value, pageNumber },
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!state) {
      return swal("Error", "Enter a search word", "error");
    }
    searchProductsField(state);
    setState(null);
  };

  const handleChange = (event) => {
    event.preventDefault();
    const searchValue = event.target.value;
    setState(searchValue);
  };

  return (
    <div style={{ height: "auto", width: "100%", background: "#14161b" }}>
      <Row>
        <Col sm={6} style={{ padding: "2rem" }}>
          <h1 className={"heading"}>
            SHOP OUR LATEST <br /> AVAILABLE STOCK HERE
          </h1>
          <Form onSubmit={handleSubmit} className={"form"}>
            <Form.Group className={"form-group"}>
              <Form.Control
                type="text"
                placeholder="Enter Search Term (eg. iPhone x or 128gb)"
                value={state != null ? `${state}` : ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className={"search-button"}>
              Search
            </Button>
          </Form>
        </Col>
        <Col sm={6} className={"header-image-column"}>
          <img src={"assets/header.png"} className={"header-img"} alt="" />
        </Col>
      </Row>
    </div>
  );
}

export default Header;
