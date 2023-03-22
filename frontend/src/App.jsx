import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
//! toast-step-1: import "ToastContainer" and 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import 'react-toastify/dist/ReactToastify.css';
import Home from './views/homePage/Home';
import Contact from './views/contactPage/Contact';
import Navbar from './components/navbar/Navbar';
import About from './views/aboutPage/About';
import Footer from './components/footer/Footer';
import SingleProduct from './views/productPage/SingleProduct';
import './App.scss';
import Cart from './views/cartPage/Cart';
import Signin from './views/signinPage/Signin';
import Signup from './views/signupPage/Signup';
import Payment from './views/paymentPage/Payment';
import PlaceOrder from './views/orderPage/PlaceOrder';
import GetOrdered from './views/getOrderedPage/GetOrdered';
import OrderHistory from './views/orderHistoryPage/OrderHistory';
import Profile from './views/profilePage/Profile';
import ShippingAddress from './views/shippingPage/ShippingAddress';

const App = () => {
  return (
    <div className="app-container">
      <Router>
      {/* //! toast-step-2: state the postion and limit it to one */}
        <ToastContainer position="bottom-center" limit={1} />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/product/:slug" element={<SingleProduct />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/shipping" element={<ShippingAddress />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/placeorder" element={<PlaceOrder />} />
          <Route path="/order/:id" element={<GetOrdered />} />
          <Route path="/orderhistory" element={<OrderHistory />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
