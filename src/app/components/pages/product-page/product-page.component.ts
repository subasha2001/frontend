import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { jewelleryType } from '../../../shared/models/productType';
import { CommonModule, NgClass } from '@angular/common';
import { CartService } from '../../../services/cart.service';
import { GoldSilverService } from '../../../services/gold-silver.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BASE_URL } from '../../../shared/models/constants/urls';
import { TitleComponent } from '../../partials/title/title.component';
import { ToastrService } from 'ngx-toastr';

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
    private fb: FormBuilder,
    private toastr: ToastrService
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
          this.calculatePrice(pdt);
          this.product = pdt;
          console.log(this.product);
        });
      }
    });
  }

  private calculatePrice(pdt: jewelleryType): jewelleryType {
    const weight = pdt.weight!;
    const wastage = pdt.wastage!;
    const sr = this.SR;

    if (pdt.metalType?.includes('gold')) {
      //22KT(916)
      const value = (weight + weight * wastage) * this.GR22 + 500;
      const gst = value * this.gst;
      pdt.price = value + gst;
    } else if (
      pdt.metalType?.includes('gold') &&
      pdt.category?.includes('18KT')
    ) {
      //18KT (75H)
      const value = (weight + weight * wastage) * this.GR18 + 500;
      const gst = value * this.gst;
      pdt.price = value + gst;
    } else if (
      //above 500mg gold
      pdt.metalType?.includes('gold') &&
      pdt.weight! < 1 &&
      pdt.weight! > 0.5
    ) {
      const value = (weight + 0.2) * this.GR22 + 200;
      const gst = value * this.gst;
      pdt.price = value + gst;
    } else if (
      //below 500mg gold
      pdt.metalType?.includes('gold') &&
      pdt.weight! <= 0.5
    ) {
      const value = (weight + 0.15) * this.GR22 + 150;
      const gst = value * this.gst;
      pdt.price = value + gst;
    } else if (
      pdt.category?.includes('kolusu') ||
      pdt.category?.includes('kokkikolusu') ||
      pdt.category?.includes('thandai')
    ) {
      //weight = 50g, wastage = 22%(0.22), sr = 101, gst = 3%(0.03)
      const value = (weight + weight * wastage) * sr; //(50 + (50*0.22)) * 101 = (50+11) * 101 = 6161
      const gst = value * this.gst; //6161 * 0.03 = 184.83
      pdt.price = value + gst; // 6161 + 184.83 = 6345.83
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
    } //coins price calculation
    else if (pdt.metalType?.includes('coin')) {
      if (pdt.category?.includes('500mgcoin')) {
        const value = (weight + 0.15) * this.GR22;
        const gst = value * this.gst;
        pdt.price = value + gst;
      } else if (
        !pdt.category?.includes('500mgcoin') &&
        pdt.category?.includes('coin')
      ) {
        const value = (this.GR22 + 200) * weight;
        const gst = value * this.gst;
        pdt.price = value + gst;
      }
    }
    return pdt;
  }

  addToCart() {
    if (this.product.stock > 0 && this.product.price) {
      this.cartService.addToCart(this.product);
      this.router.navigateByUrl('/cart');
    } else {
      window.location.reload();
      alert('Sorry, this product is out of stock.');
    }
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
