import { Component, OnInit } from '@angular/core';
import { Order } from '../../../shared/models/order';
import { OrderService } from '../../../services/order.service';
import { Router } from '@angular/router';
import { TitleComponent } from '../../partials/title/title.component';
import { OrderItemsListComponent } from '../../partials/order-items-list/order-items-list.component';

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [TitleComponent, OrderItemsListComponent],
  templateUrl: './payment-page.component.html',
  styleUrl: './payment-page.component.css',
})
export class PaymentPageComponent implements OnInit {
  order: Order = new Order();
  constructor(orderservice: OrderService, router: Router) {
    orderservice.getNewOrderForCurrentUser().subscribe({
      next: (order) => {
        this.order = order;
        if ((order.pincode >= 626100) && (order.pincode < 626125)) {
          order.totalPrice = order.totalPrice + 100;
        }
      },
      error: () => {
        router.navigateByUrl('/checkout');
      },
    });
  }
  ngOnInit(): void {}
}