import React, { useState } from "react";
import swal from "sweetalert";
import { navigate } from "@reach/router";
import { Button, Form } from "react-bootstrap";
import { useMutation } from "react-query";
import { saveProducts } from "../api/api";
import "./css/navbar.css";

function Navbar() {
  const [state, setState] = useState(null);

  const [mutateSaveProducts, { status }] = useMutation(saveProducts);

  const saveProductsField = async (value) => {
    await mutateSaveProducts({ value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!state) {
      return swal("Error", "Select an excel file before submitting", "error");
    }
    saveProductsField(state);
  };

  const handleFilterChange = (event) => {
    event.preventDefault();
    const filterName = event.target.name;
    const filterValue = event.target.value;
    console.log('filter', filterName, filterValue)
    // setState(currentPath[0]);
  };

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    // if (!state) {
    //   return swal("Error", "Select an excel file before submitting", "error");
    // }
    // saveProductsField(state);
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
        <Button variant="link" className={"link"}>
          All
        </Button>
        <Button
          variant="link"
          className={"link"}
          onClick={() => {
            const linkId = "buy-request";
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
            navigate(`/${linkId}`, {
              state: { category: "sellRequests" },
            });
          }}
        >
          Sell Iphone
        </Button>
        <Button variant="link" className={"link"}>
          Ipad
        </Button>
        <Button variant="link" className={"link"}>
          Macbook
        </Button>
        <Button variant="link" className={"link"}>
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
              onChange={handleFilterChange}
              placeholder="Min"
            />
          </Form.Group>
          <p className="filter-divider">|</p>
          <Form.Group className={"form"}>
            <Form.Control
              type="text"
              name="max"
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
        <Form onSubmit={handleSubmit}>
          <Form.Group className={"form-group"}>
            <Form.File
              id="file"
              label=""
              className={"file"}
              onChange={handleChange}
            />
          </Form.Group>
          <Button type="submit" id={"button"}>
            Save
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Navbar;
