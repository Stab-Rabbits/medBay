const { model } = require('mongoose');
const models = require('../models/sickBayModels');

const productController = {};

// GET ALL PRODUCTS
productController.getProducts = (req, res, next) => {
  models.Product.find({})
    .then((data) => {
      res.locals = data;
      next();
    })
    .catch((err) => next({
      log: err,
      message: { err: 'productController.getProducts failed.' },
    }));
};

// GET TOP 8 PRODUCTS
productController.getTopProducts = (req, res, next) => {
  models.Product.find({}).limit(8)
    .then((data) => {
      res.locals = data;
      next();
    })
    .catch((err) => next({
      log: err,
      message: { err: 'productController.getTopProducts failed.' },
    }));
};

// GET CATEGORY LIST
productController.getCategoryList = (req, res, next) => {
  models.Product.distinct('Category')
    .then((data) => {
      res.locals = data;
      next();
    })
    .catch((err) => next({
      log: err,
      message: { err: 'productController.getCategoryList failed.' },
    }));
};

// GET SPECIFIC CATEGORY PRODUCTS
productController.categoryProducts = (req, res, next) => {
  const { query } = req;
  models.Product.find(query)
    .then((data) => {
      res.locals = data;
      next();
    })
    .catch((err) => next({
      log: err,
      message: { err: 'productController.categoryProducts failed.' },
    }));
};

// ADD NEW PRODUCTS
productController.addProducts = (req, res, next) => {
  const newProducts = req.body;

  models.Product.insertMany(newProducts)
    .then((data) => {
      res.locals = data;
      next();
    })
    .catch((err) => next({
      log: err,
      message: { err: 'productController.addProducts failed.' },
    }));
};

// GET PRODUCTS THAT PERTAINS TO THE WHAT THE USER SEARCHED
productController.getSearchedProducts = (req, res, next) => {
  const { productName } = req.body;
  models.Product.find({ Title: { $regex: productName, $options: 'i' } },
    'Title Description Price ImageURL Category Quantity',
    { limit: 20 },
    (err, products) => {
      if (err) return next({ log: err, message: { err: 'productController.getSearchedProducts failed.' } });
      res.locals = products;
      next();
    });
};

// GETTING A PRODUCT FROM PRODUCT DATABASE
// $push into cart schema
productController.getCartProduct = (req, res, next) => {
  // This is what the client should send: {id: 606d3ad382f8173e94b23732}
  const { id } = req.body
  console.log("this is our body: ", id)
  models.Product.findById(id)
  .then((data) => {
    res.locals.data = data;
    console.log('our data: ', res.locals.data)
    next();
  })
  .catch((err) => ({
    log: err,
    message: { err: 'productController.addCart failed'}
  }));
};

productController.addCart = (req, res, next) => {
  console.log("passed down data: ", res.locals.data)
  models.Cart.insertMany()
  // console.log("this is our body: ", id)
  // models.Product.findById(id)
  // .then((data) => {
  //   res.locals = data;
  //   console.log('our data: ', res.locals)
  //   next();
  // })
  // .catch((err) => ({
  //   log: err,
  //   message: { err: 'productController.addCart failed'}
  // }));
}

// ============ !!!DANGER DANGER DANGER!!! ============
// CLEAN DATABASE
productController.deleteProducts = (req, res, next) => {
  models.Product.deleteMany({})
    .then(() => {
      next();
    })
    .catch((err) => next({
      log: err,
      message: { err: 'productController.addProducts failed.' },
    }));
};

module.exports = productController;
