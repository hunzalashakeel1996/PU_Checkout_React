import './style.css';
import {
  Container,
  Button,
  Row,
  Col,
  Form,
  InputGroup,
  Alert
} from 'react-bootstrap'
import React, {
  lazy,
  Suspense,
  useEffect,
  useState,
  Component,
  useRef
}
  from 'react'
import InputMask from 'react-input-mask';
import { getUSStates, getCanadaStates, getCountries } from '../DataAction/Checkout';
import Cookies from 'universal-cookie';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashAlt, } from '@fortawesome/free-solid-svg-icons'


const cookies = new Cookies();

function ShippingAddressPart(props) {
  const { isGuest, addresses, onAddressChange, onAddressEditComplete, countries, canadaStates, usStates, selectedAddress, onAddressDelete } = props
  let innerRef = useRef();

  const [state, setState] = useState({
    validated: false,
    addOrEditAddress: false,
    editSelectedAddress: { STREETADDRESS2: '', COUNTRY: "USA" },
    isDefaultAddress: false
  });
  const { addOrEditAddress, editSelectedAddress, validated, isDefaultAddress } = state

  // useEffect(() => {
  //   Promise.all([getUSStates(), getCanadaStates(), getCountries()]).then(data => {
  //     console.log('countries', data)
  //     setState({ ...state, countries: [...data[2], {CountryName: 'USA'}, {CountryName: 'Canada'}], usStates: data[0], canadaStates: data[1] })
  //   })
  // }, []);

  const onAddressEditOrCreateComplete = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false || editSelectedAddress.COUNTRY === '' || editSelectedAddress.STATE === '') {
      event.preventDefault();
      event.stopPropagation();
      setState({ ...state, validated: true })
    } else {
      event.preventDefault()
      const formData = new FormData(event.target)
      const formDataObj = Object.fromEntries(formData.entries())
      // onAddressEditComplete
      document.getElementById("addNewAddress").reset();
      onAddressEditComplete(editSelectedAddress, isDefaultAddress)
      setState({ ...state, validated: false, addOrEditAddress: false });
    }
  };

  const onAddressEdit = (value, index) => {
    value = Object.keys(value).length > 0 ? { ...value, FIRSTNAME: value.FULLNAME.split('_')[0], LASTNAME: value.FULLNAME.split('_')[1], CUSTOMERID: cookies.get('PU%5FTransid') } : { ...value, SHIPPINGID: 0, CUSTOMERID: cookies.get('PU%5FTransid'), STREETADDRESS2: '', PHONE1: '', COUNTRY: "USA" }
    setTimeout(() => {
      innerRef.current.focus();
      innerRef.current.scrollIntoView();
      // window.location ='https://www.pulseuniform.com/payout/#addNewAddress '
      window.location = 'http://localhost:3000/#addNewAddress '
    }, 2)

    setState({ ...state, addOrEditAddress: true, editSelectedAddress: { ...value, index }, isDefaultAddress: value.USETHIS === 1 ? true : false })
  }

  const onFormValueChange = (value, objectName) => {
    let temp = { ...editSelectedAddress }
    temp[objectName] = value
    setState({ ...state, editSelectedAddress: temp })
  }

  const onCountryOrStateChange = (value, name) => {
    setState({ ...state, editSelectedAddress: { ...editSelectedAddress, [name]: value, STATE: name === 'COUNTRY' ? '' : value } })
  }

  return (
    <Row className='informationContainer' style={{ marginTop: 20 }}>
      <div className='textContainer row'>
        <Col xs={8} md={8} lg={8} >
          <h5> SHIPPING ADDRESS </h5>
        </Col>
        {(!isGuest && addresses.length > 0) && <Col xs={4} md={4} lg={4} className=' pl-0 pl-sm-3'>
          <a style={{ color: 'rgba(9, 22, 87)', cursor: 'pointer', fontWeight: '600', float: 'right', border: 'solid 2px', padding: '4px 8px', fontSize: 15, }} onClick={(e) => { onAddressEdit({}, addresses.length); }} > Add New </a>
        </Col>}
      </div>
      {addresses.length > 0 && <Row className='ml-0 mr-0' style={{ pointerEvents: addOrEditAddress ? 'none' : null, opacity: addOrEditAddress ? 0.5 : null, marginTop: 10, width: '100%', }}>
        {addresses.map((address, i) => (
          <>
            <Col xs={6} md={4} lg={3}>
              {console.log('address', address.FULLNAME)}
              <Row>
                <Col>
                  < input id={`multiAddress${i + 1}`} checked={selectedAddress.SHIPPINGID === address.SHIPPINGID} onChange={() => { onAddressChange(address) }} style={{ marginLeft: 30, }} type="radio" name="gender" className='radioCustm' />
                  <label for={`multiAddress${i + 1}`} style={{ margin: '-24px 0 0 0', cursor: 'pointer', }} >

                    <div className='AddressIcon'>
                      {address.FULLNAME.split('_')[0][0].toUpperCase()}{address.FULLNAME.split('_')[1] && address.FULLNAME.split('_')[1][0].toUpperCase()}
                      <a style={{ color: 'blue', cursor: 'pointer', }} onClick={(e) => { onAddressEdit(address, i) }} className='addresEdit' > <FontAwesomeIcon icon={faEdit} /></a>
                      {addresses.length > 1 &&
                        < a style={{ color: 'blue', cursor: 'pointer' }} onClick={(e) => { onAddressDelete(address, i) }} className='addresDelete'> <FontAwesomeIcon icon={faTrashAlt} /> </a>
                      }
                    </div>
                    < p style={{ textAlign: 'center', fontWeight: '500', fontSize: 15, }}> {address.FULLNAME.split('_')[0]} {address.FULLNAME.split('_')[1]}, {address.STREETADDRESS1}, {address.STATE}, {address.CITY}, {address.COUNTRY} </p>
                  </label>
                </Col>
              </Row>
            </Col>
          </>
        ))}
      </Row>}

      {(addOrEditAddress || Object.keys(selectedAddress).length <= 0) && <Form className='emailFormContainer' style={{ marginTop: 0 }} noValidate validated={state.validated} onSubmit={onAddressEditOrCreateComplete} id='addNewAddress'>
        <Row className='buttonsContainer mt-0' >
          <Form.Group controlId="formBasicEmail" as={Col} xs="12">
            {/* <Form.Control required className='inputFieldContainer' type="text" placeholder="Full Name" name='FULLNAME' onChange={(e) => {onFormValueChange(e.target.value, 'FULLNAME')}} value={editSelectedAddress.FULLNAME && `${editSelectedAddress.FULLNAME.split("_")[0]} ${editSelectedAddress.FULLNAME.split("_")[1]}`} />
            <Form.Control.Feedback type="invalid">Name is required</Form.Control.Feedback> */}
            <Row>
              <Col xs={12} sm={6} md={6}>
                <Form.Control ref={innerRef} required style={{ marginTop: 10 }} className='inputFieldContainer' type="text" placeholder="First Name" name='FIRSTNAME' onChange={(e) => { onFormValueChange(e.target.value, 'FIRSTNAME') }} value={editSelectedAddress.FIRSTNAME && editSelectedAddress.FIRSTNAME} />
                <Form.Control.Feedback type="invalid">First Name is required</Form.Control.Feedback>
              </Col>
              <Col xs={12} sm={6} md={6}>
                <Form.Control required style={{ marginTop: 10 }} className='inputFieldContainer' type="text" placeholder="Last Name" name='LASTNAME' onChange={(e) => { onFormValueChange(e.target.value, 'LASTNAME') }} value={editSelectedAddress.LASTNAME && editSelectedAddress.LASTNAME} />
                <Form.Control.Feedback type="invalid"> Last Name is required </Form.Control.Feedback>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={8} md={8}>
                <Form.Control required style={{ marginTop: 10 }} className='inputFieldContainer' type="text" placeholder="Shipping Address" name='STREETADDRESS1' onChange={(e) => { onFormValueChange(e.target.value, 'STREETADDRESS1') }} value={editSelectedAddress.STREETADDRESS1 && editSelectedAddress.STREETADDRESS1} />
                <Form.Control.Feedback type="invalid">Address is required</Form.Control.Feedback>
              </Col>
              <Col xs={12} sm={4} md={4}>
                <Form.Control style={{ marginTop: 10 }} className='inputFieldContainer' type="text" placeholder="Apt/Unit (optional)" name='STREETADDRESS2' onChange={(e) => { onFormValueChange(e.target.value, 'STREETADDRESS2') }} value={editSelectedAddress.STREETADDRESS2 && editSelectedAddress.STREETADDRESS2} />
                <Form.Control.Feedback type="invalid"> Apt / Unit is required </Form.Control.Feedback>
              </Col>
            </Row>
            {/* <Form.Control required style={{ marginTop: 10, paddingRight: 5 }} className='inputFieldContainer' type="text" placeholder="Town/City" name='city' value={editSelectedAddress.CITY && editSelectedAddress.CITY} />
            <Form.Control.Feedback type="invalid">Town/City is required </Form.Control.Feedback> */}

            <Row>


              <Col>

                <Form.Control required style={{ marginTop: 10 }} className='inputFieldContainer' type="text" placeholder="Town/City" name='CITY' onChange={(e) => { onFormValueChange(e.target.value, 'CITY') }} value={editSelectedAddress.CITY && editSelectedAddress.CITY} />
                <Form.Control.Feedback type="invalid">Town/City is required </Form.Control.Feedback>

              </Col>
              <Col>
                {(editSelectedAddress.COUNTRY === 'USA' || editSelectedAddress.COUNTRY === 'Canada') ?
                  <>
                    <Select
                      // value={selectedOption}
                      value={editSelectedAddress.STATE && { value: editSelectedAddress.STATE, label: editSelectedAddress.STATE }}
                      placeholder='Select State'
                      style={{ border: 0, }}
                      onChange={(selectedOption) => { onCountryOrStateChange(selectedOption.value, 'STATE') }}
                      options={(editSelectedAddress.COUNTRY === 'USA' ? usStates : canadaStates).map(country => {
                        return { value: country.STATENAME, label: country.STATENAME }
                      })}
                    />
                    {((editSelectedAddress.STATE == undefined || editSelectedAddress.STATE === '') && validated) && <p style={{ fontSize: 13, marginTop: 5, color: '#dc3545' }}>State is required</p>}

                  </>
                  :
                  <>
                    <Form.Control required style={{ marginTop: 10, paddingRight: 5 }} className='inputFieldContainer' type="text" placeholder="State" name='STATE' onChange={(e) => { onFormValueChange(e.target.value, 'STATE') }} value={editSelectedAddress.STATE && editSelectedAddress.STATE} />
                    <Form.Control.Feedback type="invalid">State is required</Form.Control.Feedback>
                  </>
                }
              </Col>
            </Row>

            <Row>

              <Col>
                <Form.Control required style={{ marginTop: 10, paddingRight: 5 }} className='inputFieldContainer' type="text" placeholder="Zip Code" name='ZIP' onChange={(e) => { onFormValueChange(e.target.value, 'ZIP') }} value={editSelectedAddress.ZIP && editSelectedAddress.ZIP} />
                <Form.Control.Feedback type="invalid">Zip Code is required</Form.Control.Feedback>
              </Col>
              <Col xs={12} md={6}>
                <Select
                  // value={selectedOption}
                  value={{ value: editSelectedAddress.COUNTRY, label: editSelectedAddress.COUNTRY }}
                  placeholder='Select Country'
                  style={{ border: 0, }}
                  onChange={(selectedOption) => { onCountryOrStateChange(selectedOption.value, 'COUNTRY') }}
                  options={countries.map(country => {
                    return { value: country.CountryName, label: country.CountryName }
                  })}
                />
                {((editSelectedAddress.COUNTRY == undefined || editSelectedAddress.COUNTRY === '') && validated) && <p style={{ fontSize: 13, marginTop: 5, color: '#dc3545' }}>Country is required</p>}
              </Col>
            </Row>
            <InputMask mask="+9 (999) 999-9999" style={{color: 'black'}} maskChar=""  onChange={(e) => { onFormValueChange(e.target.value, 'PHONE1') }} value={editSelectedAddress.PHONE1 && editSelectedAddress.PHONE1}>
              {(props) => <Form.Control {...props}  required style={{ marginTop: 10, paddingRight: 5 }} className='inputFieldContainer' name='PHONE1' placeholder="Phone Number"  />}
            </InputMask>
            <Form.Control.Feedback type="invalid">Phone Number is required</Form.Control.Feedback>
            {/* < InputMask style={{}} mask="(999) 999-9999" maskChar="" onChange={(val) => { console.log(val) }} >
              {(props) => <Form.Control {...props} required style={{ marginTop: 10, paddingRight: 5 }} className='inputFieldContainer' placeholder="Phone Number" name='phoneNumber' />}
            </InputMask> */}
            {/* <Form.Control.Feedback type="invalid">Phone Number is required</Form.Control.Feedback> */}
          </Form.Group>
        </Row>
        <Row className='buttonsContainer'>
          <Col className='flexEndButton'>
            {addresses.length > 0 && <Form.Check
              style={{ marginRight: 20, alignSelf: 'flex-end' }}
              type={'checkbox'}
              id={`default`}
              checked={isDefaultAddress}
              onClick={() => { setState({ ...state, isDefaultAddress: !isDefaultAddress }) }}
              label={`Make my deafult shipping address `}
            />}
            < Button type="submit" className='fillButton'>Next</Button>
            {addresses.length > 0 && < Button onClick={() => { setState({ ...state, addOrEditAddress: false, editSelectedAddress: {}, validated: false }); }} className='fillButton' style={{ marginLeft: 10 }}> Cancel </Button>}
          </Col>
          {/* <Col className='flexEndButton'>
            < Button type="submit" className='fillButton'  > Save </Button>
          </Col> */}
        </Row>
      </Form>}
      {/* {isPayment && <Row className='buttonsContainer'>
        <Col className='flexEndButton'>
          < Button onClick={props.onShippingAddressClick} className='fillButton'> Edit </Button>
        </Col>
      </Row>}  */}
      <>

      </>
    </Row>
  )
}

export default ShippingAddressPart;


// < InputMask style={{}} mask="(999) 999-9999" maskChar="" onChange={(val) => { console.log(val) }} >
//               {(props) => <Form.Control {...props} required style={{ marginTop: 10, paddingRight: 5 }} className='inputFieldContainer' placeholder="Phone Number" name='phoneNumber' />}
//             </InputMask>