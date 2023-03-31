import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from 'react-icons/md';
import './About.scss';
import { myContext } from '../../components/storeProvider/StoreProvider';
import { useParams } from 'react-router-dom';

const About = () => {
  // myContext items
  const { state } = useContext(myContext);
  const { userInfo } = state;

  // To get params from the url, you need to use useParams Hook
  const params = useParams();
  const { slug } = params;

  // State variables
  const [stepOne, setStepOne] = useState(false);
  const [stepTwo, setStepTwo] = useState(false);
  const [stepThree, setStepThree] = useState(false);
  const [stepFour, setStepFour] = useState(false);
  const [stepFive, setStepFive] = useState(false);
  const [stepSix, setStepSix] = useState(false);
  const [stepSeven, setStepSeven] = useState(false);
  const [shirts, setShirts] = useState([]);

  // Function that handle the steps set in the state variables

  const handleStepOne = () => {
    setStepOne((previous) => !previous);
  };

  const handleStepTwo = () => {
    setStepTwo((previous) => !previous);
  };

  const handleStepThree = () => {
    setStepThree((previous) => !previous);
  };

  const handleStepFour = () => {
    setStepFour((previous) => !previous);
  };
  const handleStepFive = () => {
    setStepFive((previous) => !previous);
  };

  const handleStepSix = () => {
    setStepSix((previous) => !previous);
  };
  const handleStepSeven = () => {
    setStepSeven((previous) => !previous);
  };

  // Get Lisa shirt from the backend
  useEffect(() => {
    const fetchLisaShirt = async () => {
      const settings = {
        method: 'GET',
        headers: { authorization: `Bearer ${userInfo.token}` },
      };

      const response = await fetch(
        process.env.REACT_APP_SERVER_URL + `/api/about/shirt`,
        settings
      );
      const result = await response.json();

      try {
        if (response.ok) {
          setShirts(result.shirtSlug);
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchLisaShirt();
  }, []);

  return (
    <main className="about-page">
      <Helmet>
        <title> Ordering Process</title>
      </Helmet>
      <section className="about-container">
        <h1 className="about-title">
          Online Ordering and Delivery Procedures{' '}
        </h1>

        <section className="ordering-procedures">
          <div>
            {/* // Step One */}
            <h5 className={stepOne ? 'procedural-step' : 'steps-bg'}>
              Step One
              {stepOne ? (
                <MdOutlineKeyboardArrowUp
                  className="step-icon"
                  onClick={handleStepOne}
                />
              ) : (
                <MdOutlineKeyboardArrowDown
                  className="step-icon"
                  onClick={handleStepOne}
                />
              )}
            </h5>
            <article className={stepOne ? 'display' : 'hide'}>
              <h5 className="sub-title"> Home Page </h5>
              <p className="paragraph">
                Open the homepage to choose the modern clothes that will make
                you look elegant.
              </p>
            </article>

            {/* // Step Two */}
            <h5 className={stepTwo ? 'procedural-step' : 'steps-bg'}>
              Step Two
              {stepTwo ? (
                <MdOutlineKeyboardArrowUp
                  className="step-icon"
                  onClick={handleStepTwo}
                />
              ) : (
                <MdOutlineKeyboardArrowDown
                  className="step-icon"
                  onClick={handleStepTwo}
                />
              )}
            </h5>
            <article className={stepTwo ? 'display' : 'hide'}>
              <h5 className="sub-title"> Shopping Cart </h5>
              <p className="paragraph">
                Open the cart page from the menubar. You can add/delete clothes
                based on your need.
              </p>
            </article>

            {/* // Step Three */}
            <h5 className={stepThree ? 'procedural-step' : 'steps-bg'}>
              Step Three{' '}
              {stepThree ? (
                <MdOutlineKeyboardArrowUp
                  className="step-icon"
                  onClick={handleStepThree}
                />
              ) : (
                <MdOutlineKeyboardArrowDown
                  className="step-icon"
                  onClick={handleStepThree}
                />
              )}
            </h5>
            <article className={stepThree ? 'display' : 'hide'}>
              <h5 className="sub-title"> Log In </h5>
              <p className="paragraph">
                If you have an account, you need to log in to place an order. In
                case you are not register yet, create an account.
              </p>
            </article>

            {/* // Step Four */}
            <h5 className={stepFour ? 'procedural-step' : 'steps-bg'}>
              Setep Four{' '}
              {stepFour ? (
                <MdOutlineKeyboardArrowUp
                  className="step-icon"
                  onClick={handleStepFour}
                />
              ) : (
                <MdOutlineKeyboardArrowDown
                  className="step-icon"
                  onClick={handleStepFour}
                />
              )}{' '}
            </h5>
            <article className={stepFour ? 'display' : 'hide'}>
              <h5 className="sub-title"> Shipping Address </h5>
              <p className="paragraph">
                In order to get your order to your house, you need to feel in
                your physical address.
              </p>
            </article>

            {/* // Step Five */}
            <h5 className={stepFive ? 'procedural-step' : 'steps-bg'}>
              Setep Five{' '}
              {stepFive ? (
                <MdOutlineKeyboardArrowUp
                  className="step-icon"
                  onClick={handleStepFive}
                />
              ) : (
                <MdOutlineKeyboardArrowDown
                  className="step-icon"
                  onClick={handleStepFive}
                />
              )}{' '}
            </h5>
            <article className={stepFive ? 'display' : 'hide'}>
              <h5 className="sub-title"> Payment Method Selection </h5>
              <p className="paragraph">
                After you feel your address, the next step is to select
                convenient payment method to pay for your order.
              </p>
            </article>

            {/* // Step Six */}
            <h5 className={stepSix ? 'procedural-step' : 'steps-bg'}>
              Setep Six{' '}
              {stepFive ? (
                <MdOutlineKeyboardArrowUp
                  className="step-icon"
                  onClick={handleStepSix}
                />
              ) : (
                <MdOutlineKeyboardArrowDown
                  className="step-icon"
                  onClick={handleStepSix}
                />
              )}{' '}
            </h5>
            <article className={stepSix ? 'display' : 'hide'}>
              <h5 className="sub-title"> Placing Order </h5>
              <p className="paragraph">
                Now, you are ready to place your order..
              </p>
            </article>

            {/* // Step Seven */}

            <h5 className={stepSeven ? 'procedural-step' : 'steps-bg'}>
              Setep Seven{' '}
              {stepSeven ? (
                <MdOutlineKeyboardArrowUp
                  className="step-icon"
                  onClick={handleStepSeven}
                />
              ) : (
                <MdOutlineKeyboardArrowDown
                  className="step-icon"
                  onClick={handleStepSeven}
                />
              )}{' '}
            </h5>
            <article className={stepSeven ? 'display' : 'hide'}>
              <h5 className="sub-title"> Placing Order </h5>
              <p className="paragraph">
                The final step is to pay for your order
              </p>
            </article>
          </div>
          {/* // Get lisa shirt */}
          <div className='shirt-image-container'>
            {shirts.map((shirt) => {
              return (
                <figure className='image-figure'>
                  <img src={shirt.image} alt={shirt.name} className='image' />
                </figure>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
};

export default About;
