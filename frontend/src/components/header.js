import React, { useState } from "react";
import swal from "sweetalert";
import { navigate } from "@reach/router";
import { Col, Row, Form, Button } from "react-bootstrap";
import { searchProducts } from "../api/api";
import "./css/header.css";

function Header() {
  const [state, setState] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [category, setCategory] = useState(null);
  const page = pageNumber + 1;
  const limit = 12;

  const searchProductsField = async (value) => {
    let data = await searchProducts(
      "products",
      { page: pageNumber, limit },
      value,
      category
    );

    const linkId = "buy-request";

    navigate(`/${linkId}`, {
      state: { category: "buyRequests", data, query: value, pageNumber: 1 },
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!state) {
      return swal("Error", "Enter a search word", "error");
    }
    searchProductsField(state);
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
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className={"search-button"}>
              Search
            </Button>
          </Form>
        </Col>
        <Col sm={6} className={"header-image-column"}>
          <img src={"assets/header.png"} className={"header-img"} />
        </Col>
      </Row>
    </div>
  );
}

export default Header;
