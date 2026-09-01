const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Razorpay = require('razorpay');

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());


const razorpay = new Razorpay({

  key_id: process.env.RAZORPAY_KEY_ID,

  key_secret: process.env.RAZORPAY_KEY_SECRET

});


app.get('/', (req, res) => {

  res.send('VJM Coaching Center Payment Server is running.');

});


app.post('/create-order', async (req, res) => {

  try {

    const options = {

      amount: 600000,

      currency: 'INR',

      receipt:
        'VJM_' +
        Date.now(),

      notes: {

        center:
          'VJM Coaching Center'

      }

    };


    const order =
      await razorpay.orders.create(
        options
      );


    console.log(
      'Razorpay Order Created:',
      order.id
    );


    res.json({

      success: true,

      orderId:
        order.id,

      amount:
        order.amount,

      currency:
        order.currency

    });


  } catch (error) {

    console.error(
      'Razorpay order creation error:',
      error
    );


    res.status(500).json({

      success: false,

      message:
        'Unable to create Razorpay order.'

    });

  }

});


const PORT =
  process.env.PORT || 3000;


app.listen(
  PORT,
  () => {

    console.log(
      `VJM Payment Server running on port ${PORT}`
    );

  }
);