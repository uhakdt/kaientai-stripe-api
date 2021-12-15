// Dependencies
import "dotenv/config.js";
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

// Express Setup
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
import product from './routes/product.js';
import customer from './routes/customer.js';

app.use(product);
app.use(customer);

export default app;