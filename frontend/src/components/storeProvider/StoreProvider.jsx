import React, { createContext, useReducer } from 'react';

export const myContext = createContext();

export const ACTION_STORE = {
  ADD_ITEM_TO_CART: 'ADD_ITEM_TO_CART',
  REMOVE_ITEM_FROM_CART: 'REMOVE_ITEM_FROM_CART',
  USER_SIGNIN: 'USER_SIGNIN',
  USER_SIGNOUT: 'USER_SIGNOUT',
  SHIPPING_ADDRESS: 'SHIPPING_ADDRESS',
  PAYMENT_METHOD: 'PAYMENT_METHOD',
  CLEAR_CART: 'CLEAR_CART',
};

// Initail State Variables

const initialState = {
  //! User-step-2: Get user info in the browser local storage
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,

  cart: {
    //! Step 2: Get cartItems info from the local storage
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],

    //! User-step-2: Get user info from the browser local storage
    userInfo: localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null,

    //! address-step-2: Get shipping address from the browser local storage
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {},

    //! payment-step1: Get payment method from the browser local storage
    //! Since it is string, you do not need "JSON.parse"
    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')
      : '',
  },
  // cart: { cartItems: [] },
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_STORE.ADD_ITEM_TO_CART:
      //! Second Step. To add to cart and increasing the quantity of a particular item, you need three steps
      // Setp 1: Find new item (newItem) that has to be added to the cart.
      const newItem = action.payload;
      // Setp 2: Find existing item (existingItem) in the cartItems and compare with the new item (newItem).
      const existingItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      /*
        Setp 3:
          - If the (existingItem) is the same as (newItem), update the (newItem) using map function.
          - If the item does not exist in the cartItems, then: [...state.cart.cartItems, newItem]; 
       */
      const cartItems = existingItem
        ? state.cart.cartItems.map((item) =>
            item._id === existingItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];

      //! Step 1: Save the cartItems in the local storage before return
      localStorage.setItem('cartItems', JSON.stringify(cartItems));

      return { ...state, cart: { ...state.cart, cartItems } };

    case ACTION_STORE.REMOVE_ITEM_FROM_CART: {
      // Filter the item from the cartItems
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      //! Step 1: Save the rest cartItems in the local storage before return
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    // After you place an order, make the cart empty
    case ACTION_STORE.CLEAR_CART:
      return { ...state, cart: { ...state.cart, cartItems: [] } };

    // user log in
    case ACTION_STORE.USER_SIGNIN:
      //! User-step-1: Save user info in the browser local storage
      return { ...state, userInfo: action.payload };

    // User Log out
    case ACTION_STORE.USER_SIGNOUT:
      return {
        ...state,
        userInfo: null,
        cart: { cartItems: [], shippingAddress: {}, paymentMethod: '' },
      };
    // Shipping address
    case ACTION_STORE.SHIPPING_ADDRESS:
      return {
        ...state,
        cart: { ...state.cart, shippingAddress: action.payload },
      };
    // Payment Method
    case ACTION_STORE.PAYMENT_METHOD:
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };

    default:
      return state;
  }
};

const StoreProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <myContext.Provider value={{ state, dispatch }}>
      {props.children}
    </myContext.Provider>
  );
};

export default StoreProvider;
