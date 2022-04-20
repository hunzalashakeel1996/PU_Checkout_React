// export const url = "http://74.208.31.179:8520";
// export const url = "https://www.dentistuniform.com/PulseCheckout";
export const url = "http://localhost:65463";

const header = {
    "Content-Type": "application/json",
    Accept: "application/json",
}

export const apiFetch = (apiUrl, apiMethod, apiHeader, apiBody) => {
    
        return new Promise((resolve, reject) => {
            fetch(`${url}/${apiUrl}`, {
                method: apiMethod,
                headers: apiHeader,
                body: apiBody
            })
                .then(res => {
                    return res.statusText==='OK' ? res.json():{err: 'Invalid username or password'}
                })
                .then(resJson => {
                    if (resJson) {
                        // dispatchAction && dispatch(dispatchAction(resJson))
                        resolve(resJson);
                    }
                })
                .catch(err => { return console.log('error', err) })
        });
};

export const getCustomerAdress = (CID) => {
    return apiFetch('api/values/CUSTOMERSHIPPING', "POST", header, JSON.stringify({CID}));
};

export const getGuestCustomerAdress = (CID) => {
    return apiFetch('api/values/GUESTCUSTOMERSHIPPING', "POST", header, JSON.stringify({CID}));
};

export const getShipDays = (prices) => {
    return apiFetch('api/values/SHIPPING', "POST", header, JSON.stringify({prices}));
};

export const login = (CUSTOMEREMAIL, CUSTOMERPASSWORD) => {
    return apiFetch('api/values/VerifyUser', "POST", header, JSON.stringify({CUSTOMEREMAIL,CUSTOMERPASSWORD }));
};

export const getCountries = () => {
    return apiFetch('api/values/COUNTRY', "POST", header, JSON.stringify({}));
};

export const getUSStates = () => {
    return apiFetch('api/values/USSTATES', "POST", header, JSON.stringify({}));
};

export const getCanadaStates = () => {
    return apiFetch('api/values/CANADASTATES', "POST", header, JSON.stringify({}));
};

export const editOrNewAddress = ({SHIPPINGID,CITY,COUNTRY,FULLNAME, FIRSTNAME,LASTNAME,EXT1,EXT2,FAX,PHONE1,PHONE2,STATE,STREETADDRESS1,STREETADDRESS2,ZIP,EMAIL,CUSTOMERID}) => {
    return apiFetch('api/checkout/CREATESHIPPING', "POST", header, JSON.stringify({SHIPPINGID,CITY,COUNTRY,FULLNAME, FIRSTNAME,LASTNAME,EXT1,EXT2,FAX,PHONE1,PHONE2,STATE,STREETADDRESS1,STREETADDRESS2,ZIP,EMAIL,CUSTOMERID}));
};

export const editOrNewGuestAddress = ({SHIPPINGID,CITY,COUNTRY,FULLNAME,EXT1,EXT2,FAX,PHONE1,PHONE2,STATE,STREETADDRESS1,STREETADDRESS2,ZIP,EMAIL,CUSTOMERID}) => {
    return apiFetch('api/checkout/CREATEGUESTSHIPPING', "POST", header, JSON.stringify({SHIPPINGID,CITY,COUNTRY,FULLNAME,EXT1,EXT2,FAX,PHONE1,PHONE2,STATE,STREETADDRESS1,STREETADDRESS2,ZIP,EMAIL,CUSTOMERID}));
};

export const makeAddressDefault = ({CUSTOMERID, SHID}) => {
    return apiFetch('api/checkout/setDefaultShipping', "POST", header, JSON.stringify({CUSTOMERID, SHID}));
};

export const removeShipping = (SHID) => {
    return apiFetch('api/values/removeShipping', "POST", header, JSON.stringify(SHID));
};

export const forgetPassword = (CUSTOMEREMAIL) => {
    return apiFetch('api/values/ForgotPassword', "POST", header, JSON.stringify({CUSTOMEREMAIL}));
};

