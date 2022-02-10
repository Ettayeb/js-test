import React, { useState } from "react";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import Tree from "react-d3-tree";
import Helpers from "./Helpers";

function App() {
  const [personsNumber, setPersonsNumber] = useState();
  const [showError, setShowError] = useState(false);
  const [orgChart, setOrgChart] = useState();
  const [manipulator, setManipulator] = useState();

  const changePersonsNumber = (e) => {
    if (e.currentTarget.value >= 1 && e.currentTarget.value <= 1000) {
      setPersonsNumber(parseInt(e.currentTarget.value));
      setShowError(false);
    } else {
      setShowError(true);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    setManipulator();
    setOrgChart();

    const arrayOfN = Array.from(Array(personsNumber)).map((e, i) => i + 1);

    const fixedManipulator = Helpers.getFixedManipulator(arrayOfN);
    const list = Helpers.generateList(arrayOfN, fixedManipulator);

    const manipulatorResult = Helpers.getManipulator(
      arrayOfN,
      list,
      personsNumber
    );

    if (manipulatorResult === -1) {
      setManipulator(-1);
    } else {
      setManipulator(manipulatorResult.root);
      setOrgChart(manipulatorResult.dataTree);
    }
  };

  return (
    <Container className="pt-5" fluid>
      <Row>
        <Col className="mx-auto" md="4">
          <Form onSubmit={submit}>
            <Form.Group className="mb-3">
              <Form.Label>Entier n:</Form.Label>
              <Form.Control
                onChange={changePersonsNumber}
                type="text"
                placeholder="Entrer le nombre de personnes n"
              />
              {showError && (
                <Form.Text className="text-muted">1 >= n >= 1000</Form.Text>
              )}
            </Form.Group>

            <Button variant="primary" disabled={showError} type="submit">
              Envoyer
            </Button>
          </Form>
          <Row>
            <Col className="mx-auto" md="4">
              {manipulator === -1 && (
                <h4 className="text-danger">{manipulator}</h4>
              )}
              {manipulator !== -1 && (
                <h4 className="text-success">{manipulator}</h4>
              )}
            </Col>
          </Row>
        </Col>
      </Row>

      <Row>
        <Col className="mx-auto" md="8">
          {orgChart && (
            <div id="treeWrapper" style={{ width: "50em", height: "30em" }}>
              <Tree data={orgChart} />
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
