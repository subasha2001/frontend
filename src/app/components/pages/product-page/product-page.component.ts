import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { jewelleryType } from '../../../shared/models/productType';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart.service';
import { map, Observable } from 'rxjs';
import { rates } from '../../../shared/models/rates';
import { GoldSilverService } from '../../../services/gold-silver.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.css',
})
export class ProductPageComponent implements OnInit {
  GR22!: number;
  GR24!: number;
  GR18!: number;
  SR!: number;
  gst!: number;
  product!: jewelleryType;
  returnUrl!: string;

  constructor(
    private actRoute: ActivatedRoute,
    service: ProductsService,
    private cartService: CartService,
    private router: Router,
    private GS: GoldSilverService,
    private fb: FormBuilder
  ) {
    actRoute.params.subscribe((params) => {
      let ratesObservable: Observable<rates[]> = this.GS.getRatesFromDB();
      ratesObservable.subscribe((Items) => {
        Items.forEach((val) => {
          this.GR18 = val.gold18;
          this.GR22 = val.gold22;
          this.GR24 = val.gold24;
          this.SR = val.silver;
          this.gst = val.gst;
        });
      });

      if (params.id) {
        service.getProductById(params.id).subscribe((Product) => {
          this.product = Product;
        });
      }
    });

    this.reviewProduct = this.fb.group({
      productName: [''],
      imageDis: [''],
      name: [''],
      number: [''],
      review: [''],
    });
  }
  ngOnInit(): void {
    this.returnUrl = this.actRoute.snapshot.queryParams['returnUrl'];
    this.calculatePrice();
  }
  
  //price calculation
  calculatePrice(){
    let pdt = this.product
    if (pdt.metalType?.includes('gold')) {
      pdt.price =
        (pdt.weight! * (pdt.wastage! + this.gst) + pdt.weight!) * this.GR22 +
        500;
    }
  }
  //price calculation


  addToCart() {
    this.cartService.addToCart(this.product);
    this.router.navigateByUrl('/cart');
  }

  closeClass: boolean = false;
  close(val: boolean) {
    this.closeClass = val;
  }

  ImgDisHov: string = '';
  showImg(val: string) {
    this.ImgDisHov = val;
  }

  //review product
  reviewProduct!: FormGroup;
  addReview(): void {
    if (this.reviewProduct.invalid) console.log('invalid form');

    this.GS.addReviews({
      productName: this.product.name,
      imageDis: this.product.imageDis,
      name: this.reviewProduct.controls.name.value,
      number: this.reviewProduct.controls.number.value,
      review: this.reviewProduct.controls.review.value,
    }).subscribe((data) => {
      this.router.navigateByUrl(this.returnUrl);
    });
  }
  //review product

  fetchPrice(){

  }
}
