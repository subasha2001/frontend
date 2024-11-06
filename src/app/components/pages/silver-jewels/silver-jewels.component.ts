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
  filteredProducts: any[] = [];
  availableSizes: any = 0;
  selectedSizes: string[] = [];
  sizeCounts: { [size: string]: number } = {};
  sortOrder: 'ascending' | 'descending' | null = null;

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

        this.sizeCounts = this.products.reduce((counts: any, product) => {
          if (product.metalType?.includes('silver')) {
            counts[product.size] = (counts[product.size] || 0) + 1;
          }
          return counts;
        }, {});

        this.availableSizes = [
          ...new Set(
            this.products
              .filter((product) => product.metalType?.includes('silver'))
              .map((product) => product.size)
          ),
        ].sort((a, b) => parseFloat(a) - parseFloat(b));

        this.filteredProducts = this.products.filter((product) =>
          product.metalType?.includes('silver')
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