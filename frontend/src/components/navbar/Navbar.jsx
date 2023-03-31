import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.scss';
import { ACTION_STORE, myContext } from '../storeProvider/StoreProvider';
import Badge from 'react-bootstrap/Badge';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { LinkContainer } from 'react-router-bootstrap';

const Navbar = () => {
  // Get the myContext elements to add to cart at the navbar
  const { state, dispatch: contextDispatch } = useContext(myContext);
  const { cart, userInfo } = state;
  console.log(userInfo);

  // Sign out Function
  const logoutUser = () => {
    contextDispatch({ type: ACTION_STORE.USER_SIGNOUT });
    //! User-step-3: Remove user info from the browser local storage
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
    //! This solved the issue when the user sign out and direct the user to sign in form
  };

  return (
    <nav className="navbar-container">
      <h3 className="logo">
        <NavLink to={'/'}> LisaBoutique </NavLink>
      </h3>

      <ul className="list-items">
        <li className="list-item">
          <NavLink to={'/'}> Home </NavLink>
        </li>

        <li className="list-item">
          <NavLink to={'/about'}> About Us </NavLink>
        </li>

        <li className="list-item">
          <NavLink to={'/contact'}> Contact </NavLink>
        </li>
      </ul>

      <ul className="cart-items">
        <li className="cart-item">
          <NavLink to="/cart">
            Cart
            {cart.cartItems.length > 0 && (
              <Badge pill bg="danger">
                {/* //! 3. Adding to cart and increasing the quantity of a particular item */}
                {cart.cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}
              </Badge>
            )}
          </NavLink> 
        </li>
        {/* //! Show logged in user's name in the navbar */}
        {userInfo ? (
          <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
            <LinkContainer to="/profile">
              <NavDropdown.Item>User Profile</NavDropdown.Item>
            </LinkContainer>

            <LinkContainer to="/orderhistory">
              <NavDropdown.Item> Order History </NavDropdown.Item>
            </LinkContainer>

            <NavDropdown.Divider />

            <NavLink
              onClick={logoutUser}
              className="dropdown-item"
              to="#signout"
            >
              Log Out
            </NavLink>
          </NavDropdown>
        ) : (
          <li cart-item>
            <NavLink to={'/signin'}> Sign In </NavLink>
          </li>
        )}

        {/* //! Show logged in user is admin, then show .... */}
        {userInfo && userInfo.isAdmin && (
          <NavDropdown title="Admin" id="admin-nav-dropdown">
            <LinkContainer to="/admin/dashboard">
              <NavDropdown.Item>Dashboard</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/admin/products">
              <NavDropdown.Item>Products</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/admin/orders">
              <NavDropdown.Item>Orders</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/admin/users">
              <NavDropdown.Item>Users</NavDropdown.Item>
            </LinkContainer>
          </NavDropdown>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
