import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

declare var Razorpay: any;

@Component({
  selector: 'app-payment',
  imports: [
    RouterLink,
    HttpClientModule
  ],
  templateUrl: './payment.html',
  styleUrl: './payment.scss'
})
export class Payment {

  // ============================================
  // PAYMENT AMOUNT
  // ============================================

  amount = 6000;

  selectedMethod = '';

  isProcessing = false;


  // ============================================
  // CONSTRUCTOR
  // ============================================

  constructor(
    private http: HttpClient
  ) {}


  // ============================================
  // SELECT PAYMENT METHOD
  // ============================================

  selectPaymentMethod(method: string): void {

    this.selectedMethod = method;

  }


  // ============================================
  // PROCEED TO RAZORPAY PAYMENT
  // ============================================

  proceedToPayment(): void {

    if (!this.selectedMethod) {

      alert(
        'Please select a payment method.'
      );

      return;

    }


    if (this.isProcessing) {

      return;

    }


    this.isProcessing = true;


    // ============================================
    // CREATE RAZORPAY ORDER
    // ============================================

    this.http.post<any>(
      'http://localhost:3000/create-order',
      {
        amount: this.amount
      }
    )
    .subscribe({

      next: (response) => {

        console.log(
          'Razorpay order created:',
          response
        );


        this.openRazorpayCheckout(
          response
        );

      },


      error: (error) => {

        console.error(
          'Unable to create Razorpay order:',
          error
        );


        this.isProcessing = false;


        alert(
          'Unable to start payment. Please try again.'
        );

      }

    });

  }


  // ============================================
  // OPEN RAZORPAY CHECKOUT
  // ============================================

  private openRazorpayCheckout(
    order: any
  ): void {

    const options = {

      // ==========================================
      // RAZORPAY KEY
      // ==========================================

      key: 'rzp_live_TWVKfQsfgWQro1',

      amount: order.amount,

      currency: 'INR',

      name: 'VJM COACHING CENTER',

      description:
        'Coaching Course Fee',


      order_id:
        order.id,


      // ==========================================
      // PAYMENT HANDLER
      // ==========================================

      handler: (response: any) => {

        console.log(
          'Payment successful:',
          response
        );


        this.verifyPayment(
          response
        );

      },


      // ==========================================
      // PREFILL
      // ==========================================

      prefill: {

        name: '',

        email: '',

        contact: ''

      },


      // ==========================================
      // THEME
      // ==========================================

      theme: {

        color: '#1d4ed8'

      },


      // ==========================================
      // MODAL
      // ==========================================

      modal: {

        ondismiss: () => {

          console.log(
            'Razorpay checkout closed.'
          );

          this.isProcessing = false;

        }

      }

    };


    const razorpay =
      new Razorpay(options);


    razorpay.open();

  }


  // ============================================
  // VERIFY PAYMENT WITH SERVER
  // ============================================

  private verifyPayment(
    response: any
  ): void {

    this.http.post<any>(
      'http://localhost:3000/verify-payment',
      {

        razorpay_order_id:
          response.razorpay_order_id,

        razorpay_payment_id:
          response.razorpay_payment_id,

        razorpay_signature:
          response.razorpay_signature

      }
    )
    .subscribe({

      next: (result) => {

        console.log(
          'Payment verification result:',
          result
        );


        this.isProcessing = false;


        if (result.success) {

          alert(
            'Payment successful! Thank you for registering with VJM Coaching Center.'
          );

        } else {

          alert(
            'Payment verification failed.'
          );

        }

      },


      error: (error) => {

        console.error(
          'Payment verification error:',
          error
        );


        this.isProcessing = false;


        alert(
          'Payment was received, but verification failed. Please contact VJM Coaching Center.'
        );

      }

    });

  }

}