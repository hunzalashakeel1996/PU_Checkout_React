import logo from './logo.svg';
import './App.css';
import { Container, Button, Row, Col, Form, Alert, Toast} from 'react-bootstrap'
import React, { lazy, Suspense, useEffect, useState } from 'react';
import LoginPart from './components/LoginPart';
import ShippingAddressPart from './components/ShippingAddressPart';
import ShippingMethodPart from './components/ShippingMethodPart';
import PaymentMethodPart from './components/PaymentMethodPart';
import OrderSummaryPart from './components/OrderSummaryPart';
import { login, getCustomerAdress, getShipDays, editOrNewAddress, getCartDetails, placeOrder, createUser, 
  getUSStates, getCanadaStates, getCountries, getGuestCustomerAdress, saveBillingAddress, createGuestUser, 
  editOrNewGuestAddress, removeShipping, updatePassword, placeOrderGuest, saveGuestBillingAddress, 
  makeAddressDefault, forgetPassword } from './DataAction/Checkout';
import { isregistered, isguest, custemail, isnew, PU_Transid, PU_CustomerName, PU_UserID, PU_discount } from './GeneralFunctions/Constants';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const { innerWidth: width, innerHeight: height } = window;
// import { Col, Form, Input, Row, Select, Spin, Upload } from 'antd';

const tempControls = {
  email: '',
  password: '',
  fullName: '',
  address: '',
  apt: '',
  city: '',
  state: '',
  zipCode: '',
  phoneNumber: '',
}

const initialState = {
  isGuest: true,
  subTotal: 0,
  grandTotal: 0,
  controls: { ...tempControls },
  cartDetails: [],
  user: {},
  shippingDays: [],
  selectedAddress: {},
  selectedShippingMethod: {},
  addresses: [],
  isLoading: false,
  isLogin: cookies.get(PU_Transid) ? true : false,
  password: '',
  countries: [],
  usStates: [],
  canadaStates: [],
  georgiaTax: 0.00,
  deleteAddressPopup: false,
  selectedDeletedAddress: '',
  loginError: false,
  isForgetPassword: false,
  forgetPasswordEmail: '',
  isToast: false
}

