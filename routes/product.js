import express from 'express';
import Stripe from "stripe";
import { SecretKey } from "../auxillary/EnvVar.js";

const router = express.Router();
const stripe = Stripe(SecretKey, { apiVersion: "2020-08-27" });

// CREATE PRODUCTS
router.post("/api/v1/products", async (req, res) => {
  try {
    const listOfProducts = req.body;
    await Promise.all(listOfProducts.map(async (product) => {
      const productRes = await stripe.products.create({
        name: product.title,
        metadata: {
          'dimensionsCm': product.dimensionsCm.map(String).join(','),
          'weightGrams': product.weightGrams.toString()
        }
      });
    })).then(resp => {
      console.log(resp)
      res.status(201).json({
        status: "Products Created",
        data: {
          products: listOfProducts
        }
      })
    }).catch(err => {
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

export default router;