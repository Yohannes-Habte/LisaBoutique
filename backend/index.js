import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import multer from 'multer';

//! upload-Step 1: Where to store the image
const storage = multer.diskStorage({
  destination: "uploads/images/",
  filename: function(req, file, cb) {
    cb(null, new Date().getTime() + file.originalname)
  }
});
const upload = multer({storage});

import uploadRouter from './routes/uploadRoute.js';
import seedRouter from './routes/seedRoute.js';
import productRouter from './routes/productRoute.js';
import userRouter from './routes/userRoute.js';
import orderRouter from './routes/orderRoute.js';
import testimonialRrouter from './routes/testimonialRoute.js';
import aboutRouter from "./routes/aboutRoute.js"
import globalErrorHandler from './middleware/globalErrorHandler.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//! Step 2: create API for the paypal
app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb'); // sb stands for Sandbox
});

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

/** 
app.get('/api/products', (req, res, next) => {
  res.send(data.products);
});

app.get('/api/products/slug/:slug', (req, res) => {
  const product = data.products.find((item) => item.slug === req.params.slug);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product not found! Please try again!' });
  }
});

app.get('/api/products/:id', (req, res) => {
  const product = data.products.find((item) => item._id === req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product not found! Please try again!' });
  }
});
*/

// Middleware - Every changes will be informed
app.use(morgan('tiny'));

app.use('/api/upload', uploadRouter);
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/about', aboutRouter);
//! upload-Step 2: State the endpoint and upload type
app.use('/api/testimonials', upload.single('file'), testimonialRrouter);
//! upload-Step 3: State the static express
app.use(express.static('uploads'));

// Express static used to access the the images in the assets folder
app.use(express.static("assets")); 

// Global error handler
app.use(globalErrorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  connectedToDatabase();
  console.log(`The server started on port ${port}`);
});