function App() {

  const [state, setState] = useState({ ...initialState });

  const {
    password, isGuest, isLogin, controls, addresses, selectedAddress,
    isLoading, shippingDays, selectedShippingMethod, user, cartDetails, subTotal, grandTotal, georgiaTax, countries,
    canadaStates, usStates, deleteAddressPopup, selectedDeletedAddress, loginError, isForgetPassword, forgetPasswordEmail, 
    isToast} = state

  window.onbeforeunload = () => {
    // localStorage.setItem('state', JSON.stringify(state))
  }

  useEffect(() => {
    let localStorageState = localStorage.getItem('state') ? { ...JSON.parse(localStorage.getItem('state')) } : { ...state }
    setState({ ...localStorageState, isLoading: true })
    let isGuestLogin = localStorage.getItem('state') ? localStorageState.isGuest : false
    console.log('a2', cookies.get(PU_Transid))
    // let getAddressAPI = localStorageState.isGuest ? getGuestCustomerAdress(JSON.parse(cookies.get(PU_Transid))) : getCustomerAdress(JSON.parse(cookies.get(PU_Transid)))
    if (cookies.get(PU_UserID) === undefined)
    console.log("HELLO WORLD")
      // window.location.replace('https://www.pulseuniform.com/')
    else {
      Promise.all([getCartDetails(cookies.get(PU_UserID)), cookies.get(PU_Transid) && (isGuestLogin ? getGuestCustomerAdress(JSON.parse(cookies.get(PU_Transid))) : getCustomerAdress(JSON.parse(cookies.get(PU_Transid))))]).then(res => {
        console.log('b1', res[0])
        // if cart has no items them navigate to home page 
        if (res[0].length <= 0)
          window.location.replace('https://www.pulseuniform.com/ShoppingCart.asp')

        let tempSubTotal = 0
        res[0].map(cart => {
          tempSubTotal += cart.ItemPrice * cart.QUANTITY
        })

        // tempGrandTotal = cookies.get(PU_discount) ? tempSubTotal - cookies.get(PU_discount) : tempSubTotal
        getShipDays(tempSubTotal).then(shippingDays => {
          console.log('shipping', shippingDays)
          let localStorageState = localStorage.getItem('state') ? { ...JSON.parse(localStorage.getItem('state')) } : { ...state }
          let tempGeorgiaTax = ((res[1] && res[1].length > 0) && res[1][0].STATE === 'Georgia') ? toFixedNumber(((tempSubTotal) * 0.07)) : 0.00

          // select default shipping method 
          let tempShippingMethod = shippingDays[0]
          if (res[1] && res[1].length > 0) {
            if (res[1][0].COUNTRY === 'USA') tempShippingMethod = shippingDays[0]
            else if (res[1][0].COUNTRY === 'Canada') tempShippingMethod = shippingDays[4]
            else tempShippingMethod = shippingDays[5]
          }
          let shippingCharges = tempShippingMethod.PriceAmount ? tempShippingMethod.PriceAmount : 0.00

          if (localStorage.getItem('state') && localStorageState.countries.length > 0) {
            // setState({
            //   ...localStorageState, addresses: res[1] ? res[1] : [], selectedAddress: res[1] ? res[1][0] : {}, georgiaTax: tempGeorgiaTax,
            //   isLoading: false, selectedShippingMethod: shippingDays[0],
            //   shippingDays: shippingDays, cartDetails: res[0], subTotal: toFixedNumber(tempSubTotal),
            //   grandTotal: cookies.get(PU_discount) ? toFixedNumber(tempSubTotal - cookies.get(PU_discount) + tempGeorgiaTax + shippingCharges) : toFixedNumber(tempSubTotal + tempGeorgiaTax + shippingCharges),
            //   countries: [...res[3], { CountryName: 'USA' }, { CountryName: 'Canada' }],
            //   usStates: res[1], canadaStates: res[2]
            // })
            setState({
              ...localStorageState, addresses: res[1] ? res[1] : [], selectedAddress: res[1] ? res[1][0] : {}, georgiaTax: tempGeorgiaTax,
              isLoading: false, selectedShippingMethod: tempShippingMethod, isLogin: res[1] ? true : false,
              shippingDays: shippingDays, cartDetails: res[0], subTotal: toFixedNumber(tempSubTotal),
              grandTotal: cookies.get(PU_discount) ? toFixedNumber(tempSubTotal - cookies.get(PU_discount) + tempGeorgiaTax + shippingCharges) : toFixedNumber(tempSubTotal + tempGeorgiaTax + shippingCharges),
            })
          }
          // if state is not in local storage then get countries 
          else {
            Promise.all([getUSStates(), getCanadaStates(), getCountries()]).then(response => {
              setState({
                ...localStorageState, addresses: res[1] ? res[1] : [], selectedAddress: res[1] ? res[1][0] : {}, georgiaTax: tempGeorgiaTax,
                isLoading: false, selectedShippingMethod: tempShippingMethod, isLogin: res[1] ? true : false,
                shippingDays: shippingDays, cartDetails: res[0], subTotal: toFixedNumber(tempSubTotal),
                grandTotal: cookies.get(PU_discount) ? toFixedNumber(tempSubTotal - cookies.get(PU_discount) + tempGeorgiaTax + shippingCharges) : toFixedNumber(tempSubTotal + tempGeorgiaTax + shippingCharges),
                countries: [...response[2], { CountryName: 'USA' }, { CountryName: 'Canada' }],
                usStates: response[0], canadaStates: response[1]
              })
            })
          }
        })
      })
    }

  }, []);

  const toFixedNumber = (number) => {
    return parseFloat(number.toFixed(2))
  }

  const guestLogin = (values) => {
    cookies.set(custemail, `${values.email}`, { path: '/' });
    // if detatils are not fetched from backend then hit api else don't
    // if (cartDetails.length < 0) {
    setState({ ...state, isLoading: true })

    createGuestUser({ email: `${values.email}`, sessionid: cookies.get(PU_UserID) }).then(res => {
      console.log('a1', res)
      cookies.set(PU_Transid, `${res.Result}`, { path: '/' });
      getCartDetails(cookies.get(PU_UserID)).then(res => {
        let tempSubTotal = 0
        res.map(cart => {
          tempSubTotal += cart.ItemPrice * cart.QUANTITY
        })
        // tempSubTotal = cookies.get(PU_discount) && tempSubTotal - cookies.get(PU_discount)
  
        getShipDays(tempSubTotal).then(shippingDays => {
          setState({ ...state, isLogin: true, isLoading: false, shippingDays: shippingDays, cartDetails: res, subTotal: toFixedNumber(tempSubTotal), grandTotal: cookies.get(PU_discount) ? toFixedNumber(tempSubTotal - cookies.get(PU_discount) + georgiaTax) : toFixedNumber(tempSubTotal + georgiaTax) })
  
        })
      })

    })
    
    // }
  }

  const registerUserLogin = (values) => {
    setState({ ...state, isLoading: true })

    login(values.email, values.password).then(response => {
      if (response.err) {
        setState({ ...state, isLoading: false, loginError: true })
      } else {
        cookies.set(isregistered, '1', { path: '/' });
        cookies.set(isguest, '0', { path: '/' });
        cookies.set(custemail, `${response[0].CUSTOMEREMAIL}`, { path: '/' });
        cookies.set(isnew, `0`, { path: '/' });
        cookies.set(PU_Transid, `${response[0].CUSTOMERID}`, { path: '/' });
        cookies.set(PU_CustomerName, `${response[0].FULLNAME}`, { path: '/' });

        Promise.all([getCustomerAdress(response[0].CUSTOMERID), getCartDetails(cookies.get(PU_UserID))]).then(res => {
          // calculate subTotal 
          let tempSubTotal = 0
          res[1].map(cart => {
            tempSubTotal += cart.ItemPrice * cart.QUANTITY
          })

          let tempGeorgiaTax = res[0][0].STATE === 'Georgia' ? toFixedNumber(((tempSubTotal)) * 0.07) : 0.00
          console.log('test', res[0][0])
          getShipDays(tempSubTotal).then(shippingDays => {
            let temp = { ...controls }
            temp = { ...temp, values }

            // select default shipping method 
            let tempShippingMethod = shippingDays[0]
            if (res[0][0].COUNTRY === 'USA') tempShippingMethod = shippingDays[0]
            else if (res[0][0].COUNTRY === 'Canada') tempShippingMethod = shippingDays[4]
            else tempShippingMethod = shippingDays[5]
            let shippingCharges = tempShippingMethod.PriceAmount ? tempShippingMethod.PriceAmount : 0.00

            setState({
              ...state,
              isLogin: true, controls: { ...controls, ...values }, user: response[0], addresses: res[0],
              isLoading: false, shippingDays: shippingDays, cartDetails: res[1], georgiaTax: tempGeorgiaTax,
              subTotal: toFixedNumber(tempSubTotal), selectedAddress: res[0][0], isGuest: false,
              grandTotal: shippingCharges + tempSubTotal + tempGeorgiaTax - (cookies.get(PU_discount) ? cookies.get(PU_discount) : 0.00),
              // grandTotal: cookies.get(PU_discount) ? toFixedNumber(tempSubTotal - cookies.get(PU_discount) + tempGeorgiaTax) : toFixedNumber(tempSubTotal + tempGeorgiaTax),
              loginError: false, selectedShippingMethod: tempShippingMethod
            })
          })
        })
      }
    })
  }

  const onLogout = () => {
    cookies.remove(isregistered, { path: '/' });
    cookies.remove(isguest, { path: '/' });
    cookies.remove(custemail, { path: '/' });
    cookies.remove(isnew, { path: '/' });
    cookies.remove(PU_Transid, { path: '/' });
    cookies.remove(PU_CustomerName, { path: '/' });
    // cookies.remove(PU_UserID, { path: '/' });
    // reset all states to initial position except those which will be shown even when no user log in (according to design )
    setState({
      ...initialState, isLogin: false, subTotal, grandTotal, georgiaTax, cartDetails, shippingDays,
      selectedShippingMethod, countries, usStates, canadaStates,
    })
    localStorage.removeItem('state')

  }


  const onPlaceOrder = ({ paymentDetails, billingAddress, PO }) => {
    let data = {
      IsGuest: isGuest ? 1 : 0,
      // shipping: { ...selectedAddress },
      // billing: { ...Object.keys(billingAddress).length > 0 ? billingAddress : selectedAddress, BILLINGID: 0 },
      SessionId: JSON.parse(cookies.get(PU_UserID)),
      OrderShipType: selectedShippingMethod.ShippingTypeID,
      OrderAmount: grandTotal,
      OrderShippedAmount: selectedShippingMethod.PriceAmount,
      OrderTaxAmount: georgiaTax,
      L_DeliveryInfo: selectedShippingMethod.webdays !== null ? selectedShippingMethod.webdays : 0,
      Refferer: '',
      payment: { NAME: paymentDetails.name, CARDNO: paymentDetails.cardNumber, MONTH: paymentDetails.cardMonth, YEAR: paymentDetails.cardYear, CVC: paymentDetails.cardSecurity, TYPE: paymentDetails.TYPE },
      CreditCard: paymentDetails.name !== '' ? 1 : 0,
      Discount: cookies.get(PU_discount) ? cookies.get(PU_discount) : 0.00,
      PO: PO,
      P_IsTracking: selectedShippingMethod.shippingday === "No Tracking" ? 0 : 1,
      P_RewardPoints: 0,
      // ShippingId: selectedAddress.SHIPPINGID,
      CustomerId: JSON.parse(cookies.get(PU_Transid)),
    }
    console.log('geust', isGuest)
    // setState({ ...state, isLoading: true })
    
    // if if user didn't select shipping methid 
    if (Object.keys(selectedShippingMethod).length <= 0 || Object.keys(paymentDetails).length <= 0) {
      alert('Please fill all required values')
    }
    // if user is registered user
    else if (!isGuest) {
      let tempBillingAddress = { ...Object.keys(billingAddress).length > 3 ? billingAddress : selectedAddress, BILLINGID: 0, CUSTOMERID: JSON.parse(cookies.get(PU_Transid)) }

      console.log('plkace order 1', data)
      console.log('billingAddress', tempBillingAddress)
      saveBillingAddress({ ...tempBillingAddress, FULLNAME: tempBillingAddress.FULLNAME ? `${tempBillingAddress.FULLNAME}` : `${tempBillingAddress.FIRSTNAME}_${tempBillingAddress.LASTNAME}` }).then(res => {
        placeOrder({ ...data, BillingId: res.BillingID, }).then(res => {
          console.log('place order respose', res)
          cookies.set('IsOrder', '1', { path: '/' });
          localStorage.removeItem('state')
          setState({ ...state, isLoading: false })
          // window.location.replace(data.CreditCard === 1 ? `https://www.pulseuniform.com/checkout/orderconfirm8.asp?o_id=${res}` : `https://www.pulseuniform.com/checkout/thankyoupaypal8.asp`)

        })

      })
    }
    // if user select guest checkout
    else {
      let tempBillingAddress = { ...Object.keys(billingAddress).length > 2 ? billingAddress : selectedAddress, BILLINGID: 0, CUSTOMERID: JSON.parse(cookies.get(PU_Transid)) }
      console.log('plkace order 1', data)
      console.log('billingAddress', tempBillingAddress)

      saveGuestBillingAddress({ ...tempBillingAddress, FULLNAME: tempBillingAddress.FULLNAME ? `${tempBillingAddress.FULLNAME}` : `${tempBillingAddress.FIRSTNAME}_${tempBillingAddress.LASTNAME}` }).then(res => {
        // if user did provide password than first create its account than place an order 
        if (password.length > 0) {

          placeOrderGuest({ ...data, BillingId: res.BillingID, }).then(res => {
            console.log('place order respose', res)
            cookies.set('IsOrder', '1', { path: '/' });

            localStorage.removeItem('state')
            setState({ ...state, isLoading: false })
            window.location.replace(data.CreditCard === 1 ? `https://www.pulseuniform.com/checkout/orderconfirm8.asp?o_id=${res}` : `https://www.pulseuniform.com/checkout/thankyoupaypal8.asp`)
          })

        }
        // if user didn't provide password then just place order 
        else {
          console.log('plkace order', data)
          placeOrderGuest({ ...data, BillingId: res.BillingID, }).then(res => {
            console.log('place order respose', res)
            localStorage.removeItem('state')
            cookies.set('IsOrder', '1', { path: '/' });

            setState({ ...state, isLoading: false })
            updatePassword({ CUSTOMERID: JSON.parse(cookies.get(PU_Transid)), NEWPASSWORD: password, OLDPASSWORD: 'guest' })
            window.location.replace(data.CreditCard === 1 ? `https://www.pulseuniform.com/checkout/orderconfirm8.asp?o_id=${res}` : `https://www.pulseuniform.com/checkout/thankyoupaypal8.asp`)
          })
        }
      })
    }

  }

  // method when address change  
  const onAddressChange = (value, ChangeAddresses) => {
    let defaultShippingMethod = {}
    if (value.COUNTRY === 'USA') defaultShippingMethod = shippingDays[0]
    else if (value.COUNTRY === 'Canada') defaultShippingMethod = shippingDays[4]
    else defaultShippingMethod = shippingDays[5]

    // if state is georgia than apply tax else not 
    let tempGeorgiaTax = value.STATE === "Georgia" ? toFixedNumber(((subTotal)) * 0.07) : 0.00

    let tempGrandTotal = 0
    tempGrandTotal = subTotal + defaultShippingMethod.PriceAmount
    tempGrandTotal = cookies.get(PU_discount) ? tempGrandTotal - cookies.get(PU_discount) + tempGeorgiaTax : tempGrandTotal + tempGeorgiaTax

    setState({ ...state, selectedAddress: { ...value }, selectedShippingMethod: defaultShippingMethod, grandTotal: toFixedNumber(tempGrandTotal), georgiaTax: tempGeorgiaTax, addresses: ChangeAddresses ? ChangeAddresses : addresses })

  }

  // method when shipping method change 
  const onShipMethodChange = (value) => {
    let tempGeorgiaTax = selectedAddress.STATE === "Georgia" ? toFixedNumber((subTotal) * 0.07) : 0.00

    let tempGrandTotal = subTotal + value.PriceAmount
    tempGrandTotal = cookies.get(PU_discount) ? tempGrandTotal + tempGeorgiaTax - cookies.get(PU_discount) : tempGrandTotal + tempGeorgiaTax
    setState({ ...state, selectedShippingMethod: value, grandTotal: toFixedNumber(tempGrandTotal), georgiaTax: tempGeorgiaTax })
  }

  // when user finish on editing or creating their address 
  const onAddressEditComplete = (value, isDefault) => {
    // combine first and last name into fullname
    value = { ...value, FULLNAME: `${value.FIRSTNAME}_${value.LASTNAME}` }
    let temp = [...addresses]
    temp[value.index ? value.index : 0] = { ...value, USETHIS: isDefault ? 1 : 0 }

    if (isGuest) {
      // if addresses length is 0 that means user add new address so first create account of that user than create address
      if (addresses.length <= 0) {
        console.log('a2', value)
        // api create user (email, session id)
        if (cookies.get(custemail)) {
          // createGuestUser({ email: cookies.get(custemail), sessionid: cookies.get(PU_UserID) }).then(res => {
          //   console.log('a1', res)
          //   cookies.set(PU_Transid, `${res.Result}`, { path: '/' });
          //   // //save address in given id
         

          // })
             editOrNewGuestAddress({ ...value, CUSTOMERID: cookies.get(PU_Transid) })
            onAddressChange(temp[value.index ? value.index : 0], temp)
        }
        else {
          alert('Please Login to your account first')
        }
      }
      else {
        editOrNewGuestAddress(value)
        onAddressChange(temp[value.index ? value.index : 0], temp)
      }

    } else {
      editOrNewAddress(value).then(res => {
        if (isDefault) {
          console.log('address res', res)
          makeAddressDefault({ CUSTOMERID: cookies.get(PU_Transid), SHID: res.ShippingId === null ? value.SHIPPINGID : res.ShippingId })
        }
      })
      onAddressChange(temp[value.index ? value.index : 0], temp)
    }
  }

  const onAddressDelete = () => {
    removeShipping(selectedDeletedAddress.SHIPPINGID).then(res => {
      let tempAddress = [...addresses]
      let index = tempAddress.findIndex(value => value.SHIPPINGID === selectedDeletedAddress.SHIPPINGID)
      console.log('a', tempAddress)
      tempAddress.splice(index, 1)
      console.log('b', tempAddress)
      setState({ ...state, addresses: tempAddress, deleteAddressPopup: false, selectedDeletedAddress: '' })
    })
  }

  const forgetPasswordMethod = () => {
    forgetPassword(forgetPasswordEmail); 
    setState({ ...state, isForgetPassword: false, isToast: true });
    setTimeout(() => {setState({...state, isToast: false, isForgetPassword: false,})},3000)
  }

  return (
    <>
    {/* ============================================ Modals =============================================== */}
      {isLoading && <div style={{ width: '100%', height: '100%', position: 'fixed', zIndex: 20, display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '100%', height: '100vh', backgroundColor: 'black', position: 'absolute', opacity: 0.4 }}></div>
        <img src="./img/loader-gif.gif" style={{ width: 300, height: 50, zIndex: 100 }} />
      </div>}

      {isToast&&
      <Toast style={{position: 'absolute', marginTop: 80, zIndex: 100, backgroundColor: 'white', right: 20}} onClose={() => {setState({...state, isToast: false})}}>
        <Toast.Header>
          <img src="./favicon-96x96.png" style={{ width: 25, height: 25, marginRight: 10}} />
          <strong >Forget Password</strong>
          <small></small>
        </Toast.Header>
        <Toast.Body>password will be sent to your email address</Toast.Body>
      </Toast>}

      {deleteAddressPopup && <div style={{ width: '100%', height: '100%', position: 'fixed', zIndex: 20, display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '100%', height: '100vh', backgroundColor: 'black', position: 'absolute', opacity: 0.4 }}></div>
        <Alert show={true} variant="secondary">
          {/* <Alert.Heading>How's it going?!</Alert.Heading> */}
          <p>
            Are you sure, you want to delete the address?
              </p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button variant="light" style={{ marginRight: 10 }} onClick={() => { setState({ ...state, deleteAddressPopup: false, selectedDeletedAddress: '' }) }}>
              Cancel
                </Button>
            <Button variant="danger" onClick={onAddressDelete}>
              Confirm
                </Button>
          </div>
        </Alert>
      </div>}

      {isForgetPassword &&
        <div style={{ width: '100%', height: '100%', position: 'fixed', zIndex: 20, display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '100%', height: '100vh', backgroundColor: 'black', position: 'absolute', opacity: 0.4 }}></div>
          <Alert show={true} variant="secondary" className={'alertCustm'}>
            <Row>
              <Col xs={12}>
                <h5>Reset your password</h5>
                <hr />
              </Col>
            </Row>

            <Row>
              <Col xs={12}>
                <Form.Control onChange={(e) => {setState({...state, forgetPasswordEmail: e.target.value})}} className='inputFieldContainer p-2 mb-2' type="email" placeholder="Enter email" name='email' />
              </Col>
              <Col xs={12} >
                <p style={{ fontStyle: 'italic' }}>password will be sent to your email address</p>
              </Col>
              <Col xs={6} className='pr-1'>
                <Button
                  onClick={() => { setState({ ...state, isForgetPassword: false }) }}
                  className={'borderButton btn btn-outline-primary btn-block'}
                  block style={{ backgroundColor: '#fff' }}>Cancel</Button>
              </Col>

              <Col xs={6} className='pl-1'>
                <Button
                  onClick={() => { forgetPasswordMethod()}}
                  className={'fillButton'}
                  block>Submit</Button>
              </Col>
            </Row>
          </Alert>
        </div>
      }

{/* ================================================ Container of all components =========================== */}
      <Container fluid style={{ backgroundColor: '#052355', padding: '10px 0', }}>

        <Container>

          <Row style={{ minHeight: 50, }} className='justify-content-center justify-content-sm-start'>

            {/* <Row> */}
            <Col xs={12} sm={6} md={4} lg={3} style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }} className='justify-content-center justify-content-sm-start ml-auto'>
              {/* <img alt="logo" className="brand-logo mb-2 mb-sm-0" style={{ height: 30 }} src="https://cdn.pulseuniform.com/images/logo17-3.png" /> */}
              <a href={'https://www.pulseuniform.com/'}><img src="./img/logo.png" className="brand-logo mb-2 mb-sm-0" style={{ height: 30 }} /></a>
            </Col>
            <Col xs={'auto'} sm={4} md={5} lg={6} className='secureBorder' style={{ display: 'flex', alignItems: 'center' }}>
              <h5 style={{ color: 'white', marginBottom: 0, fontWeight: '400', }}>Secure Checkout</h5>
            </Col>
            <Col xs={'auto'} sm={2} md={3} style={{ display: 'flex', alignItems: 'center', fill: 'white', justifyContent: 'flex-end', }} className='pl-0'>
              <svg style={{ width: 30, height: 30, float: 'right', }} xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Lock Closed</title><path d='M368 192h-16v-80a96 96 0 10-192 0v80h-16a64.07 64.07 0 00-64 64v176a64.07 64.07 0 0064 64h224a64.07 64.07 0 0064-64V256a64.07 64.07 0 00-64-64zm-48 0H192v-80a64 64 0 11128 0z' /></svg>
            </Col>

          </Row>
        </Container>


      </Container>

      <Container className='windowContainer' >

        <Row className='mainContainer'>
          {/* information part  */}
          <Col md={7} lg={8} >
            {/* first part  */}
            <LoginPart
              onLoginClick={isGuest ? guestLogin : registerUserLogin}
              isLogin={isLogin}
              onGuestButtonClick={(val) => { setState({ ...state, isGuest: val }) }}
              isGuest={isGuest}
              isLoading={isLoading}
              loginError={loginError}
              onForgetPassword={() => { setState({ ...state, isForgetPassword: !isForgetPassword }) }} />

            {/* email address part  */}
            {(isLogin) && 
            <div className='informationContainer' style={{ marginTop: 20, backgroundColor: '#f7f8fc', }}>
              <Col className='p-0'>
                <Row className='textContainer'>

                  <Col xs={12} sm={6}>
                    <h5 className='mb-0' >EMAIL ADDRESS</h5>
                  </Col>

                  <Col xs={12} sm={6} style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }} className='justify-content-start justify-content-sm-end'>
                    <Button className='borderButton' style={{ textAlign: 'right', color: '#1a2651', border: 'none', padding: 0, backgroundColor: 'rgb(247, 248, 252)' }} onClick={onLogout}>Not you? Signout</Button>
                  </Col>

                </Row>

                <Col className='textContainer mt-1' >
                  <p className='mb-2'>{cookies.get(custemail)}</p>
                </Col>

              </Col>

            </div>}

            {/* shpping address part  */}
            {<ShippingAddressPart isGuest={isGuest} onAddressDelete={(address) => { setState({ ...state, deleteAddressPopup: true, selectedDeletedAddress: address }) }} selectedAddress={selectedAddress} countries={countries} canadaStates={canadaStates} usStates={usStates} onAddressEditComplete={onAddressEditComplete} onAddressChange={onAddressChange} addresses={addresses} />}

            {/* shipping method part  */}
            {<ShippingMethodPart selectedShippingMethod={selectedShippingMethod} onShipMethodChange={onShipMethodChange} selectedAddress={selectedAddress} shippingDays={shippingDays} />}

            {/* payment method part  */}
            {<PaymentMethodPart selectedAddress={selectedAddress} isLogin={isLogin} grandTotal={grandTotal} countries={countries} canadaStates={canadaStates} usStates={usStates} onPlaceOrder={onPlaceOrder} />}

            {/* fourth part  */}
            {(isGuest && isLogin) && <Row className='informationContainer' style={{ marginTop: 20, marginBottom: 20 }}>
              <Col className='buttonsContainer'>
                <h5 >ENTER PASSWORD TO CREATE AN ACCOUNT</h5>
                <Form className='emailFormContainer'>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Control onChange={(e) => { setState({ ...state, password: e.target.value }) }} className='inputFieldContainer' type="password" placeholder="Password" />
                  </Form.Group>
                </Form>
              </Col>
            </Row>}

          </Col>

          {/* summary part */}
          {(cartDetails.length > 0) && <Col md={5} lg={4}>
            <OrderSummaryPart georgiaTax={georgiaTax} subTotal={subTotal} grandTotal={grandTotal} cartDetails={cartDetails} user={user} selectedShippingMethod={selectedShippingMethod} />
          </Col>}
        </Row>
      </Container>

      <Container>
        <div className="checkout_footer">
          <div className="clearfix">
            <div className="footer_nav">
              <ul className="clearfix">
                <li><a href="https://www.pulseuniform.com/faqs.asp">FAQ's</a></li>
                <li>|</li>
                <li><a href="https://www.pulseuniform.com/CustomerService.asp">Help</a></li>
                <li>|</li>
                <li><a href="https://www.pulseuniform.com/Return-Exchange.asp">Easy Exchange</a></li>
                <li>|</li>
                <li><a href="https://www.pulseuniform.com/Shipping-Handling.asp">Shipping and Handling</a></li>
                <li>|</li>
                <li><a href="https://www.pulseuniform.com/aboutus.asp">About Us</a></li>
                <li>|</li>
                <li><a href="https://www.pulseuniform.com/PrivacyPolicy.asp">Policies</a></li>
              </ul>
            </div>
            <div className="footer_rights">{new Date().getFullYear()} Pulse Uniform All Rights Reserved</div>
          </div>
        </div>
      </Container>
    </>
  );
}

export default App;