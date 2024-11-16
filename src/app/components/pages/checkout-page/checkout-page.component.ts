import { Component, OnInit } from '@angular/core';
import { Order } from '../../../shared/models/order';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../../services/cart.service';
import { UserService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { TitleComponent } from '../../partials/title/title.component';
import { OrderService } from '../../../services/order.service';
import { Router } from '@angular/router';
import { InputComponent } from '../../partials/input/input.component';
import { OrderItemsListComponent } from "../../partials/order-items-list/order-items-list.component";
import { environment } from '../../../shared/models/env/environment.prod';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../../shared/models/constants/urls';

declare var Razorpay: any;
@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [
    TitleComponent,
    InputComponent,
    ReactiveFormsModule,
    OrderItemsListComponent,
  ],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.css',
})
export class CheckoutPageComponent implements OnInit {
  order: Order = new Order();
  checkoutForn!: FormGroup;
  deliveryCharge: number = 0;

  constructor(
    private cartservice: CartService,
    private formBuilder: FormBuilder,
    private userservice: UserService,
    private toastrservice: ToastrService,
    private orderservice: OrderService,
    private router: Router,
    private http: HttpClient
  ) {
    const cart = cartservice.getCart();
    this.order.items = cart.items;
    this.order.totalPrice = parseFloat(cart.totalPrice.toFixed(2));
  }
  ngOnInit(): void {
    let { name, address, pincode } = this.userservice.currentUser;
    this.checkoutForn = this.formBuilder.group({
      name: [name, Validators.required],
      address: [address, Validators.required],
      pincode: [pincode, Validators.required],
    });

    // On Pincode input change, update the delivery charge
    this.checkoutForn.controls['pincode'].valueChanges.subscribe((pincode) => {
      if (pincode) {
        this.fetchDeliveryCharge(pincode);
      }
    });
  }
  get fc() {
    return this.checkoutForn.controls;
  }

  fetchDeliveryCharge(pincode: string) {
    this.http
      .get<{ charge: number }>(
        `${BASE_URL}/api/goldSilver/delivery-charge/${pincode}`
      )
      .subscribe(
        (response) => {
          this.deliveryCharge = response.charge;
          this.updateTotalPrice();
        },
        (error) => {
          this.toastrservice.error('Failed to fetch delivery charges', 'Error');
        }
      );
  }
  updateTotalPrice() {
    // Add delivery charge to the existing total price
    this.order.totalPrice = parseFloat(
      (this.cartservice.getCart().totalPrice + this.deliveryCharge).toFixed(2)
    );
  }

  createOrder() {
    if (this.checkoutForn.invalid) {
      this.toastrservice.warning('Please fill the inputs', 'Invalid Inputs');
      return;
    }

    this.order.name = this.fc.name.value;
    this.order.address = this.fc.address.value;
    this.order.pincode = this.fc.pincode.value;
    this.order.deliveryCharge = this.deliveryCharge;

    this.orderservice.create(this.order).subscribe({
      next: (response) => {
        const razorpayOrderId = response.razorpayOrderId;
        this.payNow(razorpayOrderId);
        this.toastrservice.success('Payment Successful');
      },
      error: (errRes) => {
        this.toastrservice.error(errRes.error, 'Cart');
      },
    });
  }

  payNow(orderId: string) {
    if (!this.order) return;

    const itemNames = this.order.items
      .map((val) => val.product.name)
      .join(', ');

    const options = {
      key: environment.mykeyid,
      amount: this.order.totalPrice * 100,
      currency: 'INR',
      name: itemNames,
      order_id: orderId,
      handler: (response: any) => {
        this.verifyPayment(response);
        console.log(response);
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
    rzp.open();
  }

  verifyPayment(response: any) {
    const paymentData = {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
    };

    this.orderservice.verifyPayment(paymentData).subscribe(
      (res) => {
        console.log('Payment Verified:', res);
        this.cartservice.clearCart();
        this.router.navigateByUrl('/');
      },
      (error) => {
        console.error('Payment Verification Failed:', error);
      }
    );
  }
}