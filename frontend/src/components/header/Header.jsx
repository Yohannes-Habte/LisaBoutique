import React from 'react'
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header>
        <h1> <NavLink to={"/"}> LisaBoutique </NavLink>  </h1>
    </header>
  )
}

export default Header;