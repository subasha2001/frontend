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
import { BASE_URL } from '../../../shared/models/constants/urls';
import { Category } from '../../../shared/models/categories';

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
  baseurl = BASE_URL;
  filteredProducts: any[] = [];
  availableSizes: any = 0;
  selectedSizes: string[] = [];
  sizeCounts: { [size: string]: number } = {};
  // categories?: Category[];

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
                    (this.SR + (pdt.wastage! + this.gst) * 100) * pdt.weight!;
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
                  pdt.category?.includes('silver92')
                ) {
                  pdt.price = pdt.weight! * 280;
                } else if (
                  pdt.category?.includes('bangles') &&
                  pdt.metalType?.includes('silver')
                ) {
                  pdt.price = pdt.weight! * 180;
                } else if (
                  pdt.category?.includes('bracelet') &&
                  pdt.category?.includes('silver')
                ) {
                  pdt.price = pdt.weight! * 180;
                } else if (
                  pdt.category?.includes('bracelet') &&
                  pdt.category?.includes('silver92')
                ) {
                  pdt.price = pdt.weight! * 280;
                } else if (
                  pdt.category?.includes('500mgcoin') &&
                  pdt.metalType?.includes('coin')
                ) {
                  pdt.price =
                    (pdt.weight! + 0.15) * this.GR22 + this.gst * this.GR22!;
                  console.log(pdt.price);
                } else if (
                  pdt.category?.includes('coin') &&
                  pdt.metalType?.includes('coin')
                ) {
                  pdt.price =
                    (this.GR22 + 200) * pdt.weight! +
                    this.gst * pdt.weight! * this.GR22;
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
                    (this.SR + (pdt.wastage! + this.gst) * 100) * pdt.weight!;
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
                  pdt.category?.includes('silver92')
                ) {
                  pdt.price = pdt.weight! * 280;
                } else if (
                  pdt.category?.includes('bangles') &&
                  pdt.metalType?.includes('silver')
                ) {
                  pdt.price = pdt.weight! * 180;
                } else if (
                  pdt.category?.includes('bracelet') &&
                  pdt.category?.includes('silver')
                ) {
                  pdt.price = pdt.weight! * 180;
                } else if (
                  pdt.category?.includes('bracelet') &&
                  pdt.category?.includes('silver92')
                ) {
                  pdt.price = pdt.weight! * 280;
                } else if (
                  pdt.category?.includes('500mgcoin') &&
                  pdt.metalType?.includes('coin')
                ) {
                  pdt.price =
                    (pdt.weight! + 0.15) * this.GR22 + this.gst * this.GR22!;
                  console.log(pdt.price);
                } else if (
                  pdt.category?.includes('coin') &&
                  pdt.metalType?.includes('coin')
                ) {
                  pdt.price =
                    (this.GR22 + 200) * pdt.weight! +
                    this.gst * pdt.weight! * this.GR22;
                }
                return pdt;
              });
            })
          );
      } else if (params.searchTerm) {
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
                  pdt.category?.includes('bangles') &&
                  pdt.category?.includes('silver92')
                ) {
                  pdt.price = pdt.weight! * 280;
                } else if (
                  pdt.category?.includes('bangles') &&
                  pdt.metalType?.includes('silver')
                ) {
                  pdt.price = pdt.weight! * 180;
                } else if (
                  pdt.category?.includes('bracelet') &&
                  pdt.category?.includes('silver')
                ) {
                  pdt.price = pdt.weight! * 180;
                } else if (
                  pdt.category?.includes('bracelet') &&
                  pdt.category?.includes('silver92')
                ) {
                  pdt.price = pdt.weight! * 280;
                } else if (
                  pdt.category?.includes('500mgcoin') &&
                  pdt.metalType?.includes('coin')
                ) {
                  pdt.price =
                    (pdt.weight! + 0.15) * this.GR22 + this.gst * this.GR22!;
                  console.log(pdt.price);
                } else if (
                  pdt.category?.includes('coin') &&
                  pdt.metalType?.includes('coin')
                ) {
                  pdt.price =
                    (this.GR22 + 200) * pdt.weight! +
                    this.gst * pdt.weight! * this.GR22;
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

    this.sizeCounts = this.products.reduce((counts:any, product) => {
      counts[product.size] = (counts[product.size] || 0) + 1;
      return counts;
    }, {});

    this.availableSizes = [
      ...new Set(this.products.map((product) => product.size).filter(size => size))
    ].sort((a, b) => {
      return parseFloat(a) - parseFloat(b); // Sort sizes as numbers
    });
    // service.getAllCategory().subscribe((serveCategories) => {
    //   this.categories = serveCategories;
    // });
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
      this.filteredProducts = this.products.filter((product) =>
        this.selectedSizes.includes(product.size)
      );
    } else {
      this.filteredProducts = [...this.products];
    }
  }

  sortProducts(order: string, event: any): void {
    if (event.target.checked) {
      const otherOrder = order === 'ascending' ? 'descending' : 'ascending';

      this.filteredProducts.sort((a, b) => {
        return order === 'ascending' ? a.price - b.price : b.price - a.price;
      });
    } else {
      this.filteredProducts = [...this.products];
    }
  }
}
// 500mg - 4934
// 1g - 7900