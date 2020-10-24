import React from "react";
import "./App.css";
import { Container, Row, Col } from "react-bootstrap";
import Header from "./components/header";
import Main from "./components/main";
import Navbar from "./components/navbar";
import CustomRoute from "./utils/custom-route";

const App = CustomRoute((props) => {
  return (
    <Container fluid className={"app-container"}>
      <Header />
      <Row>
        <Col sm={3} className={"navbar-col"}>
          <Navbar />
        </Col>
        <Col sm={9}>
          <Main>{props.children}</Main>
        </Col>
      </Row>
    </Container>
  );
});

export default App;
