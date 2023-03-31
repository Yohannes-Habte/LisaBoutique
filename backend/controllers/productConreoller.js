import Product from '../models/productModel.js';
import createError from 'http-errors';

//=====================================================================
// Get all Products using
//=====================================================================
export const getProducts = async (req, res, next) => {
  const products = await Product.find();
  res.send(products);
};

//=====================================================================
// Get a Product using a "slug" from data.js
//=====================================================================

export const findOneProduct = async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product not found!' });
  }
};

//=====================================================================
// Get a single product using a Product "id"
//=====================================================================
export const getSingleProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product not found!' });
  }
};

//=====================================================================
// Admin gets all Products
//=====================================================================

export const adminGetAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    const countProducts = await Product.countDocuments();
    return res.send({
      products,
      countProducts,
    });
  } catch (error) {
    return next(
      createError(
        500,
        'Products could not be queried from database. Please try again.'
      )
    );
  }
};

//=====================================================================
// Delete a Product by admin only
//=====================================================================

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      res.send({ message: 'Product Deleted' });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  } catch (error) {
    return next(
      createError(500, 'Database could not query. Please try again!')
    );
  }
};

//=====================================================================
// Get lisaShirt
//=====================================================================

export const getLisaShirt = async (req, res, next) => {
  try {
    const findLisaShirt = await Product.find({ slug: 'lisa-fit-shirt' });
    return res.status(200).send({shirtSlug: findLisaShirt});
  } catch (error) {
    console.log(error);
    return next(
      createError(500, 'Lisa shirt could not be queried. Please try again!')
    );
  }
};
