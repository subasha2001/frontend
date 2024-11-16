import { Component, OnInit } from '@angular/core';
import { Order } from '../../../shared/models/order';
import { OrderService } from '../../../services/order.service';
import { Router } from '@angular/router';
import { TitleComponent } from '../../partials/title/title.component';
import { OrderItemsListComponent } from '../../partials/order-items-list/order-items-list.component';
import { environment } from '../../../shared/models/env/environment.prod';
declare var Razorpay: any;

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [TitleComponent, OrderItemsListComponent],
  templateUrl: './payment-page.component.html',
  styleUrl: './payment-page.component.css',
})
export class PaymentPageComponent implements OnInit {
  order: Order = new Order();
  constructor(private orderservice: OrderService, private router: Router) {
    orderservice.getNewOrderForCurrentUser().subscribe({
      next: (Order) => {
        this.order = Order;
        if (this.order.pincode >= 626100 && this.order.pincode < 626125) {
          this.order.totalPrice = this.order.totalPrice + 100;
        }
      },
      error: () => {
        router.navigateByUrl('/checkout');
      },
    });
  }
  ngOnInit(): void {
    if (!this.order) {
      console.error('Order data is missing');
      this.router.navigate(['/checkout']);
    }
  }
  payNow() {
    if (!this.order) return;

    const itemNames = this.order.items
      .map((val) => val.product.name)
      .join(', ');

    const options = {
      key: environment.mykeyid,
      amount: this.order.totalPrice * 100,
      currency: 'INR',
      name: itemNames,
      order_id: this.order.razorpayPaymentId,
      handler: (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        console.log('Payment Response:', response);
        this.verifyPayment(response);
      },
      prefill: {
        name: this.order.name,
        number: this.order.number,
        contact: this.order.number,
      },
      theme: {
        color: '#3399cc',
      },
    };
    const rzp = new Razorpay(options);
    console.log(options);    
    rzp.open();
    console.log(this.order);
  }

  verifyPayment(response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) {
    const paymentData = {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
    };

    this.orderservice.verifyPayment(paymentData).subscribe(
      (res) => {
        console.log('Payment Verified:', res);
      },
      (error) => {
        console.error('Payment Verification Failed:', error);
      }
    );
  }
}