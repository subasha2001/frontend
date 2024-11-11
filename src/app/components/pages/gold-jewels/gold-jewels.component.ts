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
  sizeCounts: { [size: string]: number } = {};
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
                if (pdt.metalType?.includes('gold')) {
                  pdt.price =
                    (pdt.weight! * (pdt.wastage! + this.gst) + pdt.weight!) *
                      this.GR22 +
                    500;
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

        this.sizeCounts = this.products.reduce((counts: any, product) => {
          if (product.metalType?.includes('gold')) {
            counts[product.size] = (counts[product.size] || 0) + 1;
          }
          return counts;
        }, {});

        this.availableSizes = [
          ...new Set(
            this.products
              .filter((product) => product.metalType?.includes('gold'))
              .map((product) => product.size)
          ),
        ].sort((a, b) => parseFloat(a) - parseFloat(b));

        this.filteredProducts = this.products.filter((product) =>
          product.metalType?.includes('gold')
        );
      });
    });
  }
  onChange(size: string, event: any): void {
    if (event.target.checked) {
      this.selectedSizes.push(size);
    } else {
      this.selectedSizes = this.selectedSizes.filter((s) => s !== size);
    }

    this.applyFilters();
  }

  genderOptions = ['men', 'women', 'kids'];
  selectedGenders: string[] = [];
  onGenderChange(gender: string, event: any): void {
    if (event.target.checked) {
      this.selectedGenders.push(gender);
    } else {
      this.selectedGenders = this.selectedGenders.filter((g) => g !== gender);
    }
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.products;

    if (this.selectedSizes.length > 0) {
      filtered = filtered.filter((product) =>
        this.selectedSizes.includes(product.size)
      );
    }

    if (this.selectedGenders.length > 0) {
      filtered = filtered.filter((product) =>
        this.selectedGenders.some((gender) =>
          product.category?.includes(gender)
        )
      );
    }

    this.filteredProducts = filtered;
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
    this.applyFilters();
    this.applySorting();
  }

  //to show the filters section//
  isFiltersVisible = false;
  toggleFilters() {
    this.isFiltersVisible = !this.isFiltersVisible;
  }
  //to show the filters section//
}