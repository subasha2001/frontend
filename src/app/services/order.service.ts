import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ORDER_CREATE_URL,
  ORDER_NEW_FOR_CURRENT_USER_URL,
  ORDER_PAY_URL,
  ORDER_VERIFY_URL,
} from '../shared/models/constants/urls';
import { Observable, tap } from 'rxjs';
import { Order } from '../shared/models/order';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient, private toastr: ToastrService) {}

  create(order: Order) {
    return this.http.post<Order>(ORDER_CREATE_URL, order);
  }
  getNewOrderForCurrentUser(): Observable<Order> {
    return this.http.get<Order>(ORDER_NEW_FOR_CURRENT_USER_URL);
  }
  pay(order: Order): Observable<string> {
    return this.http.post<string>(ORDER_PAY_URL, order);
  }
  verifyPayment(order: any) {
    return this.http.post(ORDER_VERIFY_URL, order);
  }
  // trackOrderById(id:number):Observable<Order>{
  //   return this.http.get<Order>(ORDER_TRACK_URL + id);
  // }
}
