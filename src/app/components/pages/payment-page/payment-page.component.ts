import { Component } from '@angular/core';
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
  styleUrl: './payment-page.component.css'
})
export class PaymentPageComponent {
  order: Order = new Order();
  constructor(orderservice:OrderService, router:Router){
    orderservice.getNewOrderForCurrentUser().subscribe({
      next:(order)=>{
        this.order = order;
      },
      error:()=>{
        router.navigateByUrl('/checkout');
      }
    })
  }
}