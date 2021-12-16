import express from 'express';
import { KaientaiApiUrl, stripe } from "../auxillary/EnvVars.js";
import axios from 'axios';

const router = express.Router();

// CREATE CUSTOMER
router.post("/api/v1/customer/:supplierID", async (req, res) => {
  try {
    const supplierRes = await axios.get(`${KaientaiApiUrl}/supplier/${req.params.supplierID}`);
    const supplierInfo = supplierRes.data.data.supplier;

    if(supplierRes.status === 200) {
      // Create Product using Stripe API
      await stripe.customers.create({
        name: supplierInfo.contactName,
        email: supplierInfo.contactEmail,
        phone: supplierInfo.contactPhone,
        metadata: {
          'supplierID': supplierInfo.id,
        }
      })
      .then(async (stripeRes) => {
        
        // Update StripeApi value in DB
        await axios.put(`${KaientaiApiUrl}/supplier/stripe`, {
          supplierID: supplierInfo.id,
          stripeID: stripeRes.id
        })
        .then(() => {
          res.status(201).json({
            status: "Supplier Created + Updated in DB",
            data: {
              product: stripeRes
            }
          })
        })
        .catch(err => res.status(400).json({error: err}));
      })
      .catch(err => res.status(400).json({error: err}));
    }

  } catch (e) { 
    res.status(400).json({ error: e.message });
  }
});

export default router;