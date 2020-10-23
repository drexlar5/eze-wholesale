import React, { useState } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { Row, Pagination } from "react-bootstrap";
import { useQueryCache, usePaginatedQuery } from "react-query";

import { getProducts, searchProducts } from "../api/api";
import "./css/main.css";

function Main({ children }) {
  const { state } = children?.props?.location;

  const [pageNumber, setPageNumber] = useState(1);
  const [category, setCategory] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const page = pageNumber + 1;
  const limit = 12;

  const queryCache = useQueryCache();
  let { resolvedData, latestData, status } = usePaginatedQuery(
    ["products", { page: pageNumber, limit }, searchData, category],
    searchData ? searchProducts : getProducts
  );

  React.useEffect(() => {
    setCategory(state?.category);
    if (state?.data) {
      setSearchData(state.query);
      resolvedData = state.data;
    }
    console.log("page", pageNumber, state, resolvedData);
    if (latestData?.data.pages !== pageNumber) {
      if (state.query) {
        queryCache.prefetchQuery(
          ["products", { page, limit }, state.query, category],
          searchProducts
        );
      } else {
        setSearchData(null);
        queryCache.prefetchQuery(
          ["products", { page, limit }, category],
          getProducts
        );
      }
    }
    // eslint-disable-line react-hooks/exhaustive-deps
  }, [latestData, getProducts, pageNumber, state]);

  const renderPaginationButton = () => {
    const buttons = [];
    const pageCount =
      resolvedData?.data.pages > 5 ? 5 : resolvedData?.data.pages;
    for (let i = 1; i <= pageCount; i++) {
      buttons.push(
        <Pagination.Item
          key={i}
          onClick={() => {
            setSearchData(null);
            return setPageNumber(i);
          }}
          disabled={pageNumber === i}
          active={pageNumber === i}
        >
          {i}
        </Pagination.Item>
      );
    }
    return buttons;
  };

  const formatImageName = (name) => name.toLowerCase().split(" ").join("_");

  const dataObj = (data) => (
    <Card className={"card"}>
      <h5>
        <Badge variant="dark" className={"badge"}>
          {data.condition}
        </Badge>
      </h5>
      <Card.Img
        variant="top"
        src={`assets/${formatImageName(data.deviceName)}.png`}
      />
      <Card.Body>
        <Card.Title className={"title"}>{data.deviceName}</Card.Title>
        <Card.Text className={"text"}>Unlocked | {data.storageSize}</Card.Text>
        <Card.Text style={{ marginBottom: 0, color: "white" }}>
          Unit Price
        </Card.Text>
        <Card.Text className={"price"}>${data.price}</Card.Text>
        <Card.Text className={"text"}>1500 Available</Card.Text>
        <div className={"button-div"}>
          <Button variant="primary" className={"button"}>
            {state?.category === "buyRequests" ? "Buy" : "Sell"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <>
      <Row className={"card-row"}>
        {resolvedData?.data &&
          resolvedData.data.paginatedData.map((data) => dataObj(data))}
      </Row>
      <div className={"pagination"}>
        <Pagination>
          <Pagination.First />
          <Pagination.Prev
            onClick={() => setPageNumber((old) => Math.max(old - 1, 0))}
            disabled={pageNumber === 1}
          />
          {resolvedData && renderPaginationButton()}
          {/* <Pagination.Ellipsis /> */}
          <Pagination.Next
            onClick={() =>
              // Here, we use `latestData` so the Next Page
              // button isn't relying on potentially old data
              setPageNumber((old) =>
                !latestData || latestData?.pages === pageNumber ? old : old + 1
              )
            }
            disabled={!latestData || latestData?.pages === pageNumber}
          />
          <Pagination.Last />
        </Pagination>
      </div>
    </>
  );
}

export default Main;
