import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';

// load environment variables from .env if present
dotenv.config();

// make sure to set STRIPE_SECRET_KEY in your environment
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('ERROR: STRIPE_SECRET_KEY is not defined.\n' +
    'Please set it in your environment or in a .env file before starting the server.\n' +
    'Example: STRIPE_SECRET_KEY=sk_test_... node server.js');
  process.exit(1);
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(cors());
app.use(express.json());

// create a checkout session and return the URL
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { cart, userId, reschedulingId } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: 'Carrito vacío' });
    }

    // convert items to Stripe line_items
    const line_items = cart.map(item => ({
      price_data: {
        currency: 'usd',
        unit_amount: Math.round((item.price || 0) * 100),
        product_data: {
          name: item.name,
        },
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      // URLs must be accessible from the browser; adjust if you deploy under a different host.
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5174'}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5174'}?canceled=true`,
      metadata: {
        userId: userId || 'guest',
        reschedulingId: reschedulingId || '',
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('stripe error', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Stripe server running on http://localhost:${PORT}`));
