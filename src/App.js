import React from "react";
import "./App.css";
import { Row, Col } from "react-bootstrap";
import Header from "./components/header";
import Main from "./components/main";
import Navbar from "./components/navbar";
import CustomRoute from "./utils/custom-route";

const App = CustomRoute((props) => {
  return (
    <div  className={"app-container"}>
      <Header />
      <Row>
        <Col sm={3} className={"navbar-col"}>
          <Navbar />
        </Col>
        <Col sm={9}>
          <Main>{props.children}</Main>
        </Col>
      </Row>
    </div>
  );
});

export default App;
