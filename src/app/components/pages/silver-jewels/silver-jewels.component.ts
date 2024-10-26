import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SearchComponent } from '../../partials/search/search.component';
import { jewelleryType } from '../../../shared/models/productType';
import { ProductsService } from '../../../services/products.service';
import { map, Observable } from 'rxjs';
import { PageNotFoundComponent } from "../../partials/page-not-found/page-not-found.component";
import { TitleComponent } from '../../partials/title/title.component';
import { rates } from '../../../shared/models/rates';
import { GoldSilverService } from '../../../services/gold-silver.service';
import { BASE_URL } from '../../../shared/models/constants/urls';

@Component({
  selector: 'app-silver-jewels',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SearchComponent,
    PageNotFoundComponent,
    TitleComponent,
  ],
  templateUrl: './silver-jewels.component.html',
  styleUrl: './silver-jewels.component.css',
})
export class SilverJewelsComponent implements OnInit {
  products: jewelleryType[] = [];
  SR!: number;
  gst!: number;
  baseurl = BASE_URL;

  constructor(
    private service: ProductsService,
    actRoute: ActivatedRoute,
    private GR: GoldSilverService
  ) {
    actRoute.params.subscribe((params) => {
      let ratesObservable: Observable<rates[]> = this.GR.getRatesFromDB();
      ratesObservable.subscribe((Items) => {
        Items.forEach((val) => {
          this.SR = val.silver;
          this.gst = val.gst;
        });
      });

      let productsObservable: Observable<jewelleryType[]>;
      if (params.categoryName) {
        productsObservable = this.service
          .getProductsByCategory(params.categoryName)
          .pipe(
            map((products) => {
              return products.map((pdt) => {
                if (pdt.category?.includes('kolusu')) {
                  pdt.price =
                    (this.SR + pdt.wastage! * 100) * pdt.weight! * this.gst;
                } else if (pdt.category?.includes('kokkikolusu')) {
                  pdt.price =
                    (this.SR + pdt.wastage! * 100) * pdt.weight! * this.gst;
                } else if (pdt.category?.includes('thandai')) {
                  pdt.price =
                    (this.SR + pdt.wastage! * 100) * pdt.weight! * this.gst;
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
                }
                console.log(pdt);
                return pdt;
              });
            })
          );
      } else {
        productsObservable = this.service.getAllProducts();
      }

      productsObservable.subscribe((Products) => {
        this.products = Products;
      });
    });
  }
  ngOnInit(): void {}
}