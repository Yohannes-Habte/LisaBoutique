import express from 'express';
import { createOrder, getOrder, orderSummary, payOrderPayPal, singleUserOrders } from '../controllers/orderController.js';
import { isAuth } from '../utils/utils.js';

const orderRouter = express.Router();

orderRouter.post('/', isAuth, createOrder);
orderRouter.get('/summary', orderSummary);
orderRouter.get('/:id', getOrder);
orderRouter.put('/:id/pay', isAuth, payOrderPayPal);
orderRouter.get('/user/orderHistory', isAuth, singleUserOrders);
orderRouter.get('/');
orderRouter.put('/:id/deliver');
orderRouter.delete('/:id');

export default orderRouter;
