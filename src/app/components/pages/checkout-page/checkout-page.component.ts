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

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [
    TitleComponent,
    InputComponent,
    ReactiveFormsModule,
    OrderItemsListComponent
],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.css'
})
export class CheckoutPageComponent implements OnInit{

  order: Order = new Order();
  checkoutForn!: FormGroup;
  constructor(
    cartservice: CartService, 
    private formBuilder:FormBuilder, 
    private userservice:UserService,
    private toastrservice:ToastrService,
    private orderservice:OrderService,
    private router:Router
  ) {
    const cart = cartservice.getCart();
    this.order.items = cart.items;
    this.order.totalPrice = parseFloat(cart.totalPrice.toFixed(2));
  }
  ngOnInit(): void {
    let {name, address, pincode} = this.userservice.currentUser;
    this.checkoutForn = this.formBuilder.group({
      name: [name, Validators.required],
      address: [address, Validators.required],
      pincode:[pincode, Validators.required]
    }) 
  }
  get fc(){
    return this.checkoutForn.controls;
  }

  createOrder(){
    if(this.checkoutForn.invalid){
      this.toastrservice.warning('Please fill the inputs', 'Invalid Inputs');
      return;
    }

    this.order.name = this.fc.name.value;
    this.order.address = this.fc.address.value;
    this.order.pincode = this.fc.pincode.value;

    this.orderservice.create(this.order).subscribe({
      next:()=>{
        this.router.navigateByUrl('/payment');
      },
      error:(errRes)=>{     
        this.toastrservice.error(errRes.error, 'Cart');
      }
    })
  }
}