import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import StripeCheckout from 'react-stripe-checkout';
function App() {
  const [product, setProduct] = useState({
    name: 'React from FB',
    price: 10,
    productBy: 'Facebook',
  });

  const makePayment = (token) => {
    const body = {
      token,
      product,
    };

    const headers = {
      'Content-Type': 'application/json',
    };

    return fetch(`${process.env.REACT_APP_BASE_URL}/payment`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
      .then((res) => {
        console.log('RESPONSE ', res);
        const { status } = res;
        console.log('STATUS ', status);
      })
      .catch((err) => {
        console.log('ERROR ', err);
      });
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <StripeCheckout
          stripeKey={process.env.REACT_APP_STRIPE_PUBLIC_KEY}
          token={makePayment}
          name='Buy React'
          amount={product.price * 100}
        >
          <button className='btn btn-primary red'>Pay for React</button>
        </StripeCheckout>
        <a
          className='App-link'
          href='#'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
