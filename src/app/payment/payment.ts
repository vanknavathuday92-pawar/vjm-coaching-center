import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare var Razorpay: any;

@Component({
  selector: 'app-payment',
  standalone: true,
  templateUrl: './payment.html',
  styleUrl: './payment.scss'
})
export class Payment {

  loading = false;

  constructor(
    private http: HttpClient
  ) {}

  payNow(): void {

    if (this.loading) {
      return;
    }

    this.loading = true;

    const studentId =
      localStorage.getItem('studentId') || '';

    this.http
      .post<any>(
        'http://localhost:3000/api/payment/create-order',
        {
          studentId: studentId
        }
      )
      .subscribe({

        next: (order) => {

          this.loading = false;

          if (!order.success) {

            alert('Unable to create payment.');

            return;
          }


          const options = {

            key: 'rzp_live_TWVKfQsfgWQro1',

            amount: order.amount,

            currency: 'INR',

            name: 'VJM COACHING CENTER',

            description:
              'Online Coaching - Complete Course',

            image:
              'assets/vjm-logo.png',

            order_id:
              order.orderId,

            prefill: {

              name:
                localStorage.getItem('studentName') || '',

              email:
                localStorage.getItem('studentEmail') || '',

              contact:
                localStorage.getItem('studentMobile') || ''

            },

            notes: {

              course:
                'VJM Online Coaching',

              studentId:
                studentId

            },

            theme: {

              color: '#10245c'

            },


            handler: (response: any) => {

              this.verifyPayment(response);

            },


            modal: {

              ondismiss: () => {

                this.loading = false;

              }

            }

          };


          const razorpay =
            new Razorpay(options);


          razorpay.on(
            'payment.failed',
            (response: any) => {

              console.error(
                'Payment failed:',
                response
              );

              this.loading = false;

              alert(
                'Payment failed. Please try again.'
              );

            }
          );


          razorpay.open();

        },


        error: (error) => {

          console.error(error);

          this.loading = false;

          alert(
            'Unable to connect to payment server.'
          );

        }

      });

  }


  private verifyPayment(
    response: any
  ): void {

    const studentId =
      localStorage.getItem('studentId') || '';


    this.http
      .post<any>(
        'http://localhost:3000/api/payment/verify',
        {

          razorpay_order_id:
            response.razorpay_order_id,

          razorpay_payment_id:
            response.razorpay_payment_id,

          razorpay_signature:
            response.razorpay_signature,

          studentId:
            studentId

        }
      )
      .subscribe({

        next: (result) => {

          if (result.success) {

            alert(
              'Payment successful! Your payment is being verified.'
            );

            /*
              Later we will navigate to
              the student dashboard.
            */

          } else {

            alert(
              'Payment verification failed.'
            );

          }

        },

        error: (error) => {

          console.error(error);

          alert(
            'Payment completed but verification failed. Please contact VJM Coaching Center.'
          );

        }

      });

  }

}