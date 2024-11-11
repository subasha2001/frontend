import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { jewelleryType } from '../../../shared/models/productType';
import { ProductsService } from '../../../services/products.service';
import { map, Observable } from 'rxjs';
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
  ) { }

  private loadProducts(): void {
    const category = this.actRoute.snapshot.paramMap.get('categoryName');
    const metalType = this.actRoute.snapshot.paramMap.get('metalTypeName');

    let productsObservable: Observable<jewelleryType[]>;
    if (metalType) {
      productsObservable = this.service.getProductsByMetalType(metalType);
    } else if (category) {
      productsObservable = this.service.getProductsByCategory(category);
    } else {
      productsObservable = this.service.getAllProducts();
    }

    productsObservable
      .pipe(
        map((products) => {
          return products
            .filter((product) => product.metalType?.includes('diamond'));
        })
      )
      .subscribe((products) => {
        this.products = products;
        this.filteredProducts = products;
        this.updateSizeCounts();
        this.populateAvailableSizes();
        this.applyFilters();
      });
  }

  private updateSizeCounts(): void {
    this.sizeCounts = this.products.reduce((counts: any, product) => {
      counts[product.size] = (counts[product.size] || 0) + 1;
      return counts;
    }, {});
  }

  private populateAvailableSizes(): void {
    this.availableSizes = [
      ...new Set(this.products.map((product) => product.size)),
    ]
      .filter((size) => size)
      .sort((a, b) => parseFloat(a) - parseFloat(b));
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

  sortProducts(order: string, event: any): void {
    const sortOrder = order === 'ascending' ? 1 : -1;
    this.filteredProducts.sort((a, b) => (a.price - b.price) * sortOrder);
  }
  ngOnInit(): void {
    this.actRoute.paramMap.subscribe((params) => {
      this.loadProducts();
    });
  }
}