import React from "react";
import { MdLocationPin, MdEmail, MdOutlineSupport } from "react-icons/md";
import { FiPhoneCall } from "react-icons/fi";


//====================================================================
// Contact Page Data
//====================================================================

export const ContactData = [
  {
    image: <MdLocationPin  className="contact-icon" />,
    heading: "Manin Office",
    link: <a href="#">straße 31, 4657 Hamburg, Germany</a>
  },
  {
    image: <FiPhoneCall className="contact-icon" />,
    heading: "Phone Number",
    link: <a href="tel:+4917581005650"> +491768686868</a>
  },
  {
    image: <MdEmail className="contact-icon" />,
    heading: "Email Address",
    link: <a href="mailto:uelandrae@gmail.com"> Email </a>
  },
  {
    image: <MdOutlineSupport className="contact-icon" />,
    heading: "24/7 Support",
    link: <a href="tel:+4917581005650"> Call us now </a>
  }
]
