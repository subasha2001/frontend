import { Component, Input, OnInit } from '@angular/core';
import { Order } from '../../../shared/models/order';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BASE_URL } from '../../../shared/models/constants/urls';

@Component({
  selector: 'order-items-list',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './order-items-list.component.html',
  styleUrl: './order-items-list.component.css',
})
export class OrderItemsListComponent implements OnInit {
  @Input() order!: Order;
  baseurl = BASE_URL;

  constructor() {}
  ngOnInit(): void {
    
  }
}