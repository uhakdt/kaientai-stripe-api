const env = process.env.ENVIRONMENT === 'Development';

// Stripe
import Stripe from "stripe";

export const PublishKey = env ? process.env.PUBLISHABLE_KEY_DEV : process.env.PUBLISHABLE_KEY_PROD

const SecretKey = env ? process.env.SECRET_KEY_DEV : process.env.SECRET_KEY_PROD
export const stripe = Stripe(SecretKey, { apiVersion: "2020-08-27" });


// Kaientai
export const KaientaiApiUrl = env ? process.env.KAIENTAI_API_URL_DEV : process.env.KAIENTAI_API_URL_PROD