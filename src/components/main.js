import React, { useState } from "react";
import swal from "sweetalert";
import { Card, Button, Badge } from "react-bootstrap";
import { Row, Pagination } from "react-bootstrap";
import { useQueryCache, usePaginatedQuery } from "react-query";

import { getProducts } from "../api/api";
import "./css/main.css";

function Main({ children }) {
  const { state } = children?.props?.location;

  const [pageNumber, setPageNumber] = useState(1);
  const [category, setCategory] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const page = pageNumber + 1;
  const limit = 12;

  const queryCache = useQueryCache();
  let { resolvedData, latestData } = usePaginatedQuery(
    ["products", { page: pageNumber, limit }, searchData, category],
    getProducts
  );

  React.useEffect(() => {
    setCategory(state?.category);

    if (state?.data) {
      setSearchData(state?.query);
      setPageNumber(state?.pageNumber);
      resolvedData = state.data;
      state.data = null;
    }

    if (latestData?.data.pages !== pageNumber) {
      if (!state?.query) {
        setSearchData(null);
      }
      queryCache.prefetchQuery(
        ["products", { page, limit }, null, category],
        getProducts
      );
    }
    // eslint-disable-line react-hooks/exhaustive-deps
  }, [latestData, getProducts, pageNumber, state]);

  const renderPaginationButton = () => {
    const lastPage = resolvedData?.data.pages;
    let delta = 2,
      left = pageNumber - delta,
      right = pageNumber + delta + 1,
      range = [],
      buttons = [],
      l;

    for (let i = 1; i <= lastPage; i++) {
      if (i === 1 || i === lastPage || (i >= left && i < right)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 0) {
          buttons.push(l + 1);
        } else if (i - l !== 1) {
          buttons.push(<Pagination.Ellipsis />);
        }
      }
      buttons.push(
        <Pagination.Item
          key={i}
          onClick={() => {
            return setPageNumber(i);
          }}
          disabled={pageNumber === i}
          active={pageNumber === i}
        >
          {i}
        </Pagination.Item>
      );
      l = i;
    }
    return buttons;
  };

  const capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const formatImageName = (name) => name.toLowerCase().split(" ").join("_");

  const formatDeviceName = (name) => {
    let nameArray = name.split(" ");

    return nameArray
      .map((item, index) => {
        if (index === 0 && item.includes("iphone")) {
          return (item = "iPhone");
        }

        if (index === 1) {
          return item.toUpperCase();
        }

        return capitalize(item);
      })
      .join(" ");
  };

  const dataObj = (data, index) => (
    <Card className={"card"} key={index}>
      <h5>
        <Badge variant="dark" className={"badge"}>
          {data.condition === "new"
            ? capitalize(data.condition)
            : data.condition.toUpperCase()}
        </Badge>
      </h5>
      <Card.Img
        variant="top"
        src={`assets/${formatImageName(data.deviceName)}.png`}
      />
      <Card.Body>
        <Card.Title className={"title"}>
          {formatDeviceName(data.deviceName)}
        </Card.Title>
        <Card.Text className={"text"}>
          Unlocked | {data.storageSize.toUpperCase()}
        </Card.Text>
        <Card.Text style={{ marginBottom: 0, color: "white" }}>
          Unit Price
        </Card.Text>
        <Card.Text className={"price"}>${data.price}</Card.Text>
        <Card.Text className={"text"}>1500 Available</Card.Text>
        <div className={"button-div"}>
          <Button
            variant="primary"
            className={"button"}
            onClick={() => swal("Success", "Item Added to Cart", "success")}
          >
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
          resolvedData?.data?.paginatedData?.map((data, index) =>
            dataObj(data, index)
          )}
      </Row>
      <div className={"pagination"}>
        {resolvedData?.data.pages < 1 ? (
          <div className="spinner-div">
            <h2>No data to  Display </h2>
          </div>
        ) : (
          <Pagination>
            <Pagination.First
              onClick={() => setPageNumber(1)}
              disabled={pageNumber === 1}
            />
            <Pagination.Prev
              onClick={() => setPageNumber((old) => Math.max(old - 1, 0))}
              disabled={pageNumber === 1}
            />
            {renderPaginationButton()}
            <Pagination.Next
              onClick={() =>
                setPageNumber((old) =>
                  !latestData || resolvedData?.data.pages === pageNumber
                    ? old
                    : old + 1
                )
              }
              disabled={
                !resolvedData || resolvedData?.data.pages === pageNumber
              }
            />
            <Pagination.Last
              onClick={() => setPageNumber(resolvedData?.data.pages)}
              disabled={
                !resolvedData || resolvedData?.data.pages === pageNumber
              }
            />
          </Pagination>
        )}
      </div>
    </>
  );
}

export default Main;
