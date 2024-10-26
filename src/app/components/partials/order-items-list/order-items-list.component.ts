import { Component, Input } from '@angular/core';
import { Order } from '../../../shared/models/order';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'order-items-list',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './order-items-list.component.html',
  styleUrl: './order-items-list.component.css'
})
export class OrderItemsListComponent {
  @Input()order!:Order;
}
