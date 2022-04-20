import './style.css';
import { Container, Button, Row, Col, Form } from 'react-bootstrap'
import React, { lazy, Suspense, useEffect, useState } from 'react'
import { getCartDetails } from '../DataAction/Checkout';
import Cookies from 'universal-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faPhoneAlt, faComment, faEnvelope } from '@fortawesome/free-solid-svg-icons'

function OrderSummaryPart(props) {
    const { isGuest, isLogin, selectedShippingMethod, user, cartDetails, subTotal, grandTotal, georgiaTax } = props
    const cookies = new Cookies();

    const [state, setState] = useState({
        validated: false,
        // cartDetails: [],
        isDetailShow: false,

    });
    const { isDetailShow } = state

    const toFixedNumber = (number) => {
        return parseFloat(number.toFixed(2))
    }
    const toggleChat = (number) => {

        window.Tawk_API.toggle()

    }

    useEffect(() => {
        
        window.Tawk_API = window.Tawk_API || {};
        (function () {
            var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = 'https://embed.tawk.to/5684ee0d54db70e54cd03114/default';
            s1.charset = 'UTF-8';
            s1.setAttribute('crossorigin', '*');
            s0.parentNode.insertBefore(s1, s0);
        })();
    }, []);

    // useEffect(() => {
    //     console.log('heopkfd', selectedShippingMethod)
    //     if(selectedShippingMethod.PriceAmount !== undefined){
    //         let tempGrandTotal = 0
    //         tempGrandTotal = subTotal + selectedShippingMethod.PriceAmount
    //         console.log('checl', tempGrandTotal)
    //         setState({...state, grandTotal: tempGrandTotal})
    //     }
    // }, [selectedShippingMethod]);

    const handleSubmit = (event) => {
        console.log('asasdasas', isLogin)
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        else {
            event.preventDefault()
            const formData = new FormData(event.target)
            const formDataObj = Object.fromEntries(formData.entries())
            console.log(formDataObj)
            props.onLoginClick()
        }
        setState({ ...state, validated: true });
    };

    return (
        <>
            <div className='summaryContainer'>


                <Row className='' >
                    <Col style={{ flex: 0.75 }} className='pr-0'>
                        <h5 style={{ marginBottom: 0 }}>SHOPPING CART <span className='itemCount'>({cartDetails.length} item)</span></h5>

                    </Col>
                    <Col style={{ flex: 0.25 }}>
                        <a onClick={() => { setState({ ...state, isDetailShow: !isDetailShow }) }} style={{ display: 'flex', float: 'right', textAlign: 'right', color: '#052355', cursor: 'pointer', fontWeight: 500 }}>Details <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: 11, display: 'inline-block', float: 'right', marginTop: 8, marginLeft: 4, }} /></a>

                    </Col>

                </Row>

                {isDetailShow && cartDetails.map(cart => (
                    <Row className='' style={{ margin: '10px 0px 0 0', }} >

                        <Col xs={3} className='pl-0'>
                            <img style={{ width: '100%', height: 'auto', marginTop: 7, maxWidth: '72px', }} src={`https://cdn.pulseuniform.com/stylepic/Colorpic/450/${cart.STYLECODE}${cart.COLORCODE}LRL.jpg`} />
                        </Col>

                        <Col xs={8} style={{ padding: 0 }}>
                            <div><p style={{ fontSize: 13, fontWeight: 500, marginBottom: 2, }}>{cart.STYLENAME}</p></div>
                            <Row style={{ margin: 0, padding: 0 }}>
                                {cart.COLORCODE !== null && <div xs={4}><p style={{ fontSize: 13, fontWeight: 500, marginBottom: 2, marginRight: 8 }}>{`Color: ${cart.COLORCODE}-${cart.COLORNAME}`}</p></div>}
                                {cart.SIZENAME !== null && <div xs={4}><p style={{ fontSize: 13, fontWeight: 500, marginBottom: 2, marginRight: 8 }}>{`Size: ${cart.SIZENAME}`}</p></div>}
                                <div xs={4}><p style={{ fontSize: 13, fontWeight: 500, marginBottom: 2, marginRight: cart.COLORCODE !== null ? 8 : 0 }}>{`Qty: ${cart.QUANTITY}`}</p></div>
                            </Row>
                            <div><p style={{ fontSize: 13, fontWeight: 700, marginBottom: 2, }}>{`Price: $${toFixedNumber(cart.ItemPrice * cart.QUANTITY)}`}</p></div>
                            {cart.ISEMB && <div><p style={{ fontSize: 13, fontWeight: 500, marginBottom: 2, }}><a target='_blank' onClick={() => { window.open(`https://www.pulseuniform.com/checkout/embdetails.asp?shopid=${cart.SHOPID}`, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes'); }} style={{ cursor: 'pointer', color: '#d83442' }}>View Embroidery Details</a></p></div>}

                        </Col>

                        <div style={{ float: 'left', width: '100%', height: 1, backgroundColor: 'rgb(226 229 244)', margin: '10px 0px 0 0', }}></div>

                    </Row>))

                }
                <a href='https://www.pulseuniform.com/shoppingcart.asp' className='edit-cart'>Edit Cart</a>


            </div>

            <div className='sb_help_panel'>
                <h3>Need help?</h3>
                <p className="inr inr992"> <FontAwesomeIcon icon={faPhoneAlt} style={{ fontSize: 12, display: 'inline-block', float: 'left', marginTop: 6, marginRight: 6, }} /> <a href="tel:+18669678573"> 1.866.967.8573</a></p>
                <p className="inr inr992 "><FontAwesomeIcon icon={faComment} style={{ fontSize: 12, display: 'inline-block', float: 'left', marginTop: 6, marginRight: 6, }} /><a href="#chat" onClick={toggleChat}> Live Chat</a></p>
                <p className="inr" style={{ marginRight: 0 }}><FontAwesomeIcon icon={faEnvelope} style={{ fontSize: 12, display: 'inline-block', float: 'left', marginTop: 6, marginRight: 6, }} /><a href="mailto:csr@pulseuniform.com"> csr@pulseuniform.com</a></p>
            </div>


            <div className='summaryContainer' style={{ marginTop: 20 }}>
                <Row className='' >
                    <Col>
                        <h5 >ORDER SUMMARY</h5>
                    </Col>
                </Row>
                <Row className='summeryTxt'>
                    <Col xs={8}>Subtotal</Col>
                    <Col xs={4} style={{ textAlign: 'right' }}>{`$${subTotal.toFixed(2)}`}</Col>
                </Row>
                {Object.keys(selectedShippingMethod).length > 0 && <Row className='summeryTxt'>
                    <Col xs={8} >Shipping [{selectedShippingMethod.webname}]</Col>
                    <Col xs={4} style={{ textAlign: 'right' }}>{selectedShippingMethod.PriceAmount == 0 ? 'Free' : `$${selectedShippingMethod.PriceAmount.toFixed(2)}`}</Col>
                </Row>}
                {cookies.get('pu%5Fdiscount') && <Row className='summeryTxt'>
                    <Col xs={8}>My Savings</Col>
                    <Col xs={4} style={{ textAlign: 'right', color: 'red' }}>{`$${parseFloat(cookies.get('pu%5Fdiscount')).toFixed(2)}`}</Col>
                </Row>}
                <Row className='summeryTxt'>
                    <Col xs={8}>Tax <p style={{ fontSize: 10 }}>(only for the state of GA)</p></Col>
                    <Col xs={4} style={{ textAlign: 'right' }}>${georgiaTax.toFixed(2)}</Col>
                </Row>

                <hr />

                <Row className='grandTotal'>
                    <Col style={{ flex: 0.9, fontWeight: 'bold' }}>GRAND TOTAL</Col>
                    <Col style={{ textAlign: 'right', fontWeight: 'bold' }}>{`$${grandTotal.toFixed(2)}`}</Col>
                </Row>

            </div>

            <div className='seals mt-3'>
                <p style={{ fontWeight: 500 }}>Pulse Uniform is verified by:</p>
                <Row>
                    <Col xs={3}>
                        <img src="https://cdn.pulseuniform.com/checkout/images/paypal-new-seal.png" />
                    </Col>
                    <Col xs={4}>
                        <img src="https://cdn.pulseuniform.com/checkout/images/comodo-new-seal.png" />
                    </Col>
                    <Col xs={5}>
                        <img alt="" src="https://cdn.pulseuniform.com/checkout/images/bbb-new-seal.png" />
                    </Col>
                </Row>

            </div>
        </>
    )
}

export default OrderSummaryPart;



// hashcode
// s_fullname
// s_address1
// s_address2
// s_city
// s_state
// s_zip
// s_phone
// s_ext1
// ""
// ""
// s_country
// ""
// s_fax,
//     b_fullname
// b_address1
// b_address2
// b_city
// b_state
// b_zip
// b_phone
// b_ext1
// ""
// ""
// b_country
// ""
// b_fax
// ""
// ""
// ""
// ""
// ""
// ""
// orderamount
// shippingprice
// tax
// shippingtypename,
//     discount
// Convert.ToString(item.VENDORNAME)
// i.ToString()
// Convert.ToString(item.VENDORSTYLECODE)
// Convert.ToString(item.STYLECODE)
// Convert.ToString(item.STYLENAME)
// colorcode
// colorname
// Convert.ToString(item.SIZE)
// Convert.ToString(item.QTY)
// Convert.ToString(item.COST)
// Convert.ToString(item.PRICE)
// Convert.ToString(item.CATEGORYNAME),
//     Convert.ToString(item.PRICE)
// customerid
// fullname
// customerpassword
// customerlogin
// customeremail,
//     customercardid
// card
// cardno.ToString().Replace(" ", "")
// cvc
// month
// expiry
// billingid
// Convert.ToString(item.CATEGORYTYPE)
// rewardspoint
// isclearance
// Convert.ToString(item.RETAILPRICE),
//     Convert.ToString(item.SHOULDER)
// Convert.ToString(item.CHEST)
// Convert.ToString(item.WAIST)
// Convert.ToString(item.CUSTOMSLEEVE)
// Convert.ToString(item.HIP)
// Convert.ToString(item.LENGTH)
// Convert.ToString(item.FLY)
// Convert.ToString(item.CALF)
// Convert.ToString(item.INSEAMCUSTOM)
// Convert.ToString(item.CENTERBACKLENGTH)
// Convert.ToString(item.FABRIC)
// Convert.ToString(item.OPTIONDESCRIPTION1),
//     Convert.ToString(item.OPTIONPRICE1)
// Convert.ToString(item.OPTIONDESCRIPTION2)
// Convert.ToString(item.OPTIONPRICE2)
// Convert.ToString(item.SIZEPRICE)

// Convert.ToString(item.line1)
// Convert.ToString(item.embfontname1)
// Convert.ToString(item.embcolorname1)
// Convert.ToString(item.emblocation1)

// Convert.ToString(item.line2)
// Convert.ToString(item.embfontname2)
// Convert.ToString(item.embcolorname2)
// Convert.ToString(item.emblocation2)

// Convert.ToString(item.line3)
// Convert.ToString(item.embfontname3)
// Convert.ToString(item.embcolorname3)
// Convert.ToString(item.emblocation3)

// Convert.ToString(item.line4)
// Convert.ToString(item.embfontname4)
// Convert.ToString(item.embcolorname4)
// Convert.ToString(item.emblocation4)

// Convert.ToString(item.line5)
// Convert.ToString(item.embfontname5)
// Convert.ToString(item.embcolorname5)
// Convert.ToString(item.emblocation5)

// Convert.ToString(item.EmbPrice)
// Convert.ToString(item.EmbPrice2)
// Convert.ToString(item.EmbPrice3)
// Convert.ToString(item.EmbPrice4)
// Convert.ToString(item.EmbPrice5)

// Convert.ToString(item.EmbInst)
// Convert.ToString(item.logostylename)
// Convert.ToString(item.threadcolorname)
// Convert.ToString(item.locationname)
// Convert.ToString(item.LogoInst)

// Convert.ToString(item.LogoPrice)

// Convert.ToString(item.logostylename2)
// Convert.ToString(item.threadcolorname2)
// Convert.ToString(item.locationname2)

// Convert.ToString(item.LogoPrice2)
// Convert.ToString(item.ISEMB)

// Convert.ToString(item.INSEAMNAME)
// Convert.ToString(item.INSEAMPRICE)


