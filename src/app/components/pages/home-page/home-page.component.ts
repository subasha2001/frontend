import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { jewelleryType } from '../../../shared/models/productType';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
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
  justArrivedProducts: jewelleryType[] = [];
  coinProducts: jewelleryType[] = [];

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
        map((products) => {
          const processedProducts = products.map((pdt) =>
            this.calculateProductPrice(pdt)
          );

          const featuredProducts = processedProducts.filter((pdt) =>
            pdt.category?.includes('featured')
          );

          const CoinProducts = processedProducts.filter((pdt) =>
            pdt.metalType?.includes('coin')
          );

          const recentProducts = processedProducts
            .sort((a, b) => {
              const dateA = new Date(a.createdAt!).getTime();
              const dateB = new Date(b.createdAt!).getTime();
              return dateA - dateB;
            })
            .slice(-5);

          return { featuredProducts, recentProducts, CoinProducts };
        })
      )
      .subscribe(({ featuredProducts, recentProducts, CoinProducts }) => {
        this.products = this.getRandomProducts(featuredProducts, 5);
        this.justArrivedProducts = recentProducts;
        this.coinProducts = this.getRandomProducts(CoinProducts, 5);
      });
  }

  private calculateProductPrice(pdt: jewelleryType): jewelleryType {
    const weight = pdt.weight!;
    const wastage = pdt.wastage!;
    const sr = this.SR;

    if (pdt.metalType?.includes('gold')) {
      //22KT(916)
      const value = (weight + weight * wastage) * this.GR22 + 500;
      const gst = value * this.gst;
      pdt.price = value + gst;
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
      //below 500mg gold
      pdt.metalType?.includes('gold') &&
      pdt.weight! <= 0.5
    ) {
      const value = (weight + 0.15) * this.GR22 + 150;
      const gst = value * this.gst;
      pdt.price = value + gst;
    } else if (
      pdt.category?.includes('kolusu') ||
      pdt.category?.includes('kokkikolusu') ||
      pdt.category?.includes('thandai')
    ) {
      //weight = 50g, wastage = 22%(0.22), sr = 101, gst = 3%(0.03)
      const value = (weight + weight * wastage) * sr; //(50 + (50*0.22)) * 101 = (50+11) * 101 = 6161
      const gst = value * this.gst; //6161 * 0.03 = 184.83
      pdt.price = value + gst; // 6161 + 184.83 = 6345.83
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
    } //coins price calculation
    else if (pdt.metalType?.includes('coin')) {
      if (pdt.category?.includes('500mgcoin')) {
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
    { img: 'assets/images/portoNew/bestPrice.png', name: 'Best Price' },
    { img: 'assets/images/portoNew/bestQuality.png', name: 'Best Quality' },
    {
      img: 'assets/images/portoNew/securedShipping.png',
      name: 'Secured Shipping',
    },
    {
      img: 'assets/images/portoNew/certifiedJewellery.png',
      name: 'Certified Jewellery',
    },
    { img: 'assets/images/portoNew/securedRetail.png', name: 'Secured Retail' },
  ];

  currentIndex = 0;
  intervalId: any;

  get displayedCards() {
    return this.porto.slice(this.currentIndex, this.currentIndex + 5);
  }

  next() {
    if (this.currentIndex < this.porto.length - 5) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.porto.length - 5;
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
