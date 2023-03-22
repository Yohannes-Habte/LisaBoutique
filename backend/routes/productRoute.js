import express from 'express';
import {
  findOneProduct,
  getProducts,
  getSingleProduct,
} from '../controllers/productConreoller.js';

const productRouter = express.Router();

productRouter.get('/', getProducts);
productRouter.get('/slug/:slug', findOneProduct);
productRouter.get('/:id', getSingleProduct);
productRouter.post('/');
productRouter.put('/');
productRouter.delete('/');
productRouter.post('/:id/reviews');
productRouter.get('/admin');
productRouter.get('/search');
productRouter.get('/categories');

export default productRouter;
