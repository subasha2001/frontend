import { Component, OnInit } from '@angular/core';
import { TitleComponent } from '../../partials/title/title.component';
import { Order } from '../../../shared/models/order';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-success-page',
  standalone: true,
  imports: [TitleComponent, CommonModule, RouterLink],
  templateUrl: './success-page.component.html',
  styleUrl: './success-page.component.css',
})
export class SuccessPageComponent {
  order: Order = new Order();

  constructor(private orderservice: OrderService, private router:Router) {}
  ngOnInit(): void {
    this.order = this.orderservice.getOrder();
    console.log(this.order);

    if (!this.order) {
      alert('No order data found, redirecting to home.');
      this.router.navigateByUrl('/');
    }
  }
}