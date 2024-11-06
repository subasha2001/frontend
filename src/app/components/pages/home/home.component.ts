import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { BASE_URL } from '../../../shared/models/constants/urls';

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
    if (pdt.metalType?.includes('gold')) {
      pdt.price =
        (pdt.weight! * (pdt.wastage! + this.gst) + pdt.weight!) * this.GR22 +
        500;
    } else if (pdt.category?.includes('kolusu')) {
      pdt.price = (this.SR + (pdt.wastage! + this.gst) * 100) * pdt.weight!;
    } else if (pdt.category?.includes('kokkikolusu')) {
      pdt.price = (this.SR + pdt.wastage! * 100) * pdt.weight! * this.gst;
    } else if (pdt.category?.includes('thandai')) {
      pdt.price = (this.SR + pdt.wastage! * 100) * pdt.weight! * this.gst;
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
      pdt.category?.includes('coin') &&
      pdt.metalType?.includes('coin')
    ) {
      pdt.price =
        (this.GR22 + 200) * pdt.weight! + this.gst * pdt.weight! * this.GR22;
    } else if (
      pdt.category?.includes('500mgcoin') &&
      pdt.metalType?.includes('coin')
    ) {
      pdt.price = (pdt.weight! + 0.15) * this.GR22 + this.gst * this.GR22!;
      console.log(pdt.price);
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
}
// 500mg - 4934
// 1g - 7900
