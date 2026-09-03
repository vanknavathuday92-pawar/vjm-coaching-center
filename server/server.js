const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});


/*
========================================
CREATE RAZORPAY ORDER
========================================
*/

app.post('/api/payment/create-order', async (req, res) => {

  try {

    const amount = 6000 * 100;

    const options = {
      amount: amount,
      currency: 'INR',
      receipt: 'vjm_' + Date.now(),
      notes: {
        course: 'VJM Online Coaching',
        studentId: req.body.studentId || ''
      }
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Unable to create payment order'
    });

  }

});


/*
========================================
VERIFY RAZORPAY PAYMENT
========================================
*/

app.post('/api/payment/verify', async (req, res) => {

  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      studentId
    } = req.body;

    const body =
      razorpay_order_id +
      '|' +
      razorpay_payment_id;

    const expectedSignature =
      crypto
        .createHmac(
          'sha256',
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(body.toString())
        .digest('hex');

    if (expectedSignature !== razorpay_signature) {

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });

    }


    /*
      IMPORTANT:

      Here you should update Firebase:

      student.paymentStatus = "paid"

      student.paymentId = razorpay_payment_id

      student.orderId = razorpay_order_id

    */


    res.json({
      success: true,
      message: 'Payment verified successfully'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Payment verification error'
    });

  }

});


app.listen(3000, () => {

  console.log(
    'VJM Payment Server running on http://localhost:3000'
  );

});