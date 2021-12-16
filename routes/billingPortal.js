
import express from 'express';
import { KaientaiApiUrl, FrontendUrl, stripe } from "../auxillary/EnvVars.js";
import axios from 'axios';

const router = express.Router();

// CREATE CUSTOMER PORTAL SESSION
router.get('/api/v1/create-customer-portal-session/:supplierID', async (req, res) => {
  try {
    await axios.get(`${KaientaiApiUrl}/supplier/${req.params.supplierID}`)
    .then(async (resp) => {
      // Authenticate your user.
      const session = await stripe.billingPortal.sessions.create({
        customer: resp.data.data.supplier.stripeID,
        return_url: FrontendUrl,
      });
      res.redirect(session.url);
    })
    .catch(err => res.status(400).json({error: err}));
  } catch (error) {
    res.status(400).json({ error: e.message });
  }
});

export default router;