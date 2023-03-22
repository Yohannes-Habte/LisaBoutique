import data from '../data.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

export const createProduct = async (req, res, next) => {
  // remove all previous records in the product model
  await Product.deleteMany({});

  // Now, create new product from data.js
  const createdProducts = await Product.insertMany(data.products);

  // remove all records in the user model and create new user
  await User.remove({});
  const createdUsers = await User.insertMany(data.users);

  // Send products and users to the frontend
  res.send({ createdUsers, createdProducts });
};

export default createProduct;