export const saveBillingAddress = ({SHIPPINGID,CITY,COUNTRY,FULLNAME,FIRSTNAME,LASTNAME,EXT1,EXT2,FAX,PHONE1,PHONE2,STATE,STREETADDRESS1,STREETADDRESS2,ZIP,EMAIL,CUSTOMERID}) => {
    return apiFetch('api/checkout/CREATEBILLING', "POST", header, JSON.stringify({SHIPPINGID,CITY,COUNTRY,FULLNAME,FIRSTNAME,LASTNAME,EXT1,EXT2,FAX,PHONE1,PHONE2,STATE,STREETADDRESS1,STREETADDRESS2,ZIP,EMAIL,CUSTOMERID}));
};

export const saveGuestBillingAddress = ({SHIPPINGID,CITY,COUNTRY,FULLNAME,FIRSTNAME,LASTNAME,EXT1,EXT2,FAX,PHONE1,PHONE2,STATE,STREETADDRESS1,STREETADDRESS2,ZIP,EMAIL,CUSTOMERID}) => {
    return apiFetch('api/checkout/CREATEGUESTBILLING', "POST", header, JSON.stringify({SHIPPINGID,CITY,COUNTRY,FULLNAME,FIRSTNAME,LASTNAME,EXT1,EXT2,FAX,PHONE1,PHONE2,STATE,STREETADDRESS1,STREETADDRESS2,ZIP,EMAIL,CUSTOMERID}));
};

export const getCartDetails = (SessionID) => {
    return apiFetch('api/values/getsession', "POST", header, JSON.stringify({SessionID}));
};

export const placeOrder = ({IsGuest,SessionId,OrderShipType,OrderAmount,OrderShippedAmount,OrderTaxAmount,L_DeliveryInfo,Refferer,payment,Discount,PO,P_IsTracking,P_RewardPoints,CustomerId,BillingId,ShippingId,CreditCard}) => {
    return apiFetch('api/checkout/PLACEORDER', "POST", header, JSON.stringify({IsGuest,SessionId,OrderShipType,OrderAmount,OrderShippedAmount,OrderTaxAmount,L_DeliveryInfo,Refferer,payment,Discount,PO,P_IsTracking,P_RewardPoints,CustomerId,BillingId,ShippingId,CreditCard}));
};

export const placeOrderGuest = ({IsGuest,SessionId,OrderShipType,OrderAmount,OrderShippedAmount,OrderTaxAmount,L_DeliveryInfo,Refferer,payment,Discount,PO,P_IsTracking,P_RewardPoints,CustomerId,BillingId,ShippingId, CreditCard}) => {
    return apiFetch('api/checkout/PLACEORDERGUEST', "POST", header, JSON.stringify({IsGuest,SessionId,OrderShipType,OrderAmount,OrderShippedAmount,OrderTaxAmount,L_DeliveryInfo,Refferer,payment,Discount,PO,P_IsTracking,P_RewardPoints,CustomerId,BillingId,ShippingId, CreditCard}));
};

export const createUser = ({NAME, CUSTOMEREMAIL, CUSTOMERPASSWORD, LASTNAME, GENDER}) => {
    return apiFetch('api/values/SignUp', "POST", header, JSON.stringify({NAME, CUSTOMEREMAIL, CUSTOMERPASSWORD, LASTNAME, GENDER}));
};

export const createGuestUser = ({email, sessionid}) => {
    return apiFetch('/api/checkout/GuestLogin', "POST", header, JSON.stringify({email, sessionid}));
};

export const testing = ({email, sessionid}) => {
    return apiFetch('/api/checkout/testing', "POST", header, JSON.stringify({email, sessionid}));
};

export const updatePassword = ({CUSTOMERID, NEWPASSWORD, OLDPASSWORD}) => {
    return apiFetch('/api/checkout/GuestLogin', "POST", header, JSON.stringify({CUSTOMERID, NEWPASSWORD, OLDPASSWORD}));
};

// export const login = (data) => {
//     return apiFetch('/Ereports/OrdersREPORT', "POST", header, JSON.stringify({  }));
// };
