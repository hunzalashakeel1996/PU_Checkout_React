import './style.css';
import {Container, Button, Row, Col, Form} from 'react-bootstrap'
import React, { lazy, Suspense, useEffect, useState, useRef} from 'react'

function LoginPart(props) {
    const { isGuest, isLogin, isLoading, loginError, onForgetPassword } = props
    const [state, setState] = useState({
        validated: false,
    });
    const { isForgetPassword} = state
    let innerRef = useRef();

    useEffect(() => {
        console.log('aaaaaaaaaaaa')
        innerRef.current&& innerRef.current.focus();
  }, [isLogin, isGuest]);

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
            props.onLoginClick(formDataObj)
        }
        setState({ ...state, validated: true });
    };

    //GUEST OR USER OPTION
    return (
        <Row className='informationContainer'>
            {/* buttons part  */}
            <Row xs={12} className='buttonsContainer'>
                <Col xs={12} md={12} lg={6} className='singleButtonContainer mb-2 mb-lg-0 '>
                    <Button
                        disabled={isLogin}
                        onClick={() => {props.onGuestButtonClick(false)}}
                        className={isGuest ? 'borderButton' : 'fillButton'}
                        variant={isGuest ? "outline-primary" : null} block
                    >
                        Already have an account?
                    </Button>
                </Col>
                <Col xs={12} md={12} lg={6} className='singleButtonContainer'>
                    <Button disabled={isLogin}
                        onClick={() => { props.onGuestButtonClick(true) }}
                        className={!isGuest ? 'borderButton' : 'fillButton'}
                        variant={!isGuest ? "outline-primary" : null}
                        block
                    >
                        Guest Checkout
                    </Button>
                </Col>
            </Row>

            {/* LOGIN FORM  */}
            <Form className='emailFormContainer' noValidate validated={state.validated} onSubmit={handleSubmit}>
                {!isLogin&&
                <>
                <Row className='buttonsContainer'>
                    <Form.Group controlId="formBasicEmail" as={Col} xs="12" >
                        {/* <Form.Label>Email address</Form.Label> */}
                        <Form.Control ref={innerRef} style={{}} required disabled={isLogin} className='inputFieldContainer' type="email" placeholder="Enter email" name='email'/>
                        <Form.Control.Feedback type="invalid">Please enter correct email address</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className='buttonsContainer'>
                    {!isGuest && <Form.Group controlId="formBasicPassowrd" as={Col} xs="12" >
                        {/* <Form.Label>Email address</Form.Label> */}
                        <Form.Control required disabled={isLogin} className='inputFieldContainer' type="password" placeholder="Enter Password" name='password' />
                        <Form.Control.Feedback type="invalid">Password is required</Form.Control.Feedback>
                    </Form.Group>}
                </Row>
                </>}
                {loginError && <Col >
                    <p style={{ color: '#db3740' }}>Invalid username or password</p>
                </Col>}
                {/* message part  */}
                {!isLogin && <Row className='buttonsContainer'>
                    {/* {isGuest && <Col>
                        <p>Already have an account? <span><a target='_blank' href={`#`} style={{ color: 'red' }}>Sign In</a> </span></p>
                    </Col>} */}
                    {isGuest?<Col xs={12} sm={6}>
                            <p>Already have an account? <a onClick={() => {props.onGuestButtonClick(false)}} style={{color: 'red', cursor: 'pointer'}}> Signin</a></p>
                    </Col>
                   :
                   <Col xs={12} sm={6}>
                            <a onClick={() => {onForgetPassword()}} style={{color: 'red', cursor: 'pointer'}}> Forgot Password?</a>
                    </Col>
                    }
                    <Col xs={12} sm={6} className='flexEndButton ml-auto'>
                        <Button disabled={isLoading} type="submit" className='fillButton redbtn' style={{backgroundColor: '#db3740 !important', borderColor:'#db3740', height:40,}}>{isGuest ? 'Continue as Guest' : 'Login'}</Button>
                    </Col>
                </Row>}
            </Form>

            {
            // isForgetPassword &&
            //     <Row  className='buttonsContainer'>
            //         <Col xs={10} md={10} lg={10}>
            //             {/* <Form.Label>Email address</Form.Label> */}
            //             <Form.Control style={{}} className='inputFieldContainer' type="email" placeholder="Enter email" name='email' />
            //         </Col>
            //         <Col xs={2} md={2} lg={2} >
            //             {/* <Form.Label>Email address</Form.Label> */}
            //             <Button
            //                 onClick={() => { console.log('cliked') }}
            //                 className={'fillButton'}
            //                 block
            //             >Submit</Button>
            //         </Col>
            //     </Row>

            }
            {/* {isLogin && <Row className='buttonsContainer'>
                <Col className='flexEndButton'>
                    <Button onClick={props.onLoginClick} className='fillButton'>Edit</Button>

                </Col>
            </Row>} */}
        </Row>
    )
}

export default LoginPart;




// 