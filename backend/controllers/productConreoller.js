import Product from '../models/productModel.js';
 
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
  const product = await Product.findOne({slug: req.params.slug});
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
