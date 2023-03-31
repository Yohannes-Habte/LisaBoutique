import express from 'express';
import {
  deleteProduct,
  findOneProduct,
  getProducts,
  getSingleProduct,
} from '../controllers/productConreoller.js';
import { isAdmin, isAuth } from '../utils/utils.js';

const productRouter = express.Router();

productRouter.get('/', getProducts);
productRouter.get('/slug/:slug', findOneProduct);
productRouter.get('/:id', getSingleProduct);
productRouter.post('/'); 
productRouter.put('/');
productRouter.delete('/:id', isAuth, isAdmin, deleteProduct);
productRouter.get('/admin'); 

export default productRouter;
