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
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgClass,
    TitleComponent,
  ],
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
  filteredProducts: any[] = [];

  constructor(
    private actRoute: ActivatedRoute,
    private service: ProductsService,
    private cartService: CartService,
    private router: Router,
    private GR: GoldSilverService,
    private fb: FormBuilder
  ) {
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
    this.loadRates();
    this.getProductById();
  }
  private loadRates(): void {
    this.GR.getRatesFromDB().subscribe((Items) => {
      Items.forEach((val) => {
        this.GR18 = val.gold18;
        this.GR22 = val.gold22;
        this.GR24 = val.gold24;
        this.SR = val.silver;
        this.gst = val.gst;
      });
    });
  }
  private getProductById(): void {
    this.actRoute.params.subscribe((params) => {
      if (params.id) {
        this.service.getProductById(params.id).subscribe((pdt) => {
          this.product = pdt;
          this.calculatePrice(pdt);
          console.log(this.product);
        });
      }
    });
  }

  private calculatePrice(pdt: jewelleryType): void {
    const weight = pdt.weight!;
    const gst = this.gst;
    const gr22 = this.GR22;
    const sr = this.SR;

    if (pdt.metalType?.includes('gold')) {
      pdt.price = (pdt.weight! * (pdt.wastage! + gst) + weight) * gr22 + 500;
    } else if (pdt.category?.includes('kolusu')) {
      pdt.price = (sr + (pdt.wastage! + gst) * 100) * weight;
    } else if (
      pdt.category?.includes('kokkikolusu') ||
      pdt.category?.includes('thandai')
    ) {
      pdt.price = (sr + pdt.wastage! * 100) * weight * gst;
    } else if (pdt.metalType?.includes('silver')) {
      if (
        pdt.category?.includes('92silver') ||
        pdt.category?.includes('stud')
      ) {
        pdt.price = weight * 350;
      } else if (pdt.category?.includes('goldplated')) {
        pdt.price = weight * 400;
      } else if (
        pdt.category?.includes('metti') ||
        pdt.category?.includes('sidemetti')
      ) {
        pdt.price = weight * 200;
      } else if (
        pdt.category?.includes('vessel') ||
        pdt.category?.includes('ring') ||
        pdt.category?.includes('earing') ||
        pdt.category?.includes('chain') ||
        pdt.category?.includes('bangles') ||
        pdt.category?.includes('bracelet')
      ) {
        pdt.price = weight * 180;
      }
    } else if (
      (pdt.category?.includes('bangles') ||
        pdt.category?.includes('bracelet')) &&
      pdt.category?.includes('silver92')
    ) {
      pdt.price = weight * 280;
    } else if (pdt.metalType?.includes('coin')) {
      if (pdt.category?.includes('500mgcoin')) {
        pdt.price = (weight + 0.15) * gr22 + gst * gr22 * weight;
      } else if (
        !pdt.category?.includes('500mgcoin') &&
        pdt.category?.includes('coin')
      ) {
        pdt.price = (gr22 + 300) * weight + gst * weight * gr22;
      }
    }
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

    this.GR.addReviews({
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
}
