import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
//import path from 'path'; //! Step 3 to for publishing in heroku
import data from './data.js';

import uploadRouter from './routes/uploadRoute.js';
import seedRouter from './routes/seedRoute.js';
import productRouter from './routes/productRoute.js';
import userRouter from './routes/userRoute.js';
import orderRouter from './routes/orderRoute.js';
import globalErrorHandler from './middleware/globalErrorHandler.js';
import morgan from 'morgan';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//! Step 2: create API for the paypal
app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb'); // sb stands for Sandbox
});
const port = process.env.PORT || 5000;

dotenv.config();

const connectedToDatabase = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('DB is connected');
  } catch (error) {
    console.log(error.message);
  }
};

// app.get('/api/products', (req, res, next) => {
//   res.send(data.products);
// });

// app.get('/api/products/slug/:slug', (req, res) => {
//   const product = data.products.find((item) => item.slug === req.params.slug);
//   if (product) {
//     res.send(product);
//   } else {
//     res.status(404).send({ message: 'Product not found! Please try again!' });
//   }
// });

// app.get('/api/products/:id', (req, res) => {
//   const product = data.products.find((item) => item._id === req.params.id);
//   if (product) {
//     res.send(product);
//   } else {
//     res.status(404).send({ message: 'Product not found! Please try again!' });
//   }
// });
// Middleware - Every changes will be informed
app.use(morgan('tiny'));

app.use('/api/upload', uploadRouter);
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter); 

//! Step 2 to for publishing in heroku 
/* 
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
);
*/

// Global error handler
app.use(globalErrorHandler);

app.listen(port, () => {
  connectedToDatabase();
  console.log(`The server started on port ${port}`);
});
