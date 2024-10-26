import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { jewelleryType } from '../../../shared/models/productType';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SearchComponent } from '../../partials/search/search.component';
import { ImageSliderComponent } from '../../partials/banner/banner.component';
import { PageNotFoundComponent } from '../../partials/page-not-found/page-not-found.component';
import { TitleComponent } from '../../partials/title/title.component';
import { GoldSilverService } from '../../../services/gold-silver.service';
import { rates } from '../../../shared/models/rates';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SearchComponent,
    ImageSliderComponent,
    TitleComponent,
    PageNotFoundComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  GR18!: number;
  GR22!: number;
  GR24!: number;
  SR!: number;
  gst!: number;
  products: jewelleryType[] = [];

  constructor(
    private service: ProductsService,
    actRoute: ActivatedRoute,
    private GR: GoldSilverService
  ) {
    actRoute.params.subscribe((params) => {
      let ratesObservable: Observable<rates[]> = this.GR.getRatesFromDB();
      ratesObservable.subscribe((Items) => {
        Items.forEach((val) => {
          this.GR18 = val.gold18;
          this.GR22 = val.gold22;
          this.GR24 = val.gold24;
          this.SR = val.silver;
          this.gst = val.gst;
        });
      });

      let productsObservable: Observable<jewelleryType[]>;
      if (params.metalTypeName) {
        productsObservable = this.service
          .getProductsByMetalType(params.metalTypeName)
          .pipe(
            map((products) => {
              return products.map((pdt) => {
                if (pdt.metalType?.includes('gold')) {
                  pdt.price =
                    (pdt.weight! * (pdt.wastage! + this.gst) + pdt.weight!) *
                      this.GR22 +
                    500;
                } else if (pdt.category?.includes('kolusu')) {
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
                } else if (
                  pdt.category?.includes('500mgcoin') &&
                  pdt.metalType?.includes('coin')
                ) {
                  pdt.price = (pdt.weight! + 0.15) * this.GR22 * (this.gst+pdt.weight!);
                }
                return pdt;
              });
            })
          );
      } else if (params.categoryName) {
        productsObservable = this.service
          .getProductsByCategory(params.categoryName)
          .pipe(
            map((products) => {
              return products.map((pdt) => {
                if (pdt.metalType?.includes('gold')) {
                  pdt.price =
                    (pdt.weight! * (pdt.wastage! + this.gst) + pdt.weight!) *
                      this.GR22 +
                    500;
                } else if (pdt.category?.includes('kolusu')) {
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
                  pdt.category?.includes('500mgcoin') &&
                  pdt.metalType?.includes('coin')
                ) {
                  pdt.price = (pdt.weight! + 0.150) * this.GR22 * (this.gst*pdt.weight!);
                }
                return pdt;
              });
            })
          );
      }else if(params.searchTerm){
        productsObservable = this.service
          .getProductsBySearchTerm(params.searchTerm)
          .pipe(
            map((products) => {
              return products.map((pdt) => {
                if (pdt.metalType?.includes('gold')) {
                  pdt.price =
                    (pdt.weight! * (pdt.wastage! + this.gst) + pdt.weight!) *
                      this.GR22 +
                    500;
                } else if (pdt.category?.includes('kolusu')) {
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
                  pdt.category?.includes('500mgcoin') &&
                  pdt.metalType?.includes('coin')
                ) {
                  pdt.price =
                    (pdt.weight! + 0.15) * this.GR22 * (this.gst * pdt.weight!);
                }
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
}
