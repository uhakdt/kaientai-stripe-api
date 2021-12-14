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

app.use(product);

export default app;