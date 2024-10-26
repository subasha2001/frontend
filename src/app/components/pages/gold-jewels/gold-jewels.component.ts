import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { jewelleryType } from '../../../shared/models/productType';
import { ProductsService } from '../../../services/products.service';
import { map, Observable } from 'rxjs';
import { PageNotFoundComponent } from "../../partials/page-not-found/page-not-found.component";
import { TitleComponent } from '../../partials/title/title.component';
import { rates } from '../../../shared/models/rates';
import { GoldSilverService } from '../../../services/gold-silver.service';

@Component({
  selector: 'app-gold-jewels',
  standalone: true,
  imports: [CommonModule, RouterLink, PageNotFoundComponent, TitleComponent],
  templateUrl: './gold-jewels.component.html',
  styleUrl: './gold-jewels.component.css',
})
export class GoldJewelsComponent {
  products: jewelleryType[] = [];
  GR18!: number;
  GR22!: number;
  GR24!: number;
  gst!: number;

  constructor(
    private service: ProductsService,
    actRoute: ActivatedRoute,
    private GS: GoldSilverService
  ) {
    actRoute.params.subscribe((params) => {
      let ratesObservable: Observable<rates[]> = this.GS.getRatesFromDB();
      ratesObservable.subscribe((Items) => {
        Items.forEach((val) => {
          this.GR18 = val.gold18;
          this.GR22 = val.gold22;
          this.GR24 = val.gold24;
          this.gst = val.gst;
        });
      });

      let productsObservable: Observable<jewelleryType[]>;
      if (params.metalTypeName) {
        productsObservable = this.service.getProductsByMetalType(
          params.metalTypeName
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
}