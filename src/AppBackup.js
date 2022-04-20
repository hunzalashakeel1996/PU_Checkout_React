import logo from './logo.svg';
import './App.css';
import {Container, Button, Row, Col, Form} from 'react-bootstrap'
import React, { lazy, Suspense, useEffect, useState } from 'react';
// import { Col, Form, Input, Row, Select, Spin, Upload } from 'antd';

const tempControls = {
  email: {value: ''},
  password: {value: ''},
  fullName: {value: ''},
  streetAddress: {value: ''},
  apt: {value: ''},
  city: {value: ''},
  state: {value: ''},
  zipCode: {value: ''},
  phoneNumber: {value: ''},
}

function App() {
  const [state, setState] = useState({
    isGuest: false,
    controls: {...tempControls},
    isLogin: false,
    isPayment: false
  });

  const {isGuest, isLogin, isPayment} = state
  return (
    <Container className='windowContainer' >
      <Row className='mainContainer'>
        {/* information part  */}
        <Col style={{marginRight: 20}}>
          {/* first part  */}
          <Row className='informationContainer'>
            {/* buttons part  */}
            <Row className='buttonsContainer'>
              <Col className='singleButtonContainer'><Button onClick={() => {setState({...state, isGuest: false})}} className={isGuest ? 'borderButton' : 'fillButton'} variant={isGuest?"outline-primary": null} block>Already have an account?</Button></Col>
              <Col className='singleButtonContainer'><Button onClick={() => {setState({...state, isGuest: true})}} className={!isGuest ? 'borderButton' : 'fillButton'} variant={!isGuest?"outline-primary": null} block>Guest Checkout</Button></Col>
            </Row>
            
            {/* email password part  */}
            <Row className='buttonsContainer'>
              <Form className='emailFormContainer'>
                <Form.Group controlId="formBasicEmail">
                  {/* <Form.Label>Email address</Form.Label> */}
                  <Form.Control className='inputFieldContainer' type="email" placeholder="Enter email" />
                </Form.Group>
                {!isGuest && <Form.Group controlId="formBasicEmail">
                  {/* <Form.Label>Email address</Form.Label> */}
                  <Form.Control className='inputFieldContainer' type="password" placeholder="Enter Password" />
                </Form.Group>}
              </Form>
            </Row>
            {/* message part  */}
            <Row className='buttonsContainer'>
              {isGuest && <Col>
                <p>Already have an account? <span><a target='_blank' href={`#`} style={{color:'red'}}>Sign In</a> </span></p>
              </Col>}
              <Col className='flexEndButton'>
                <Button onClick={() => {setState({...state, isLogin: true})}} className='fillButton'>{isGuest?'Continue as Guest':'Login'}</Button>
              </Col>
            </Row>
          </Row>
                
          {/* email part  */}
          {(!isGuest && isLogin) && <Row className='informationContainer' style={{ marginTop: 20 }}>
            <Row className='buttonsContainer'>
              <h5 >EMAIL ADDRESS</h5>
              <Col style={{ display:'flex', flex: 1, justifyContent: 'flex-end' }}>
                <a target='_blank' href={`#`} style={{ textAlign: 'right', color: '#1a2651' }}>Not you? Signout</a>
              </Col>
            </Row>
            <Row className='buttonsContainer'>
              <p>john.doe@gmail.com</p>
            </Row>
          </Row>}

          {/* email part  */}
          {isLogin && <Row className='informationContainer' style={{ marginTop: 20 }}>
            <Row className='buttonsContainer'>
              <h5 >SHIPPING ADDRESS</h5>
            </Row>
            <Row className='buttonsContainer'>
              <Form className='emailFormContainer'>
                <Form.Group controlId="formBasicEmail">
                  {/* <Form.Label>Email address</Form.Label> */}
                  <Form.Control className='inputFieldContainer' type="text" placeholder="Full Name" />
                  <Row>
                    <Col xs={8}>
                      <Form.Control style={{ marginTop: 10 }} className='inputFieldContainer' type="text" placeholder="Shipping Address" />
                    </Col>
                    <Col xs={4}>
                      <Form.Control style={{ marginTop: 10 }} className='inputFieldContainer' type="text" placeholder="Apt/Unit" />
                    </Col>
                  </Row>
                  <Form.Control style={{ marginTop: 10 }} className='inputFieldContainer' type="text" placeholder="Town/City" />
                  <Row>
                    <Col >
                      <Form.Control style={{ marginTop: 10 }} className='inputFieldContainer' type="text" placeholder="State" />
                    </Col>
                    <Col >
                      <Form.Control style={{ marginTop: 10 }} className='inputFieldContainer' type="text" placeholder="Zip Code" />
                    </Col>
                  </Row>
                  <Form.Control style={{ marginTop: 10 }} className='inputFieldContainer' type="number" placeholder="Phone Number" />
                </Form.Group>
              </Form>
            </Row>
            <Row className='buttonsContainer'>
              <Col className='flexEndButton'>
                <Button onClick={() => {setState({...state, isPayment: true})}} className='fillButton'>Continue to Shipping</Button>
              </Col>
            </Row>
          </Row>}


          {/* third part  */}
          {isPayment && <Row className='informationContainer' style={{marginTop: 20}}>
            <Row  className='buttonsContainer'>
              <h5 >SHIPPING METHOD</h5>
            </Row>
            <Row className='buttonsContainer'>
              <button className='shippingMethodContainerFill'>
                <p className="shippingMethodFontWhite">BETWEEN</p>
                <p className="shippingMethodFontWhite">FEB 4</p>
                <p className="shippingMethodFontWhite" style={{  fontSize: 12 }}>and</p>
                <p className="shippingMethodFontWhite" style={{  borderBottomStyle: 'solid', borderBottomWidth: 1 }}>FEB 6</p>
                <p className="shippingMethodFontWhite" style={{  fontSize: 14 }}>$4.90</p>
                <p className="shippingMethodFontWhite" style={{  fontSize: 14 }}>BOOKING</p>
                <p className="shippingMethodFontWhite" style={{  fontSize: 12 }}>with text</p>
              </button>
              <button className='shippingMethodContainerBorder'>
                <p className="shippingMethodFontBlack" >FRIDAY</p>
                <p className="shippingMethodFontBlack" style={{  fontSize: 29 }}>4</p>
                {/* <p style={{  fontSize: 12 }}>and</p> */}
                <p className="shippingMethodFontBlack" style={{  borderBottomStyle: 'solid', borderBottomWidth: 1 }}>FEB</p>
                <p className="shippingMethodFontBlack" style={{  fontSize: 14 }}>$4.90</p>
                <p className="shippingMethodFontBlack" style={{  fontSize: 14 }}>BOOKING</p>
                <p className="shippingMethodFontBlack" style={{  fontSize: 12 }}>with text</p>
              </button>
              <button className='shippingMethodContainerBorder'>
                <p className="shippingMethodFontBlack" >THURSDAY</p>
                <p className="shippingMethodFontBlack" style={{  fontSize: 29 }}>10</p>
                {/* <p style={{  fontSize: 12 }}>and</p> */}
                <p className="shippingMethodFontBlack" style={{  borderBottomStyle: 'solid', borderBottomWidth: 1 }}>JAN</p>
                <p className="shippingMethodFontBlack" style={{  fontSize: 14 }}>$4.90</p>
                <p className="shippingMethodFontBlack" style={{  fontSize: 14 }}>BOOKING</p>
                <p className="shippingMethodFontBlack" style={{  fontSize: 12 }}>with text</p>
              </button>
              <button className='shippingMethodContainerBorder'>
                <p className="shippingMethodFontBlack" >FRIDAY</p>
                <p className="shippingMethodFontBlack" style={{  fontSize: 29 }}>4</p>
                {/* <p style={{  fontSize: 12 }}>and</p> */}
                <p className="shippingMethodFontBlack" style={{  borderBottomStyle: 'solid', borderBottomWidth: 1 }}>FEB</p>
                <p className="shippingMethodFontBlack" style={{  fontSize: 14 }}>$4.90</p>
                <p className="shippingMethodFontBlack" style={{  fontSize: 14 }}>BOOKING</p>
                <p className="shippingMethodFontBlack" style={{  fontSize: 12 }}>with text</p>
              </button>
            </Row>
          </Row>}

          {/* fourth part  */}
          {isPayment && <Row className='informationContainer' style={{marginTop: 20}}>
            <Row className='buttonsContainer'>
              <h5 >PAYMENT METHOD</h5>
            </Row>
            {/* buttons  */}
            <Row className='buttonsContainer'>
              <Col className='singleButtonContainer'><Button className='fillButton' block>Credit Card</Button></Col>
              <Col className='singleButtonContainer'><Button className='borderButton' variant="outline-primary" block>Paypal</Button></Col>
              <Col className='singleButtonContainer'><Button className='borderButton' variant="outline-primary" block>E-Gift Card</Button></Col>
            </Row>
            {/* form  */}
            <Row className='buttonsContainer'>
              <Form className='emailFormContainer'>
                <Form.Group controlId="formBasicEmail">
                  {/* <Form.Label>Email address</Form.Label> */}
                  <Form.Control className='inputFieldContainer' type="text" placeholder="Credit Card Number" />
                  <Row>
                    <Col><Form.Control style={{ marginTop: 10 }} className='inputFieldContainer' type="text" placeholder="Month" /></Col>
                    <Col><Form.Control style={{ marginTop: 10 }} className='inputFieldContainer' type="text" placeholder="Year" /></Col>
                    <Col><Form.Control style={{ marginTop: 10 }} className='inputFieldContainer' type="text" placeholder="Security Code" /></Col>
                  </Row>
                </Form.Group>
              </Form>
            </Row>
            <Row className='buttonsContainer'>
              <h5 >BILLING ADDRESS</h5>
            </Row>
            <Row className='buttonsContainer'>
              <Form.Check
                custom
                type={'checkbox'}
                id={`custom-checkbox`}
                label={`Billing address same as shipping address`}
                
              />
            </Row>
          </Row>}
          {/* fourth part  */}
          {(isGuest && isPayment) && <Row className='informationContainer' style={{ marginTop: 20 }}>
            <Row className='buttonsContainer'>
              <h5 >ENTER PASSWORD TO CREATE AN ACCOUNT</h5>
              <Form className='emailFormContainer'>
                <Form.Group controlId="formBasicEmail">
                  <Form.Control className='inputFieldContainer' type="password" placeholder="Password" />
                </Form.Group>
              </Form>
            </Row>
          </Row>}

          {(isPayment) &&<Row className='palceOrderButtonContainer'>
            <Button className='fillButton' style={{ width: '60%' }}>PLACE AN ORDER</Button>
          </Row>}
        </Col>

        {/* summary part */}
        <Col xl={4}>
          {/* first part  */}
          <Row className='summaryContainer'>
            <Row className='summaryRowContainer' >
              <Row style={{flex: 0.8}}>
                <h5 style={{marginLeft:15}}>SHIPPING CART</h5>
                <p >(1 item) </p>
              </Row>
              <Row style={{flex: 0.2}}>
                <a target='_blank' href={`#`} style={{ textAlign: 'right'}}>Details</a>
              </Row>
            </Row>
          </Row>

          {/* second part  */}
          <Row className='summaryContainer' style={{ marginTop: 20}}>
            <Row className='summaryRowContainer' >
              <h5 >ORDER SUMMARY</h5>
            </Row>
            <Row className='summaryRowContainer'>
              <p style={{flex:0.9}}>Subtotal</p>
              <p style={{textAlign:'right'}}>$59.59</p>
            </Row>
            <Row className='summaryRowContainer'>
              <p style={{flex:0.9}}>Shipping [Economy]</p>
              <p style={{textAlign:'right'}}>$4.59</p>
            </Row>
            <Row className='summaryRowContainer'>
              <p style={{flex:0.9}}>My Savings</p>
              <p style={{textAlign:'right', color: 'red'}}>$3.59</p>
            </Row>
            <Row className='summaryRowContainer'>
              <p style={{flex:0.9}}>Subtotal</p>
              <p style={{textAlign:'right'}}>$59.59</p>
            </Row>
            <Row className='summaryRowContainer' style={{borderBottom: '1px solid'}}>
              
            </Row>
            <Row className='summaryRowContainer'>
              <p style={{flex:0.9, fontWeight:'bold'}}>GRAND TOTAL</p>
              <p style={{textAlign:'right', fontWeight:'bold'}}>$59.59</p>
            </Row>

          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default App;


// <Col className='informationContainer'>
//           {/* first part  */}
//           <Row className='partsContainer container'>
//             {/* buttons part  */}
//             <Row className='windowContainer'>
//               <Col className='buttonContainer'>
//                 <Button>Already have an account?</Button>
//               </Col>
//               <Col>
//                 <Button>Guest Checkout</Button>
//               </Col>
//             </Row>
//             {/* fields part  */}
//             <Row>

//             </Row>
//             {/* bottom part  */}
//             <Row>

//             </Row>
//           </Row>
//         </Col>