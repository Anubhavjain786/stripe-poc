require('dotenv').config();
const cors = require('cors');
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { v4: uuid } = require('uuid');

const app = express();

//middleware
app.use(express.json());
app.use(cors());

//routes
app.get('/', (req, res) => {
  res.send('IT WORKING FINE');
});

app.post('/payment', async (req, res) => {
  const { product, token } = req.body;
  console.log('PRODUCT', product);
  console.log('PRICE', product.price);
  console.log('TOKEN', token);

  const idempontencyKey = uuid();

  return await stripe.customers
    .create({
      email: token.email,
      source: token.id,
      name: 'Anubhav Jain',
      address: {
        line1: '510 Townsend St',
        postal_code: '98140',
        city: 'San Francisco',
        state: 'CA',
        country: 'US',
      },
    })
    .then(async (customer) => {
      const data = await stripe.charges.create({
        amount: product.price * 100,
        currency: 'usd',
        customer: customer.id,
        receipt_email: token.email,
        description: `Purchase of  ${product.name}`,
        // shipping: {
        //   name: token.card.name,
        //   address: {
        //     country: token.card.country,
        //   },
        // },
      });

      console.log('DATA ', data);
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.log('1', err);
      console.log('2', Object.keys(err));
      console.log('3', err.response);
    });
});

//listen
app.listen(process.env.APP_PORT, () =>
  console.log(`LISTENING AT PORT ${process.env.APP_PORT}`)
);
