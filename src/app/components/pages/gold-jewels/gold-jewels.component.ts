import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { jewelleryType } from '../../../shared/models/productType';
import { ProductsService } from '../../../services/products.service';
import { map, Observable } from 'rxjs';
import { PageNotFoundComponent } from '../../partials/page-not-found/page-not-found.component';
import { TitleComponent } from '../../partials/title/title.component';
import { rates } from '../../../shared/models/rates';
import { GoldSilverService } from '../../../services/gold-silver.service';
import { BASE_URL } from '../../../shared/models/constants/urls';

@Component({
  selector: 'app-gold-jewels',
  standalone: true,
  imports: [CommonModule, RouterLink, PageNotFoundComponent, TitleComponent],
  templateUrl: './gold-jewels.component.html',
  styleUrl: './gold-jewels.component.css',
})
export class GoldJewelsComponent implements OnInit {
  products: jewelleryType[] = [];
  GR18!: number;
  GR22!: number;
  GR24!: number;
  gst!: number;
  baseurl = BASE_URL;
  filteredProducts: jewelleryType[] = [];
  availableSizes: any = 0;
  selectedSizes: string[] = [];

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
        productsObservable = this.service.getProductsByMetalType(params.metalTypeName);
      } else if (params.categoryName) {
        productsObservable = this.service
          .getProductsByCategory(params.categoryName)
          .pipe(
            map((products) => {
              return products.map((pdt) => {
                if (pdt.metalType?.includes('gold')) {
                  pdt.price = (pdt.weight! * (pdt.wastage! + this.gst) + pdt.weight!) * this.GR22 + 500;
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

    this.availableSizes = [
      ...new Set(this.products.map((product) => product.size)),
    ];
  }
  ngOnInit(): void {
    this.applyFilters();
  }
  onChange(size: string, event: any): void {
    if (event.target.checked) {
      this.selectedSizes.push(size);
    } else {
      this.selectedSizes = this.selectedSizes.filter((s) => s !== size);
    }

    this.applyFilters();
  }

  applyFilters(): void {
    if (this.selectedSizes.length > 0) {
      this.filteredProducts = this.products.filter((product) => this.selectedSizes.includes(product.size));
    } else {
      this.filteredProducts = [...this.products];
    }
  }
}