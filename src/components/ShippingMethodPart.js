import './style.css';
import { Container, Button, Row, Col, Form } from 'react-bootstrap'
import React, { lazy, Suspense, useEffect, useState } from 'react'

function ShippingMethodPart(props) {
  const { isGuest, isLogin, selectedAddress, shippingDays, onShipMethodChange, selectedShippingMethod} = props
  const [state, setState] = useState({
    validated: false,
  });

  
  // useEffect(() => {
  //   let tempSelectedShip = selectedAddress.COUNTRY=='USA'?shippingDays[0]:selectedAddress.COUNTRY=='Canada'?shippingDays[5]:shippingDays[6]
  //   setState({...state, selectedShippingMethod: {...tempSelectedShip}})
  // }, [selectedAddress]);

  const handleSubmit = (event) => {
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
      props.onLoginClick(formDataObj)
    }
    setState({ ...state, validated: true });
  };

  const onShippingMethodChange = (shippingMethod) => {
    onShipMethodChange(shippingMethod)
    setState({...state, selectedShippingMethod: shippingMethod})
  }

  return (
    <Row className='informationContainer' style={{ marginTop: 20 }}>
      <div className='textContainer'>
      <Col xs={12} >
        <h5 >SHIPPING METHOD</h5>
        </Col>
      </div>
      <Col xs={12} >
      {
        (selectedAddress.COUNTRY === 'USA' || Object.keys(selectedAddress).length <= 0) ?
          <Row className='textContainer'>
            
              {shippingDays.map((shippingDay, i) => (
                i < 4 &&
                <button onClick={() => {onShippingMethodChange(shippingDay)}} className={shippingDay.ShippingTypeID==selectedShippingMethod.ShippingTypeID?'shippingMethodContainerFill':'shippingMethodContainerBorder'}>
                  <div className='methodLeft'>
                  <p className={`${shippingDay.ShippingTypeID==selectedShippingMethod.ShippingTypeID?'shippingMethodFontWhite':'shippingMethodFontBlack'}`} style={{ fontSize: 14, fontWeight:500, }} >BETWEEN</p>
                  <p className={`dIB ${shippingDay.ShippingTypeID==selectedShippingMethod.ShippingTypeID?'shippingMethodFontWhite':'shippingMethodFontBlack'}`} style={{ fontSize: 16, fontWeight:500, }}>{shippingDay.DateFrom}</p>
                  <p className={`dIB ${shippingDay.ShippingTypeID==selectedShippingMethod.ShippingTypeID?'shippingMethodFontWhite':'shippingMethodFontBlack'}`} style={{ fontSize: 12, fontWeight:500, }}>and</p>
                  <p className={`dIB horizentlBorder ${shippingDay.ShippingTypeID==selectedShippingMethod.ShippingTypeID?'shippingMethodFontWhite':'shippingMethodFontBlack '}`} style={{ fontSize: 16, fontWeight:500, borderBottomStyle: 'solid', borderBottomWidth: 1, paddingBottom:'8px', width:'70px', clear:'both', margin:'auto', marginBottom:'8px', }}>{shippingDay.DateTo}</p>
                  </div>

                  <div className='methodRight'>
                  <p className={shippingDay.ShippingTypeID==selectedShippingMethod.ShippingTypeID?'shippingMethodFontWhite':'shippingMethodFontBlack'} style={{ fontSize: 19, fontWeight:500,}}>{shippingDay.PriceAmount === 0 ? 'Free': `$${shippingDay.PriceAmount}`}</p>
                  <p className={shippingDay.ShippingTypeID == selectedShippingMethod.ShippingTypeID ? 'shippingMethodFontWhite' : 'shippingMethodFontBlack'} style={{ fontSize: 15, fontWeight:500, }}>{shippingDay.webname}</p>
                  <p className={shippingDay.ShippingTypeID == selectedShippingMethod.ShippingTypeID ? 'shippingMethodFontWhite' : 'shippingMethodFontBlack'} style={{ fontSize: 12 }}>{shippingDay.webdescription}</p>
                  </div>
                </button>
              ))}
              
          </Row>
          :
          selectedAddress.COUNTRY === 'Canada' ?
            <Row className='textContainer'>
              <button className='shippingMethodContainerFill'>
              <div className='methodLeft'>
                <p className="shippingMethodFontWhite" style={{ fontSize: 14, fontWeight:500, }} >BETWEEN</p>
                <p className="shippingMethodFontWhite" style={{ fontSize: 16, fontWeight:500, }}>{shippingDays[4].DateFrom}</p>
                <p className="shippingMethodFontWhite" style={{ fontSize: 12, fontWeight:500, }}>and</p>
                <p className="shippingMethodFontWhite horizentlBorder" style={{ fontSize: 16, fontWeight:500, borderBottomStyle: 'solid', borderBottomWidth: 1, paddingBottom:'8px', width:'70px', clear:'both', margin:'auto', marginBottom:'8px', }}>{shippingDays[4].DateTo}</p>
                </div>

                <div className='methodRight'>
                <p className="shippingMethodFontWhite" style={{ fontSize: 19, fontWeight:500,}}>{shippingDays[4].PriceAmount === 0 ? 'Free': `$${shippingDays[4].PriceAmount}`}</p>
                <p className="shippingMethodFontWhite" style={{ fontSize: 15, fontWeight:500, }}>{shippingDays[4].webname}</p>
                <p className="shippingMethodFontWhite" style={{ fontSize: 12 }}>{shippingDays[4].webdescription}</p>
                </div>
              </button>
            </Row>
            :
            Object.keys(selectedAddress).length > 0 ?
              <Row className='textContainer'>
                <button className='shippingMethodContainerFill'>
                <div className='methodLeft'>
                  <p className="shippingMethodFontWhite" style={{ fontSize: 14, fontWeight:500, }} >BETWEEN</p>
                  <p className="shippingMethodFontWhite" style={{ fontSize: 16, fontWeight:500, }}>{shippingDays[5].DateFrom}</p>
                  <p className="shippingMethodFontWhite" style={{ fontSize: 12, fontWeight:500, }}>and</p>
                  <p className="shippingMethodFontWhite horizentlBorder" style={{ fontSize: 16, fontWeight:500, borderBottomStyle: 'solid', borderBottomWidth: 1, paddingBottom:'8px', width:'70px', clear:'both', margin:'auto', marginBottom:'8px', }}>{shippingDays[5].DateTo}</p>
                  </div>
                  <div className='methodRight'>
                  <p className="shippingMethodFontWhite" style={{ fontSize: 19, fontWeight:500,}}>{shippingDays[5].PriceAmount === 0 ? 'Free': `$${shippingDays[5].PriceAmount}`}</p>
                  <p className="shippingMethodFontWhite" style={{ fontSize: 15, fontWeight:500, }}>{shippingDays[5].webname}</p>
                  <p className="shippingMethodFontWhite" style={{ fontSize: 12 }}>{shippingDays[5].webdescription}</p>
                  </div>

                </button>
              </Row>
              :
              <Row>

              </Row>
      }

</Col>

    </Row>
  )
}

