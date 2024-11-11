import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { jewelleryType } from '../../../shared/models/productType';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SearchComponent } from '../../partials/search/search.component';
import { ImageSliderComponent } from '../../partials/banner/banner.component';
import { bannerType } from '../../../shared/models/bannerType';
import { PortoSliderComponent } from '../../partials/porto-slider/porto-slider.component';
import { CategoriesComponent } from '../../partials/categories/categories.component';
import { PageNotFoundComponent } from '../../partials/page-not-found/page-not-found.component';
import { TitleComponent } from '../../partials/title/title.component';
import { GoldSilverService } from '../../../services/gold-silver.service';
import { ReviewsComponent } from '../../partials/reviews/reviews.component';
import { BASE_URL } from '../../../shared/models/constants/urls';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SearchComponent,
    ImageSliderComponent,
    PortoSliderComponent,
    CategoriesComponent,
    PageNotFoundComponent,
    TitleComponent,
    ReviewsComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  GR18!: number;
  GR22!: number;
  GR24!: number;
  SR!: number;
  gst!: number;
  products: jewelleryType[] = [];
  bannerImages: bannerType[] = [];
  baseurl = BASE_URL;

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
          this.SR = val.silver;
          this.gst = val.gst;
        });
      });

      let bannerObservable: Observable<bannerType[]> =
        this.service.getBannerItems();
      bannerObservable.subscribe((Items) => {
        this.bannerImages = Items;
      });
    });
  }
  private loadProducts(): void {
    let productsObservable: Observable<jewelleryType[]> =
      this.service.getAllProducts();

    productsObservable
      .pipe(
        map(
          (products) =>
            products
              .filter((pdt) => pdt.category?.includes('featured'))
              .map((pdt) => this.calculateProductPrice(pdt))
        ),
        map((featuredProducts) => this.getRandomProducts(featuredProducts, 5))
      )
      .subscribe((Products) => {
        this.products = Products;
      });
  }
  private calculateProductPrice(pdt: jewelleryType): jewelleryType {
    const weight = pdt.weight!;
    const gst = this.gst;
    const gr22 = this.GR22;
    const sr = this.SR;

    if (pdt.metalType?.includes('gold')) {
      pdt.price = (pdt.weight! * (pdt.wastage! + gst) + weight) * gr22 + 500;
    } else if (pdt.category?.includes('kolusu')) {
      pdt.price = (sr + (pdt.wastage! + gst) * 100) * weight;
    } else if (
      pdt.category?.includes('kokkikolusu') ||
      pdt.category?.includes('thandai')
    ) {
      pdt.price = (sr + pdt.wastage! * 100) * weight * gst;
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
    } else if (pdt.metalType?.includes('coin')) {
      if (pdt.category?.includes('500mgcoin')) {
        pdt.price = (weight + 0.15) * gr22 + gst * gr22 * weight;
      } else if (
        !pdt.category?.includes('500mgcoin') &&
        pdt.category?.includes('coin')
      ) {
        pdt.price = (gr22 + 300) * weight + gst * weight * gr22;
      }
    }

    return pdt;
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  private getRandomProducts(
    products: jewelleryType[],
    count: number
  ): jewelleryType[] {
    let shuffled = products.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  //porto slider contents//
  porto: any[] = [
    { img: 'assets/images/porto/bestPrice.png', name: 'Best Price' },
    { img: 'assets/images/porto/bestQuality.png', name: 'Best Quality' },
    {
      img: 'assets/images/porto/securedShipping.png',
      name: 'Secured Shipping',
    },
    { img: 'assets/images/porto/100-refund.png', name: '100% Refund' },
    { img: 'assets/images/porto/15DaysReturn.png', name: '15 Days Return' },
    {
      img: 'assets/images/porto/lifeTimeExchange.png',
      name: 'Life TIme Exchange',
    },
    { img: 'assets/images/porto/listedCompany.png', name: 'Listed Company' },
    { img: 'assets/images/porto/50Stores.png', name: '50+ Stores' },
    { img: 'assets/images/porto/2000Employees.png', name: '2000+ Employees' },
    {
      img: 'assets/images/porto/certifiedJewellery.png',
      name: 'Certified Jewellery',
    },
    { img: 'assets/images/porto/securedRetail.png', name: 'Secured Retail' },
  ];

  currentIndex = 0;
  intervalId: any;

  get displayedCards() {
    return this.porto.slice(this.currentIndex, this.currentIndex + 6);
  }

  next() {
    if (this.currentIndex < this.porto.length - 6) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.porto.length - 6;
    }
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.next();
    }, 2000);
  }

  stopAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }
  //porto slider contents//
}