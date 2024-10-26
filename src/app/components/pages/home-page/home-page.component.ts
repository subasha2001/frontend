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
import { rates } from '../../../shared/models/rates';
import { GoldSilverService } from '../../../services/gold-silver.service';
import { ReviewsComponent } from '../../partials/reviews/reviews.component';

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
export class HomePageComponent implements OnInit{
  GR18!: number;
  GR22!: number;
  GR24!: number;
  SR!: number;
  gst!: number;
  products: jewelleryType[] = [];
  bannerImages: bannerType[] = [];

  constructor(
    private service: ProductsService,
    actRoute: ActivatedRoute,
    private GS: GoldSilverService
  ) {
    actRoute.params.subscribe((params) => {
      let ratesObservable: Observable<rates[]> = this.GS.getRatesFromDB();
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
      if (params.searchTerm) {
        productsObservable = this.service.getProductsBySearchTerm(
          params.searchTerm
        );
      }else {
        productsObservable = this.service.getAllProducts().pipe(
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
                pdt.category?.includes('coin') &&
                pdt.metalType?.includes('coin')
              ) {
                pdt.price = (this.GR22+200)*pdt.weight! + this.gst*pdt.weight!;
                console.log(this.GR22, this.gst, pdt.weight);
              } else if (
                pdt.category?.includes('500mgcoin') &&
                pdt.metalType?.includes('coin')
              ) {
                pdt.price = ((pdt.weight! + 0.150)*this.GR22) * this.gst
              }
              return pdt;
            });
          })
        );
      }

      productsObservable.subscribe((Products) => {
        this.products = Products;
      });

      let bannerObservable: Observable<bannerType[]> =
        this.service.getBannerItems();
      bannerObservable.subscribe((Items) => {
        this.bannerImages = Items;
      });
    });
  }
  ngOnInit(): void {
      // console.log(this.gst);      
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
  //porto slider contents//
}
