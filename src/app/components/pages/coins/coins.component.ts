import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { jewelleryType } from '../../../shared/models/productType';
import { ProductsService } from '../../../services/products.service';
import { map, Observable } from 'rxjs';
import { PageNotFoundComponent } from '../../partials/page-not-found/page-not-found.component';
import { TitleComponent } from '../../partials/title/title.component';
import { GoldSilverService } from '../../../services/gold-silver.service';
import { BASE_URL } from '../../../shared/models/constants/urls';

@Component({
  selector: 'app-coins',
  standalone: true,
  imports: [CommonModule, RouterLink, PageNotFoundComponent, TitleComponent],
  templateUrl: './coins.component.html',
  styleUrl: './coins.component.css',
})
export class CoinsComponent implements OnInit {
  products: jewelleryType[] = [];
  GR18!: number;
  GR22!: number;
  GR24!: number;
  gst!: number;
  baseurl = BASE_URL;
  filteredProducts: jewelleryType[] = [];
  sortOrder: 'ascending' | 'descending' | null = null;

  constructor(
    private service: ProductsService,
    actRoute: ActivatedRoute,
    private GS: GoldSilverService
  ) {
    actRoute.params.subscribe((params) => {
      this.GS.getRatesFromDB().subscribe((Items) => {
        Items.forEach((val) => {
          this.GR18 = val.gold18;
          this.GR22 = val.gold22;
          this.GR24 = val.gold24;
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
                if (pdt.metalType?.includes('coin')) {
                  if (pdt.category?.includes('500mgcoin')) {
                    const value = (pdt.weight! + 0.15) * this.GR22;
                    const gst = value * this.gst;
                    pdt.price = value + gst;
                  } else if (
                    !pdt.category?.includes('500mgcoin') &&
                    pdt.category?.includes('coin')
                  ) {
                    const value = (this.GR22 + 200) * pdt.weight!;
                    const gst = value * this.gst;
                    pdt.price = value + gst;
                  }
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
        this.filteredProducts = this.products.filter((product) =>
          product.metalType?.includes('coin')
        );
      });
    });
  }

  applySorting(): void {
    if (this.sortOrder) {
      this.filteredProducts.sort((a, b) =>
        this.sortOrder === 'ascending' ? a.price - b.price : b.price - a.price
      );
    }
  }

  sortProducts(order: string, event: any): void {
    if (event.target.checked) {
      this.sortOrder = order as 'ascending' | 'descending';
    } else {
      this.sortOrder = null;
    }

    this.applySorting();
  }
  ngOnInit(): void {
    this.applySorting();
  }

  //to show the filters section//
  isFiltersVisible = false;
  toggleFilters() {
    this.isFiltersVisible = !this.isFiltersVisible;
  }
  //to show the filters section//
}
// 500mg - 4934
// 1g - 7900
