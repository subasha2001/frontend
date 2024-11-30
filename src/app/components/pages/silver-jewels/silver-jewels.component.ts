import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { jewelleryType } from '../../../shared/models/productType';
import { ProductsService } from '../../../services/products.service';
import { map, Observable } from 'rxjs';
import { PageNotFoundComponent } from "../../partials/page-not-found/page-not-found.component";
import { TitleComponent } from '../../partials/title/title.component';
import { GoldSilverService } from '../../../services/gold-silver.service';
import { BASE_URL } from '../../../shared/models/constants/urls';

@Component({
  selector: 'app-silver-jewels',
  standalone: true,
  imports: [CommonModule, RouterLink, PageNotFoundComponent, TitleComponent],
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
    private actRoute: ActivatedRoute,
    private GR: GoldSilverService
  ) {}

  private loadRates(): void {
    this.GR.getRatesFromDB().subscribe((Items) => {
      Items.forEach((val) => {
        this.SR = val.silver;
        this.gst = val.gst;
      });
    });
  }

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
            .map((pdt) => this.calculateProductPrice(pdt))
            .filter((product) => product.metalType?.includes('silver'));
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

  private calculateProductPrice(pdt: jewelleryType): jewelleryType {
    const weight = pdt.weight!;
    const wastage = pdt.wastage!;
    const sr = this.SR;

    if (
      pdt.category?.includes('kolusu') ||
      pdt.category?.includes('kokkikolusu') ||
      pdt.category?.includes('thandai')
    ) {
      const value = (weight + weight * wastage) * sr; //50g , 22%, 101 = 6161
      const gst = value * this.gst;                   //6161 * 0.03 = 184.83
      pdt.price = value + gst;                        // 6161 + 184.83 = 6345.83
    } else if (pdt.metalType?.includes('silver')) {
      if (
        pdt.category?.includes('92silver') ||
        pdt.category?.includes('stud')
      ) {
        pdt.price = weight * 350;
      } else if (pdt.category?.includes('goldplated')) {
        pdt.price = weight * 400;
      } else if (
        pdt.category?.includes('metti') ||
        pdt.category?.includes('sidemetti')
      ) {
        pdt.price = weight * 200;
      } else if (
        pdt.category?.includes('vessel') ||
        pdt.category?.includes('ring') ||
        pdt.category?.includes('earing') ||
        pdt.category?.includes('chain') ||
        pdt.category?.includes('bangles') ||
        pdt.category?.includes('bracelet')
      ) {
        pdt.price = weight * 180;
      }
    } else if (
      (pdt.category?.includes('bangles') ||
        pdt.category?.includes('bracelet')) &&
      pdt.category?.includes('silver92')
    ) {
      pdt.price = weight * 280;
    }
    return pdt;
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
      this.loadRates();
    });
  }
}