// @flow

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route } from 'react-router-dom';
import { HeaderCard, Card, Alert, Form, Row, Column, Button } from './widgets';
import nameService, { type Name } from './name-service';
import { createHashHistory } from 'history';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully adding a name

class Header extends Component {
  render() {
    return (
      <div className="headerElement">
        <HeaderCard title="Covid-19 contact tracing"></HeaderCard>
      </div>
    );
  }
}
class RegisterName extends Component {
  name = '';
  phone = '';

  render() {
    return (
      <div className="register">
        <Card title="Register visit">
          <Row className="nameRow">
            <Column width={5}>
              <Form.Label>Name:</Form.Label>
            </Column>
            <Column width={10}>
              <Form.Input
                type="text"
                value={this.name}
                onChange={(event) => (this.name = event.currentTarget.value)}
                placeholder="Insert your name here"
              />
            </Column>
          </Row>
          <Row className="phoneRow">
            <Column width={5}>
              <Form.Label>Phone number:</Form.Label>
            </Column>
            <Column width={10}>
              <Form.Input
                type="text"
                value={this.phone}
                onChange={(event) => (this.phone = event.currentTarget.value)}
                placeholder="Insert your phone number here"
              />
            </Column>
          </Row>
          <Button.Success
            onClick={() => {
              nameService
                .create(this.name, this.phone)
                .then(() => history.push('/'))
                .catch((error: Error) => Alert.danger('Registation failed: ' + error.message));
              /* Alert.success('Registration successful'); */
            }}
          >
            Register
          </Button.Success>
        </Card>
      </div>
    );
  }
}

class About extends Component {
  render() {
    return (
      <div className="aboutApp">
        <Card title="About this application">
          <Row className="aboutRow">
            <Column>
              This is an application for Covid-19 contact tracing. The information will be deleted
              after 10 days and will not be used for any other purpose than contact tracing.
            </Column>
          </Row>
          <Row>
            <Column>
              <hr></hr>
            </Column>
          </Row>
          <Row>
            <Column className="thankYou">
              Thank you for helping us do our part in fighting this pandemic.
            </Column>
          </Row>
        </Card>
      </div>
    );
  }
}

const root = document.getElementById('root');
if (root)
  ReactDOM.render(
    <HashRouter>
      <div>
        <Alert />
        <Header />
        <RegisterName />
        <About />
      </div>
    </HashRouter>,
    root
  );
