import express from 'express';
import { KaientaiApiUrl, stripe } from "../auxillary/EnvVar.js";
import axios from 'axios';

const router = express.Router();

// CREATE PRODUCT
router.post("/api/v1/product", async (req, res) => {
  try {

    // Create Product using Stripe API
    await stripe.products.create({
      name: product.title,
      metadata: {
        'supplierID': product.supplierID,
        'dimensionsCm': product.dimensionsCm.map(String).join(','),
        'weightGrams': product.weightGrams.toString()
      }
    })
    .then(async (stripeRes) => {

      // Update StripeApi value in DB
      await axios.put(`${KaientaiApiUrl}/product/stripe`, {
        id: product.id,
        stripeID: stripeRes.id
      })
      .then(() => {
        res.status(201).json({
          status: "Product Created + Updated in DB",
          data: {
            product: stripeRes
          }
        })
      })
      .catch(err => {
        console.log(err)
      });
    })
    .catch(err => {
      console.log(err)
    });
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ 
      error: e.message 
    });
  }
});

// CREATE PRODUCTS
router.post("/api/v1/products", async (req, res) => {
  try {
    const listOfProducts = req.body;

    // Create All Products 
    await Promise.all(listOfProducts.map(async (product) => {

      // Create Each Product using Stripe API
      await stripe.products.create({
        name: product.title,
        metadata: {
          'supplierID': product.supplierID,
          'dimensionsCm': product.dimensionsCm.map(String).join(','),
          'weightGrams': product.weightGrams.toString()
        }
      })
      .then(async (resp) => {

        // Update StripeApi value in DB
        await axios.put(`${KaientaiApiUrl}/product/stripe`, {
          id: product.id,
          stripeID: resp.id
        })
        .catch(err => {
          console.log(err)
        });
      })
      .catch(err => {
        console.log(err)
      });
    }))
    .then(() => {
      res.status(201).json({
        status: "Products Created",
        data: {
          products: listOfProducts
        }
      })
    })
    .catch(err => {
      console.log(err)
      res.status(400).json({
        error: err
      })
    })
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ 
      error: e.message 
    });
  }
});

// UPDATE PRODUCT
router.put("/api/v1/product", async (req, res) => {
  try {
    await stripe.products.update(
    req.body.stripeID,
    {metadata: {
      supplierID: req.body.supplierID,
      dimensionsCm: req.body.dimensionsCm.map(String).join(','),
      weightGrams: req.body.weightGrams.toString()
    }})
    .then(resp => {

      res.status(204).json({
        status: "Product Updated",
        data: {
          product: resp
        }
      })
    })
    .catch(err => {
      console.log(err)
      res.status(400).json({
        error: err
      })
    });
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ 
      error: e.message 
    });
  }
})

// DELETE PRODUCT
router.delete("/api/v1/product", async (req, res) => {
  try {
    await stripe.products.del(
      req.body.stripeID
    )
    .then(resp => {
      res.status(202).json({
        status: "Product Deleted",
        data: resp
      })
    })
    .catch(err => {
      console.log(err)
      res.status(400).json({
        error: err
      })
    });
  } catch (e) {
    console.log(e.message);
    res.status(400).json({
      error: e.message
    })
  }
})

export default router;