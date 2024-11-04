import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { jewelleryType } from '../../../shared/models/productType';
import { CommonModule, NgClass } from '@angular/common';
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
import { BASE_URL } from '../../../shared/models/constants/urls';
import { TitleComponent } from '../../partials/title/title.component';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgClass, TitleComponent],
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
  baseurl = BASE_URL;

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
          let pdt = Product;
          if (pdt.metalType?.includes('gold')) {
            pdt.price =
              (pdt.weight! * (pdt.wastage! + this.gst) + pdt.weight!) *
                this.GR22 +
              500;
          } else if (pdt.category?.includes('kolusu')) {
            pdt.price = (this.SR + pdt.wastage! * 100) * pdt.weight! * this.gst;
          } else if (pdt.category?.includes('kokkikolusu')) {
            pdt.price = (this.SR + pdt.wastage! * 100) * pdt.weight! * this.gst;
          } else if (pdt.category?.includes('thandai')) {
            pdt.price = (this.SR + pdt.wastage! * 100) * pdt.weight! * this.gst;
          } else if (
            pdt.category?.includes('vessel') &&
            pdt.metalType?.includes('silver')
          ) {
            pdt.price = pdt.weight! * 180;
          } else if (
            pdt.category?.includes('ring') &&
            pdt.metalType?.includes('silver')
          ) {
            pdt.price = pdt.weight! * 180;
          } else if (
            pdt.category?.includes('earing') &&
            pdt.metalType?.includes('silver')
          ) {
            pdt.price = pdt.weight! * 180;
          } else if (
            pdt.category?.includes('chain') &&
            pdt.metalType?.includes('silver')
          ) {
            pdt.price = pdt.weight! * 180;
          } else if (
            pdt.category?.includes('92silver') &&
            pdt.metalType?.includes('silver')
          ) {
            pdt.price = pdt.weight! * 350;
          } else if (
            pdt.category?.includes('stud') &&
            pdt.metalType?.includes('silver')
          ) {
            pdt.price = pdt.weight! * 350;
          } else if (
            pdt.category?.includes('goldplated') &&
            pdt.metalType?.includes('silver')
          ) {
            pdt.price = pdt.weight! * 400;
          } else if (
            pdt.category?.includes('metti') &&
            pdt.metalType?.includes('silver')
          ) {
            pdt.price = pdt.weight! * 200;
          } else if (
            pdt.category?.includes('bangles') &&
            pdt.metalType?.includes('silver')
          ) {
            pdt.price = pdt.weight! * 150;
          } else if (
            pdt.category?.includes('500mgcoin') &&
            pdt.metalType?.includes('coin')
          ) {
            pdt.price =
              (pdt.weight! + 0.15) * this.GR22 + this.gst * this.GR22!;
          } else if (
            pdt.category?.includes('coin') &&
            pdt.metalType?.includes('coin')
          ) {
            pdt.price =
              (this.GR22 + 200) * pdt.weight! +
              this.gst * pdt.weight! * this.GR22;
          }
          this.product = pdt;
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
  }

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

  //prduct details//
  detail: boolean = true;
  review: boolean = false;
  details() {
    this.detail = true;
    this.review = false;
  }
  reviews() {
    this.review = true;
    this.detail = false;
  }
}
