import React from 'react';
import {Row, Col, Card, Form, Button} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";

class FormsElements extends React.Component {

    render() {

        return (
            <Aux>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h5">Fill the form to apply for contract</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <h6>Fill the form Only Once, we will notify results via mail</h6>
                                <hr/>
                                <Row>
                                    <Col md={6}>
                                        <Form>
                                            <Form.Group controlId="formBasicEmail">
                                                <Form.Label>Email address</Form.Label>
                                                <Form.Control type="email" placeholder="Enter email" />
                                                <Form.Text className="text-muted">
                                                    We'll never share your email with anyone else.
                                                </Form.Text>
                                            </Form.Group>

                                            <Form.Group controlId="formBasicPassword">
                                                <Form.Label>Company Name</Form.Label>
                                                <Form.Control type="password" placeholder="Company Name" />
                                            </Form.Group>
                                            <Form.Group controlId="formBasicChecbox">
                                                <Form.Check type="checkbox" label="Check me out" />
                                            </Form.Group>
                                            <Button variant="primary">
                                                Submit
                                            </Button>
                                        </Form>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="exampleForm.ControlInput1">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control type="email" placeholder="Name" />
                                        </Form.Group>
                                        <Form.Group controlId="exampleForm.ControlSelect1">
                                            <Form.Label>Select Domain</Form.Label>
                                            <Form.Control as="select">
                                                <option>Fire Alarm System</option>
                                                <option>Water System</option>
                                                <option>Basic Construction</option>
                                                <option>Wooden work</option>
                                                <option>Electricity Work</option>
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group controlId="exampleForm.ControlTextarea1">
                                            <Form.Label>Tell us about your previous work</Form.Label>
                                            <Form.Control as="textarea" rows="3" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Aux>
        );
    }
}

export default FormsElements;
