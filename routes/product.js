import express from 'express';
import { KaientaiApiUrl, stripe } from "../auxillary/EnvVars.js";
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
      .catch(err => res.status(400).json({error: err}));
    })
    .catch(err => res.status(400).json({error: err}));
  } catch (e) { 
    res.status(400).json({ error: e.message });
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
        .catch(err => res.status(400).json({error: err}))
      })
      .catch(err => res.status(400).json({error: err}))
    }))
    .then(() => {
      res.status(201).json({
        status: "Products Created",
        data: {
          products: listOfProducts
        }
      })
    })
    .catch(err => res.status(400).json({error: err}))
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// CREATE PRODUCTS FROM DB
router.post("/api/v1/products/db", async (req, res) => {
  try {
    const listOfProducts = await (await axios.get(`${KaientaiApiUrl}/products`)).data.data.products;
    if(listOfProducts.length > 0) {
      // Create All Products 
      await Promise.all(listOfProducts.map(async (product) => {

        // Create Each Product using Stripe API
        await stripe.products.create({
          name: product.title,
          metadata: {
            'supplierID': product.supplierID,
            'dimensionsCm': product.dimensionsCm?.map(String).join(','),
            'weightGrams': product.weightGrams?.toString()
          }
        })
        .then(async (resp) => {

          // Update StripeApi value in DB
          await axios.put(`${KaientaiApiUrl}/product/stripe`, {
            id: product.id,
            stripeID: resp.id
          })
          .catch(err => res.status(400).json({error: err}));
        })
        .catch(err => res.status(400).json({error: err}));
      }))
      .then(() => {
        res.status(201).json({
          status: "Products Created",
          data: {
            products: listOfProducts
          }
        })
      })
      .catch(err => res.status(400).json({error: err}));
    }
  } catch (e) {
    res.status(400).json({error: e.message});
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
    .catch(err => res.status(400).json({error: err}));
  } catch (e) {
    res.status(400).json({ error: e.message });
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
    .catch(err => res.status(400).json({error: err}));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
})


//#region
// DELETE PRODUCTS ALL
// router.delete("/api/v1/products/all", async (req, res) => {
//   try {
//     let listOfProducts = await axios.get(`${KaientaiApiUrl}/products`);
//     listOfProducts = listOfProducts.data.data.products
//     if(listOfProducts.length > 0) {
//       await Promise.all(listOfProducts.map(async (product) => {
//         console.log(product.stripeID)
//         if(product.stripeID != null) {
//           await stripe.products.del(
//             product.stripeID
//           ).then(x => {
//             console.log(x)
//           }).catch(err => res.status(400).json({error: err}));
//         }
//       }))
//       .then(resp => {
//         res.status(202).json({
//           status: "Product Deleted",
//           data: resp
//         })
//       })
//       .catch(err => res.status(400).json({error: err}));
//     }
//   } catch (e) {
//     res.status(400).json({ error: e.message });
//   }
// })
//#endregion

export default router;