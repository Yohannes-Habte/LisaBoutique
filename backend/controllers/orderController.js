import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import createError from 'http-errors';

//===================================================================
// Post an Order
//===================================================================

export const createOrder = async (req, res, next) => {
  try {
    const newOrder = new Order({
      orderItems: req.body.orderItems.map((item) => ({
        ...item,
        product: item._id,
      })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id, // user comes from the isAuth
    });

    const order = await newOrder.save();
    res.status(201).send({ message: 'New Order Created', order });
  } catch (error) {
    console.log(error);
    next(createError(404, 'Order is not placed. Please try again?'));
  }
};

//===================================================================
// Get One Order
//===================================================================

export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    return res.status(200).send(order);
  } catch (error) {
    console.log(error);
    next(createError(404, 'Order could not be queried. Please try again.'));
  }
};

//===================================================================
// Payment using PayPal
//===================================================================

export const payOrderPayPal = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();
      return res
        .status(200)
        .send({ message: 'Order successfully paid!', order: updatedOrder });
    } else {
      return res.status(402).send({ message: 'Order not found.' });
    }
  } catch (error) {
    console.log(error);
    next(createError(404, 'Database could not be queried. Please try again?'));
  }
};

//===================================================================
// orders history of a single user
//===================================================================
export const singleUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    return res.status(200).send(orders);
  } catch (error) {
    console.log(error);
    next(createError(500, "Database couldn't be queried. Please try again!"));
  }
};

//===================================================================
// orders summary
//===================================================================

export const orderSummary = async (req, res, next) => {
  try {
    // Total number of orders and sales revenue
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);

    // total number of users
    const users = await User.aggregate([
      {
        $group: {
          _id: null, 
          numUsers: { $sum: 1 },
        },
      },
    ]);

   
    res.send({ users, orders });
  } catch (error) {
    next(createError(500, 'Summary could not be queried. Please try again.'));
  }
};