export default ShippingMethodPart;

// <button className='shippingMethodContainerFill'>
// <p className="shippingMethodFontWhite">BETWEEN</p>
// <p className="shippingMethodFontWhite">{shippingDay.DateFrom}</p>
// <p className="shippingMethodFontWhite" style={{ fontSize: 12 }}>and</p>
// <p className="shippingMethodFontWhite" style={{ borderBottomStyle: 'solid', borderBottomWidth: 1 }}>{shippingDay.DateTo}</p>
// <p className="shippingMethodFontWhite" style={{ fontSize: 14 }}>${shippingDay.ActualRate}</p>
// <p className="shippingMethodFontWhite" style={{ fontSize: 14 }}>{shippingDay.webname}</p>
// <p className="shippingMethodFontWhite" style={{ fontSize: 12 }}>{shippingDay.webdescription}</p>
// </button>
// <button className='shippingMethodContainerBorder'>
//                 <p className="shippingMethodFontBlack" >FRIDAY</p>
//                 <p className="shippingMethodFontBlack" style={{ fontSize: 29 }}>4</p>
//                 {/* <p style={{  fontSize: 12 }}>and</p> */}
//               <p className="shippingMethodFontBlack" style={{ borderBottomStyle: 'solid', borderBottomWidth: 1 }}>FEB</p>
//               <p className="shippingMethodFontBlack" style={{ fontSize: 14 }}>$4.90</p>
//               <p className="shippingMethodFontBlack" style={{ fontSize: 14 }}>BOOKING</p>
//               <p className="shippingMethodFontBlack" style={{ fontSize: 12 }}>with text</p>
//             </button>
//             <button className='shippingMethodContainerBorder'>
//               <p className="shippingMethodFontBlack" >THURSDAY</p>
//               <p className="shippingMethodFontBlack" style={{ fontSize: 29 }}>10</p>
//               {/* <p style={{  fontSize: 12 }}>and</p> */}
//               <p className="shippingMethodFontBlack" style={{ borderBottomStyle: 'solid', borderBottomWidth: 1 }}>JAN</p>
//               <p className="shippingMethodFontBlack" style={{ fontSize: 14 }}>$4.90</p>
//               <p className="shippingMethodFontBlack" style={{ fontSize: 14 }}>BOOKING</p>
//               <p className="shippingMethodFontBlack" style={{ fontSize: 12 }}>with text</p>
//             </button>
//             <button className='shippingMethodContainerBorder'>
//               <p className="shippingMethodFontBlack" >FRIDAY</p>
//               <p className="shippingMethodFontBlack" style={{ fontSize: 29 }}>4</p>
//               {/* <p style={{  fontSize: 12 }}>and</p> */}
//               <p className="shippingMethodFontBlack" style={{ borderBottomStyle: 'solid', borderBottomWidth: 1 }}>FEB</p>
//               <p className="shippingMethodFontBlack" style={{ fontSize: 14 }}>$4.90</p>
//               <p className="shippingMethodFontBlack" style={{ fontSize: 14 }}>BOOKING</p>
//               <p className="shippingMethodFontBlack" style={{ fontSize: 12 }}>with text</p>
//             </button>