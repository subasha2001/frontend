import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { jewelleryType } from '../../../shared/models/productType';
import { ProductsService } from '../../../services/products.service';
import { Observable } from 'rxjs';
import { PageNotFoundComponent } from "../../partials/page-not-found/page-not-found.component";
import { TitleComponent } from '../../partials/title/title.component';
import { BASE_URL } from '../../../shared/models/constants/urls';
@Component({
  selector: 'app-diamond-jewels',
  standalone: true,
  imports: [PageNotFoundComponent, CommonModule, RouterLink, TitleComponent],
  templateUrl: './diamond-jewels.component.html',
  styleUrl: './diamond-jewels.component.css',
})
export class DiamondJewelsComponent {
  products: jewelleryType[] = [];
  baseurl = BASE_URL;
  filteredProducts: any[] = [];
  availableSizes: any = 0;
  selectedSizes: string[] = [];
  sizeCounts: { [size: string]: number } = {};
  sortOrder: 'ascending' | 'descending' | null = null;

  constructor(
    private service: ProductsService,
    private actRoute: ActivatedRoute
  ) {
    actRoute.params.subscribe((params) => {
      let productsObservable: Observable<jewelleryType[]>;
      if (params.categoryName) {
        productsObservable = this.service.getProductsByCategory(
          params.categoryName
        );
      } else {
        productsObservable = this.service.getAllProducts();
      }

      productsObservable.subscribe((Products) => {
        this.products = Products;

        this.sizeCounts = this.products.reduce((counts: any, product) => {
          if (product.metalType?.includes('diamond')) {
            counts[product.size] = (counts[product.size] || 0) + 1;
          }
          return counts;
        }, {});

        this.availableSizes = [
          ...new Set(
            this.products
              .filter((product) => product.metalType?.includes('diamond'))
              .map((product) => product.size)
          ),
        ].sort((a, b) => parseFloat(a) - parseFloat(b));

        this.filteredProducts = this.products.filter((product) =>
          product.metalType?.includes('diamond')
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
}