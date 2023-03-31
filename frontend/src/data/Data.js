import React from 'react';
import { MdLocationPin, MdEmail, MdOutlineSupport } from 'react-icons/md';
import { FiPhoneCall } from 'react-icons/fi';

//====================================================================
// About Page Data
//====================================================================

export const AboutData = [
  {
    step: 'Step One',
    title: 'About Page',
    paragraph:
      'Open the homepage to choose the modern clothes that will make you look elegant.',
  },
  {
    step: 'Step Two',
    title: 'Cart Page',
    paragraph:
      'Open the cart page from the menubar. You can add/delete clothes based on your need.',
  },

  {
    step: 'Step Three',
    title: 'Log In Page',
    paragraph:
      'If you have an account, you need to log in to place an order. In case you are not register yet, create an account.',
  },

  {
    step: 'Step Four',
    title: 'Shipping Page',
    paragraph:
      'In order to get your order to your house, you need to feel in your physical address.',
  },

  {
    step: 'Step Five',
    title: 'Payment Method',
    paragraph:
      'After you feel your address, the next step is to select convenient payment method to pay for your order.',
  },

  {
    step: 'Step Six',
    title: 'Place Order Page',
    paragraph: 'Now, you are ready to place your order.',
  },
  {
    step: 'Step Seven',
    title: 'Payment',
    paragraph: 'The final step is to pay for your order',
  },
];

//====================================================================
// Contact Page Data
//====================================================================

export const ContactData = [
  {
    image: <MdLocationPin className="contact-icon" />,
    heading: 'Manin Office',
    link: <a href="#">straße 31, 4657 Hamburg, Germany</a>,
  },
  {
    image: <FiPhoneCall className="contact-icon" />,
    heading: 'Phone Number',
    link: <a href="tel:+4917581005650"> +491768686868</a>,
  },
  {
    image: <MdEmail className="contact-icon" />,
    heading: 'Email Address',
    link: <a href="mailto:uelandrae@gmail.com"> Email </a>,
  },
  {
    image: <MdOutlineSupport className="contact-icon" />,
    heading: '24/7 Support',
    link: <a href="tel:+4917581005650"> Call us now </a>,
  },
];
