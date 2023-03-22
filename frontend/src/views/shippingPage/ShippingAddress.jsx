import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { json, useNavigate } from 'react-router-dom';
import CheckoutSteps from '../../components/checkoutSteps/CheckoutSteps';
import {
  ACTION_STORE,
  myContext,
} from '../../components/storeProvider/StoreProvider';
import './ShippingAddress.scss';

const ShippingAddress = () => {
  // navigate to payment page
  const navigate = useNavigate();

  const { state, dispatch: contextDispatch } = useContext(myContext);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;
  //! Dynamic shipping address State Variables
  const [fullName, setFullName] = useState(shippingAddress.fullName || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [houseNumber, setHouseNumber] = useState(
    shippingAddress.houseNumber || ''
  );
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  const [country, setCountry] = useState(shippingAddress.country || '');

  // When a user is not logged in, user's shipping address should be deleted. To do so, you need to do ...
  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
    }
  }, [userInfo, navigate]);

  // Update inpute values
  const udpdateData = (e) => {
    switch (e.target.name) {
      case 'fullName':
        setFullName(e.target.value);
        break;
      case 'address':
        setAddress(e.target.value);
        break;
      case 'houseNumber':
        setHouseNumber(e.target.value);
        break;
      case 'city':
        setCity(e.target.value);
        break;
      case 'postalCode':
        setPostalCode(e.target.value);
        break;
      case 'country':
        setCountry(e.target.value);
        break;
      default:
        break;
    }
  };

  // Submit shipping address
  const submitShippingAddress = async (e) => {
    e.preventDefault();
    contextDispatch({
      type: ACTION_STORE.SHIPPING_ADDRESS,
      payload: {
        fullName,
        address,
        houseNumber,
        city,
        postalCode,
        country,
      },
    });
    //! address-step-1: Save shipping address in the browser local storage
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        fullName,
        address,
        houseNumber,
        city,
        postalCode,
        country,
      })
    );
    navigate('/payment');
  };

  return (
    <main className="shipping-address-page">
      <Helmet>
        <title> Shipping Address </title>
      </Helmet>

      <CheckoutSteps step1 step2></CheckoutSteps>

      <section className="shipping-address-container">
        <h1 className="shipping-address-title"> Shipping Address </h1>
        <form
          action=""
          onSubmit={submitShippingAddress}
          className="shipping-address-form"
        >
          <div className="shipping-attributes">
            <div className="label-input-container">
              <label htmlFor="fullName"> Full Name </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={fullName}
                onChange={udpdateData}
                placeholder="Full Name"
              />
            </div>

            <div className="label-input-container">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={address}
                onChange={udpdateData}
                placeholder="Address"
              />
            </div>

            <div className="label-input-container">
              <label htmlFor="houseNumber">House Number </label>
              <input
                type="number"
                id="houseNumber"
                name="houseNumber"
                value={houseNumber}
                onChange={udpdateData}
                placeholder="House Number"
              />
            </div>

            <div className="label-input-container">
              <label htmlFor="city"> City </label>
              <input
                type="text"
                id="city"
                name="city"
                value={city}
                onChange={udpdateData}
                placeholder="City"
              />
            </div>

            <div className="label-input-container">
              <label htmlFor="postalCode"> Postal Code </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={postalCode}
                onChange={udpdateData}
                placeholder="Postal Code"
              />
            </div>

            <div className="label-input-container">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={country}
                onChange={udpdateData}
                placeholder="Country"
              />
            </div>
          </div>
          <button className="shipping-address-btn">Next</button>
        </form>
      </section>
    </main>
  );
};

export default ShippingAddress;
