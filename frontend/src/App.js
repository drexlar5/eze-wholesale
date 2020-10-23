import React from "react";
import "./App.css";
import { Container, Row, Col } from "react-bootstrap";
import Header from "./components/header";
import Footer from "./components/footer";
import Main from "./components/main";
import Navbar from "./components/navbar";
import CustomRoute from "./utils/custom-route";

const App = CustomRoute((props) => {
  return (
    <Container fluid style={{ background: "#14161b" }}>
      <Header />
      <Row>
        <Col sm={3} className={"navbar-col"}>
          <Navbar />
        </Col>
        <Col sm={9}>
          <Main>{props.children}</Main>
        </Col>
      </Row>
      <Footer />
    </Container>
  );
});

export default App;
