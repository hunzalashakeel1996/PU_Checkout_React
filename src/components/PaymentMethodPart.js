import './style.css';
import { Container, Button, Row, Col, Form } from 'react-bootstrap'
import React, { lazy, Suspense, useEffect, useState, useRef } from 'react'
import ShippingAddressPart from './ShippingAddressPart';
import InputMask from 'react-input-mask';
import Select from 'react-select';
import ReactDOM from "react-dom"
import { PayPalButton } from "react-paypal-button-v2";
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css'
import Client from '@amazonpay/amazon-pay-api-sdk-nodejs';
import AmazonPay from 'amazon-pay-react';
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";



function PaymentMethodPart(props) {
    const [state, setState] = useState({
        validated: false,
        isBillingAddress: false,
        selectedMethod: 'credit card',
        billingAddress: { STREETADDRESS2: '' },
        creditCardError: "",
        paymentDetails: {},
        PO: ""
    });

    const { isGuest, isLogin, onPlaceOrder, countries, canadaStates, usStates, grandTotal, selectedAddress } = props
    const { isBillingAddress, selectedMethod, validated, billingAddress, creditCardError, paymentDetails, PO } = state

    useEffect(() => {
        // fetch("https://pay-api.amazon.com/:version/checkoutSessions/", {
        //     method: 'POST',
        //     headers: {
        //         "authorization":"Px2e5oHhQZ88vVhc0DO%2FsShHj8MDDg%3DEXAMPLESIGNATURE",
        //         "x-amz-pay-date": new Date().toISOString(),
        //         "x-amz-pay-idempotency-key":"AVLo5tI10BHgEk2jEXAMPLEKEY"
        //     },
        //     body: {
        //         "webCheckoutDetails": {
        //             "checkoutReviewReturnUrl": "https://a.com/merchant-review-page"
        //         },
        //         "storeId": "amzn1.application-oa2-client.0284309fb0344a8abd0f2f903f091b04",
        //         "scopes": ["Hunzala Shakeel", "hunzala_shakeel@hotmail.com", "03342664254"],
        //         "deliverySpecifications": {
        //             "specialRestrictions": ["RestrictPOBoxes"],

        //         }
        //     }
        // }).then(res => {
        //     console.log('response', res)
        // })
        setState({ ...state, selectedMethod: ['USA', 'Canada', undefined].includes(selectedAddress.COUNTRY) ? 'credit card' : 'paypal' })
    }, [selectedAddress])

    const tempMethod = () => {
        window.amazon.Pay.renderButton('#AmazonPayButton', {
            // set checkout environment
            merchantId: 'A2I8597VRO3WO5',
            publicKeyId: 'SANDBOX-AFGKMIPFXQBNP4LYYTVSB57G',
            ledgerCurrency: 'USD',
            // customize the buyer experience
            checkoutLanguage: 'en_US',
            productType: 'PayOnly',
            placement: 'Cart',
            buttonColor: 'Gold',
            // configure Create Checkout Session request
            createCheckoutSessionConfig: {
                payloadJSON: {
                    checkoutSessionId: '79804d89-0f01-4681-875f-497e6276f011',
                    webCheckoutDetails: {
                        checkoutReviewReturnUrl: 'https://www.pulseuniform.com/',
                        checkoutResultReturnUrl: 'https://www.pulseuniform.com/',
                        amazonPayRedirectUrl: null,
                        checkoutCancelUrl: null
                    },
                    productType: null,
                    paymentDetails: {
                        paymentIntent: 'Authorize',
                        canHandlePendingAuthorization: true,
                        chargeAmount: { amount: '200.00', currencyCode: 'USD' },
                        totalOrderAmount: null,
                        softDescriptor: null,
                        presentmentCurrency: null,
                        allowOvercharge: null,
                        extendExpiration: null
                    },
                    chargePermissionType: 'OneTime',
                    recurringMetadata: null,
                    merchantMetadata: {
                        merchantReferenceId: 'A2I8597VRO3WO5',
                        merchantStoreName: 'Rizno Inc DBA Pulseuniform',
                        noteToBuyer: null,
                        customInformation: null
                    },
                    supplementaryData: null,
                    buyer: null,
                    billingAddress: null,
                    paymentPreferences: [null],
                    statusDetails: {
                        state: 'Open',
                        reasonCode: null,
                        reasonDescription: null,
                        lastUpdatedTimestamp: '20210702T153627Z'
                    },
                    shippingAddress: null,
                    platformId: null,
                    chargePermissionId: null,
                    chargeId: null,
                    constraints: [
                        {
                            constraintId: 'BuyerNotAssociated',
                            description: 'There is no buyer associated with the Checkout Session. Return the checkout session id to the Amazon Pay Button to allow buyer to login.'
                        }
                    ],
                    creationTimestamp: '20210702T153627Z',
                    expirationTimestamp: '20210703T153627Z',
                    storeId: 'amzn1.application-oa2-client.0284309fb0344a8abd0f2f903f091b04',
                    providerMetadata: { providerReferenceId: null },
                    releaseEnvironment: 'Sandbox',
                    deliverySpecifications: null
                }, // string generated in step 2
                signature: 'Oz2eQNeCWbm2jL6pYgfKerPMOgylq9uJbflTams6VafTiUEnXQvGQm8F/OMD1BKm5suhQWPaxmZecfhCH59LpGsHuVu13hmwr0NMZaKwDMoTAIFPNCw6y8vvMnTf8r733V/mLcC8+SQunyvoc7Rfs2cebeEcXcjkROcwKQgYaXsU2cav9RHN2BjukLw0XmVnW17NGK1pCi3tBEOH+DQtAQhuIWJxhXuyqWEVIm9oPUQaj1/mi+9lXHrrUW/biaFxGPjU6ZZpnJgf6QIjQOpSX3Stt6Zq3QsZ+0gprNHRpKZXOUFmxr6L4ZufjvFsyLYUz4Nw/GdrPKeUE0v6K0lxcg==', // signature generated in step 3
                publicKeyId: 'SANDBOX-AFGKMIPFXQBNP4LYYTVSB57G'
            }
        })
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setState({ ...state, validated: true })
        }
        // if payment method is credit card 
        if (selectedMethod === 'credit card') {
            if (checkPaymentValidation(event) !== 'true') {
                event.preventDefault();
                event.stopPropagation();
            }
            else {
                event.preventDefault()
                let tempPaymentDetails = { ...paymentDetails }
                tempPaymentDetails.cardNumber = tempPaymentDetails.cardNumber.replaceAll('-', '')
                tempPaymentDetails.cardMonth = `${tempPaymentDetails.expiry.split('/')[0]}`
                tempPaymentDetails.cardYear = `20${tempPaymentDetails.expiry.split('/')[1]}`
                tempPaymentDetails.TYPE = tempPaymentDetails.cardNumber[0] === '3' ? 'American Express Card' : tempPaymentDetails.cardNumber[0] === '4' ? 'Visa Card' : 'Master Card'
                // onPlaceOrder({ paymentDetails: { ...tempPaymentDetails }, billingAddress }, PO)
            }
        }
        // if payment method is gift card 
        else {
            event.preventDefault()
            // onPlaceOrder({ paymentDetails: { cardNumber: '', cardMonth: '', cardYear: '', TYPE: 'gift card' }, billingAddress, PO })
        }


        // if credit card expired 
        // else if (selectedMethod==='credit card'&&checkPaymentValidation(event) !== 'true') {
        //     event.preventDefault();
        //     event.stopPropagation();
        // }
        // else {
        //     if(selectedMethod==='credit card'){
        //         event.preventDefault()
        //         let tempPaymentDetails = { ...paymentDetails }
        //         tempPaymentDetails.cardNumber = tempPaymentDetails.cardNumber.replaceAll('-', '')
        //         tempPaymentDetails.cardMonth = `${tempPaymentDetails.expiry.split('/')[0]}`
        //         tempPaymentDetails.cardYear = `20${tempPaymentDetails.expiry.split('/')[1]}`
        //         tempPaymentDetails.TYPE = tempPaymentDetails.cardNumber[0]==='3'?'American Express Card':tempPaymentDetails.cardNumber[0]==='4'?'Visa Card':'Master Card'
        //         // onPlaceOrder({ paymentDetails: { ...tempPaymentDetails}, billingAddress }, PO)
        //     }
        //     else{
        //         event.preventDefault()
        //         console.log('palce order', { paymentDetails: {cardNumber: '',cardMonth: '', cardYear:'', TYPE: 'gift card'}, billingAddress, PO})
        //         // onPlaceOrder({ paymentDetails: {cardNumber: '',cardMonth: '', cardYear:'', TYPE: 'gift card'}, billingAddress, PO})
        //     }


        // }
        // setState({ ...state, validated: true });
    };

    const checkPaymentValidation = (event) => {
        event.preventDefault()
        const formData = new FormData(event.target)
        const formDataObj = Object.fromEntries(formData.entries())
        console.log('aaa', formDataObj)
        // if expiry length is greater than 4 and check for month and year 
        if ((formDataObj.expiry.length > 4) && (JSON.parse(`20${formDataObj.expiry.split('/')[1]}`) > new Date().getFullYear() || (JSON.parse(`20${formDataObj.expiry.split('/')[1]}`) === new Date().getFullYear() && formDataObj.expiry.split('/')[0] >= new Date().getMonth() + 1))) {
            setState({ ...state, creditCardError: JSON.parse(formDataObj.expiry.split('/')[0]) > 12 ? 'Please enter correct month' : '', validated: true })
            return JSON.parse(formDataObj.expiry.split('/')[0]) > 12 ? 'error' : 'true'
        }
        else {
            setState({ ...state, creditCardError: JSON.parse(formDataObj.expiry.split('/')[0]) > 12 ? 'Please enter correct month' : 'Sorry, your card is expired', validated: true })
            return 'Sorry, your card is expired'
        }
    }

    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: "0.01",
                    },
                },
            ],
        });
    };

    const onApprove = (data, actions) => {
        return actions.order.capture();
    };

    // const onBillingAddressDetailChange = (value, name) => {
    //     setState({ ...state, billingAddress: { ...billingAddress, [name]: value, STATE: name === 'COUNTRY' ? '' : value } })
    // }

    const onBillingAddressDetailChange = (val, key) => {
        setState({ ...state, billingAddress: { ...billingAddress, [key]: val } })
    }

    const onPaymentDetailChange = (val, key) => {
        setState({ ...state, paymentDetails: { ...paymentDetails, [key]: key === 'name' ? val.toUpperCase() : val } })
    }

    return (
        <Row >
            <Form className='emailFormContainer' style={{ marginTop: 0 }} noValidate validated={state.validated} onSubmit={handleSubmit}>
                <div className='informationContainer' style={{ marginTop: 20, marginBottom: selectedMethod !== 'paypal' ? 0 : 20 }}>
                    <div className='textContainer'>
                        <Col xs={12} >
                            <h5 >PAYMENT METHOD</h5>
                        </Col>
                    </div>
                    {/* buttons  */}
                    <Row className='buttonsContainer'>
                        {['USA', 'Canada', undefined].includes(selectedAddress.COUNTRY) && <Col xs={12} md={12} lg={4} className='singleButtonContainer mb-2 mb-lg-0'>
                            <Button className={selectedMethod === 'credit card' ? 'fillButton' : 'borderButton'}
                                variant={selectedMethod !== 'credit card' ? "outline-primary" : null} block
                                onClick={() => { setState({ ...state, selectedMethod: 'credit card' }) }}>
                                Credit Card
                            </Button>
                        </Col>}
                        <Col xs={12} md={12} lg={4} className='singleButtonContainer mb-2 mb-lg-0'>
                            <Button className={selectedMethod === 'paypal' ? 'fillButton' : 'borderButton'}
                                variant={selectedMethod !== 'paypal' ? "outline-primary" : null} block
                                onClick={() => { setState({ ...state, selectedMethod: 'paypal' }) }}>
                                Paypal
                            </Button>
                        </Col>
                        {['USA', 'Canada', undefined].includes(selectedAddress.COUNTRY) && <Col xs={12} md={12} lg={4} className='singleButtonContainer'>
                            <Button className={selectedMethod === 'e-gift' ? 'fillButton' : 'borderButton'}
                                variant={selectedMethod !== 'e-gift' ? "outline-primary" : null} block
                                onClick={() => { setState({ ...state, selectedMethod: 'e-gift' }) }}>
                                E-Gift Card
                            </Button>
                        </Col>}
                    </Row>


                    {/* form  */}
                    {/* ========================================= credit card =================================== */}
                    {selectedMethod === 'credit card' ?
                        <>
                            <Row className='buttonsContainer' style={{ marginLeft: 20 }}>
                                <Form.Group style={{ marginRight: 15, marginLeft: 15, width: '100%' }} controlId="formBasicEmail">
                                    {/* <Form.Label>Email address</Form.Label> */}
                                    {/* <Form.Control required className='inputFieldContainer' type="text" placeholder="Credit Card Number" name='cardNumber' /> */}
                                    <Row>
                                        <Col xs={12} md={6}>
                                            <Form.Control onChange={(val) => { onPaymentDetailChange(val.target.value, 'name', true) }} required style={{ marginTop: 10, paddingRight: 5 }} className='inputFieldContainer' type="text" placeholder="Cardholder Name" name='name' value={paymentDetails.name && paymentDetails.name} />
                                            <Form.Control.Feedback type="invalid">Name is required</Form.Control.Feedback>
                                        </Col>
                                        {console.log('paytment', paymentDetails)}
                                        <Col xs={12} md={6}>
                                            <InputMask mask={`${paymentDetails.cardNumber && paymentDetails.cardNumber[0] === '3' ? '9999-999999-99999' : '9999-9999-9999-9999'}`} maskChar="" onChange={(val) => { onPaymentDetailChange(val.target.value, 'cardNumber', true) }} value={paymentDetails.cardNumber && paymentDetails.cardNumber}>
                                                {(props) => <Form.Control  {...props} required style={{ marginTop: 10 }} className='inputFieldContainer' placeholder="Credit Card Number" name='cardNumber' />}
                                            </InputMask>
                                            <Form.Control.Feedback type="invalid">Card Number is required</Form.Control.Feedback>
                                        </Col>
                                    </Row>
                                    <Row >
                                        <Col>
                                            <InputMask mask="99/99" maskChar="" onChange={(val) => { onPaymentDetailChange(val.target.value, 'expiry', true) }} value={paymentDetails.cardMonth && paymentDetails.cardMonth}>
                                                {(props) => <Form.Control  {...props} required style={{ marginTop: 10 }} className='inputFieldContainer' placeholder="Expiry MM/YY" name='expiry' />}
                                            </InputMask>
                                            <Form.Control.Feedback type="invalid">Expiry is required</Form.Control.Feedback>
                                            <p style={{ color: '#db3740' }}>{creditCardError}</p>
                                            {/* <Form.Control required style={{ marginTop: 10 }} className='inputFieldContainer' type="text" placeholder="Month" name='cardMonth' /> */}
                                        </Col>

                                        <Col>
                                            <InputMask mask="9999" maskChar="" onChange={(val) => { onPaymentDetailChange(val.target.value, 'cardSecurity', true) }} value={paymentDetails.cardSecurity && paymentDetails.cardSecurity}>
                                                {(props) => <Form.Control  {...props} required style={{ marginTop: 10 }} className='inputFieldContainer' placeholder="Security Code" name='cardSecurity' />}
                                            </InputMask>
                                            <Form.Control.Feedback type="invalid">Security Code is required</Form.Control.Feedback>

                                            {/* <Form.Control required style={{ marginTop: 10 }} className='inputFieldContainer' type="text" placeholder="Security Code" name='cardSecurity'/> */}
                                        </Col>
                                    </Row>
                                </Form.Group>
                            </Row>
                            {/* <Row className='textContainer'>
                                <h5 >BILLING ADDRESS</h5>
                            </Row> */}
                            <Col className='textContainer'>
                                <Form.Check
                                    custom
                                    defaultChecked={true}
                                    type={'checkbox'}
                                    onChange={() => { setState({ ...state, isBillingAddress: !isBillingAddress, billingAddress: {} }) }}
                                    id={`custom-checkbox`}
                                    label={`Billing address same as shipping address`}

                                />
                            </Col>
                            <Col className='textContainer'>
                                <p><strong>Note:</strong><br></br>Your Bank Statements will indicate Payment made to "Rizno Inc. - Uniform Div" For your peace of mind, we don't save your card numbers. Once we process your payment, the system automatically removes the card details.</p>
                            </Col>

                        </>

                        :
                        // ============================================ paypal ========================================
                        selectedMethod === 'paypal' ?

                            <Row style={{ marginLeft: 30, marginTop: 30, flex: 1, dispaly: 'flex', width: '100%', }} >
                                {/* <AmazonPay
        clientId='amzn1.application-oa2-client.0284309fb0344a8abd0f2f903f091b04'
        sellerId='A2I8597VRO3WO5'
        agreementType={'BillingAgreement'}
        scope='profile payments:widget'
        btnType='PwA'
        btnColor='Gold'
        btnSize='medium'
        onConsentChange={(hasConsent) => console.log("A")}
        handleBillingAgreementId={(billingAgreementId) => console.log("B")}
        billingAgreementId={0}
        useAmazonAddressBook={true}
/> */}
                                <PayPalScriptProvider
                                    options={{
                                        "client-id": "test",
                                        components: "buttons",
                                        currency: "USD"
                                    }}
                                >
                                    <PayPalButtons
                                        amount={`${grandTotal}`}
                                        onClick={() => {
                                            let tempPaymentDetails = {
                                                name: '',
                                                cardNumber: '',
                                                cardMonth: '',
                                                cardYear: '',
                                                cardSecurity: '',
                                                TYPE: "PayPal"
                                            }
                                            onPlaceOrder({ paymentDetails: { ...tempPaymentDetails }, billingAddress: { ...billingAddress }, PO })
                                        }}
                                        onApprove={function (data, actions) {
                                            return actions.order.capture().then(function () {
                                                // Your code here after capture the order
                                            });
                                        }}
                                    />
                                </PayPalScriptProvider>
                                {/* <PayPalButton
                                        style={{ flex: 1, dispaly: 'flex', width: '100%' }}
                                        // amount={`${grandTotal}`}
                                        amount={`${grandTotal}`}
                                        createOrder={(data, actions) => {
                                            console.log('abcd', billingAddress)
                                            // alert("Transaction completed by " + details.payer.name.given_name);
                                            let tempPaymentDetails = {
                                                name: '',
                                                cardNumber: '',
                                                cardMonth: '',
                                                cardYear: '',
                                                cardSecurity: '',
                                                TYPE: "PayPal"
                                            }
                                            onPlaceOrder({ paymentDetails: { ...tempPaymentDetails }, billingAddress: { ...billingAddress }, PO })
                                            // return actions.order.create({
                                            //     purchase_units: [{
                                            //       amount: {
                                            //         currency_code: "USD",
                                            //         value: `${grandTotal}`
                                            //       }
                                            //     }],
                                            // })
                                            // OPTIONAL: Call your server to save the transaction
                                            // return fetch("/paypal-transaction-complete", {
                                            //     method: "post",
                                            //     body: JSON.stringify({
                                            //         orderID: data.orderID
                                            //     })
                                            // });
                                          }}
                                        
                                        // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                                        onSuccess={(details, data) => {

                                        }}
                                    /> */}
                            </Row>
                            :
                            // =================================== e-gift ================================================
                            <Row className='buttonsContainer' >
                                <Row style={{ marginLeft: 20, marginTop: 10 }}>
                                    <p style={{ fontWeight: 'bold', fontSize: 20 }}>Pay by email giftcard</p>
                                </Row>
                                <Row style={{ marginLeft: 20, marginTop: 5, marginRight: 10 }}>
                                    <p style={{ fontSize: 14 }}>Call us 8AM-8PM EST (Mon - Fri) at 1 866 967 8573 and one of our friendly representative will be happy to assist you.</p>
                                </Row>
                                <Row style={{ marginLeft: 20, marginTop: 5, marginRight: 10 }}>
                                    <p style={{ fontSize: 14 }}>We accept credit card information over the phone. Alternatively, you can also Fax your credit card information at 1 847 594 1644. Please write your name, address and phone number.</p>
                                </Row>
                            </Row>
                    }

                </div>
                {/* <div id="AmazonPayButton"></div> */}
                {/* {tempMethod()} */}
                {isBillingAddress &&
                    <div className='informationContainer' style={{ marginTop: 20 }}>
                        <Col className='textContainer'>
                            <h5 >BILLING ADDRESS</h5>
                        </Col>

                        <Col className='buttonsContainer'>
                            <Form.Group style={{ marginRight: 15, marginLeft: 15, width: '100%' }} controlId="formBasicEmail" as={Col} xs="12" style={{ paddingLeft: 0 }}>
                                {/* <Form.Label>Email address</Form.Label> */}

                                <Row>
                                    <Col xs={12} sm={6} md={6}>
                                        <Form.Control required style={{ marginTop: 10, paddingRight: 5 }} className='inputFieldContainer' type="text" placeholder="First Name" name='FIRSTNAME' onChange={(e) => { onBillingAddressDetailChange(e.target.value, 'FIRSTNAME') }} value={billingAddress.FIRSTNAME && billingAddress.FIRSTNAME} />
                                        <Form.Control.Feedback type="invalid">First Name is required</Form.Control.Feedback>
                                    </Col>
                                    <Col xs={12} sm={6} md={6}>
                                        <Form.Control required style={{ marginTop: 10, paddingRight: 5 }} className='inputFieldContainer' type="text" placeholder="Last Name" name='LASTNAME' onChange={(e) => { onBillingAddressDetailChange(e.target.value, 'LASTNAME') }} value={billingAddress.LASTNAME && billingAddress.LASTNAME} />
                                        <Form.Control.Feedback type="invalid"> Last Name is required </Form.Control.Feedback>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} sm={8} md={8}>
                                        <Form.Control required style={{ marginTop: 10, paddingRight: 5 }} className='inputFieldContainer' type="text" placeholder="Shipping Address" name='STREETADDRESS1' onChange={(e) => { onBillingAddressDetailChange(e.target.value, 'STREETADDRESS1') }} value={billingAddress.STREETADDRESS1 && billingAddress.STREETADDRESS1} />
                                        <Form.Control.Feedback type="invalid">Address is required</Form.Control.Feedback>
                                    </Col>
                                    <Col xs={12} sm={4} md={4}>
                                        <Form.Control style={{ marginTop: 10, paddingRight: 5 }} className='inputFieldContainer' type="text" placeholder="Apt/Unit (optional)" name='STREETADDRESS2' onChange={(e) => { onBillingAddressDetailChange(e.target.value, 'STREETADDRESS2') }} value={billingAddress.STREETADDRESS2 && billingAddress.STREETADDRESS2} />
                                        <Form.Control.Feedback type="invalid"> Apt / Unit is required </Form.Control.Feedback>
                                    </Col>
                                </Row>
                                <Row>
                                    {/* <Col>
                                        <Form.Control required style={{ marginTop: 10, paddingRight: 5 }} className='inputFieldContainer' type="text" placeholder="Country" name='COUNTRY' onChange={(e) => { onBillingAddressDetailChange(e.target.value, 'COUNTRY') }} value={billingAddress.COUNTRY && billingAddress.COUNTRY} />
                                        <Form.Control.Feedback type="invalid">Country is required </Form.Control.Feedback>
                                    </Col> */}
                                    <Col xs={12} md={6}>
                                        <Select
                                            // value={selectedOption}
                                            value={billingAddress.COUNTRY && { value: billingAddress.COUNTRY, label: billingAddress.COUNTRY }}
                                            placeholder='Select Country'
                                            style={{ border: 0, }}
                                            onChange={(selectedOption) => { onBillingAddressDetailChange(selectedOption.value, 'COUNTRY') }}
                                            options={countries.map(country => {
                                                return { value: country.CountryName, label: country.CountryName }
                                            })}
                                        />
                                        {((billingAddress.COUNTRY == undefined || billingAddress.COUNTRY === '') && validated) && <p style={{ fontSize: 13, marginTop: 5, color: '#dc3545' }}>Country is required</p>}
                                    </Col>
                                    <Col>
                                        <Form.Control required style={{ marginTop: 10, paddingRight: 5 }} className='inputFieldContainer' type="text" placeholder="Town/City" name='CITY' onChange={(e) => { onBillingAddressDetailChange(e.target.value, 'CITY') }} value={billingAddress.CITY && billingAddress.CITY} />
                                        <Form.Control.Feedback type="invalid">Town/City is required </Form.Control.Feedback>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        {/* <Form.Control required style={{ marginTop: 10, paddingRight: 5 }} className='inputFieldContainer' type="text" placeholder="State" name='STATE' onChange={(e) => { onBillingAddressDetailChange(e.target.value, 'STATE') }} value={billingAddress.STATE && billingAddress.STATE} />
                                        <Form.Control.Feedback type="invalid">State is required</Form.Control.Feedback> */}
                                        {console.log('a6', billingAddress)}
                                        {(billingAddress.COUNTRY === 'USA' || billingAddress.COUNTRY === 'Canada') ?
                                            <>
                                                <Select
                                                    // value={selectedOption}
                                                    value={billingAddress.STATE && { value: billingAddress.STATE, label: billingAddress.STATE }}
                                                    placeholder='Select State'
                                                    style={{ border: 0, }}
                                                    onChange={(selectedOption) => { onBillingAddressDetailChange(selectedOption.value, 'STATE') }}
                                                    options={(billingAddress.COUNTRY === 'USA' ? usStates : canadaStates).map(country => {
                                                        return { value: country.STATENAME, label: country.STATENAME }
                                                    })}
                                                />
                                                {((billingAddress.STATE == undefined || billingAddress.STATE === '') && validated) && <p style={{ fontSize: 13, marginTop: 5, color: '#dc3545' }}>State is required</p>}

                                            </>
                                            :
                                            <>
                                                <Form.Control required style={{ marginTop: 10, paddingRight: 5 }} className='inputFieldContainer' type="text" placeholder="State" name='STATE' onChange={(e) => { onBillingAddressDetailChange(e.target.value, 'STATE') }} value={billingAddress.STATE && billingAddress.STATE} />
                                                <Form.Control.Feedback type="invalid">State is required</Form.Control.Feedback>
                                            </>
                                        }
                                    </Col>
                                    <Col>
                                        <Form.Control required style={{ marginTop: 10, paddingRight: 5 }} className='inputFieldContainer' type="text" placeholder="Zip Code" name='ZIP' onChange={(e) => { onBillingAddressDetailChange(e.target.value, 'ZIP') }} value={billingAddress.ZIP && billingAddress.ZIP} />
                                        <Form.Control.Feedback type="invalid">Zip Code is required</Form.Control.Feedback>
                                    </Col>
                                </Row>
                                <Form.Control required style={{ marginTop: 10, paddingRight: 5 }} type="number" className='inputFieldContainer' type="text" placeholder="Phone Number" name='PHONE1' onChange={(e) => { onBillingAddressDetailChange(e.target.value, 'PHONE1') }} value={billingAddress.PHONE1 && billingAddress.PHONE1} />
                                <Form.Control.Feedback type="invalid">Phone Number is required</Form.Control.Feedback>

                            </Form.Group>
                        </Col>
                    </div>
                }

                {/* 
{amazon !== 'undefined' && amazon.Pay.renderButton('#AmazonPayButton', {
                // set checkout environment
                merchantId: 'merchant_id',
                publicKeyId: 'SANDBOX-xxxxxxxxxx',
                ledgerCurrency: 'USD',         
                // customize the buyer experience
                checkoutLanguage: 'en_US',
                productType: 'PayAndShip',
                placement: 'Cart',
                buttonColor: 'Gold',
                // configure Create Checkout Session request
              //   createCheckoutSessionConfig: {                     
              //       payloadJSON: 'payload', // string generated in step 2
              //       signature: 'xxxx' // signature generated in step 3
              //   }   
            })}  */}
                {/* 
                <Cards
                    cvc={paymentDetails.cardSecurity}
                    expiry={`${paymentDetails.cardMonth}/${paymentDetails.cardYear}`}
                    name={paymentDetails.name}
                    number={paymentDetails.cardNumber}
                /> */}

                <div className='textContainer col' >
                    <Form.Control style={{ maxWidth: 300, }} className='inputFieldContainer' type="text" placeholder="Purchase Order # (optional)" name='PO' onChange={(e) => { setState({ ...state, PO: e.target.value }) }} />
                </div>

                <div className='textContainer col'>
                    <div style={{ marginTop: 20 }}>
                        <Form.Check
                            type={'checkbox'}
                            id={`default`}
                            onClick={() => { setState({ ...state }) }}
                            label={`I would love to get amazing deals and coupons from PulseUniform`}
                        />
                    </div>
                </div>

                {selectedMethod !== 'paypal' && <Row className='palceOrderButtonContainer'>
                    <Button disabled={!(isLogin && Object.keys(selectedAddress).length > 0)} type="submit" className='fillButton redbtn sticky' style={{ width: '60%', opacity: (isLogin && Object.keys(selectedAddress).length > 0) ? 1 : 0.7 }}>PLACE AN ORDER</Button>
                </Row>}
            </Form>
        </Row>
    )
}

export default PaymentMethodPart;



