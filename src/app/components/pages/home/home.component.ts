import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { jewelleryType } from '../../../shared/models/productType';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from '../../partials/page-not-found/page-not-found.component';
import { TitleComponent } from '../../partials/title/title.component';
import { GoldSilverService } from '../../../services/gold-silver.service';
import { BASE_URL } from '../../../shared/models/constants/urls';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, TitleComponent, PageNotFoundComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
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

  constructor(
    private service: ProductsService,
    private actRoute: ActivatedRoute,
    private GR: GoldSilverService
  ) {}
  ngOnInit(): void {
    this.actRoute.paramMap.subscribe((params) => {
      this.loadRates();
      this.loadProducts();
    });
  }

  private loadRates(): void {
    this.GR.getRatesFromDB().subscribe((Items) => {
      Items.forEach((val) => {
        this.GR18 = val.gold18;
        this.GR22 = val.gold22;
        this.GR24 = val.gold24;
        this.SR = val.silver;
        this.gst = val.gst;
      });
    });
  }

  private loadProducts(): void {
    const category = this.actRoute.snapshot.paramMap.get('categoryName');
    const metalType = this.actRoute.snapshot.paramMap.get('metalTypeName');
    const searchTerm = this.actRoute.snapshot.paramMap.get('searchTerm');

    let productsObservable: Observable<jewelleryType[]>;
    if (metalType) {
      productsObservable = this.service.getProductsByMetalType(metalType);
    } else if (category) {
      productsObservable = this.service.getProductsByCategory(category);
    } else if (searchTerm) {
      productsObservable = this.service.getProductsBySearchTerm(searchTerm);
    } else {
      productsObservable = this.service.getAllProducts();
    }

    productsObservable
      .pipe(
        map((products) => {
          return products.map((pdt) => this.calculateProductPrice(pdt));
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
      //below 500mg gold
      pdt.weight! <= 0.5
    ) {
      const value = ((weight + 0.15) * this.GR22) + 150; //0.491g //7080rs = 4688.28
      const gst = value * this.gst;                      //3%  = 140.6484
      pdt.price = value + gst;                           //   4688.28 + 140.6484
    } else if (
      pdt.metalType?.includes('gold') &&
      pdt.category?.includes('18KT')
    ) {
      //18KT (75H)
      const value = (weight + weight * wastage) * this.GR18 + 500;
      const gst = value * this.gst;
      pdt.price = value + gst;
    } else if (
      //above 500mg gold
      pdt.metalType?.includes('gold') &&
      pdt.weight! < 1 &&
      pdt.weight! > 0.5
    ) {
      const value = (weight + 0.2) * this.GR22 + 200;
      const gst = value * this.gst;
      pdt.price = value + gst;
    } else if (
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
    //coins price calculation
    else if (pdt.metalType?.includes('coin')) {
      if (
        pdt.category?.includes('500mgcoin')
      ) {
        const value = (weight + 0.15) * this.GR22;
        const gst = value * this.gst;
        pdt.price = value + gst;
      } else if (
        !pdt.category?.includes('500mgcoin') &&
        pdt.category?.includes('coin')
      ) {
        const value = (this.GR22 + 200) * weight;
        const gst = value * this.gst;
        pdt.price = value + gst;
      }
    }else if (pdt.metalType?.includes('gold')) {
      //22KT(916)
      const value = (weight + (weight * wastage)) * this.GR22 + 500;
      const gst = value * this.gst;
      pdt.price = value + gst;
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

  //to show the filters section//
  isFiltersVisible = false;
  toggleFilters() {
    this.isFiltersVisible = !this.isFiltersVisible;
  }
  //to show the filters section//
}
// 500mg - 4934
// 1g - 7900
