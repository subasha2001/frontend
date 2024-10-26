import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ADD_REVIEW, GET_GSGST_FROM_DB, SEND_TO_DB, SHOP_REVIEW } from '../shared/models/constants/urls';
import { ToastrService } from 'ngx-toastr';
import { rates } from '../shared/models/rates';
import { jewelleryType } from '../shared/models/productType';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from './products.service';

@Injectable({
  providedIn: 'root',
})
export class GoldSilverService {
  GR18!: number;
  GR22!: number;
  GR24!: number;
  SR!: number;
  gst!: number;
  products: jewelleryType[] = [];
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    actRoute: ActivatedRoute,
    private productservice: ProductsService
  ) {
    actRoute.params.subscribe((params) => {
      let ratesObservable: Observable<rates[]> = this.getRatesFromDB();
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
      productsObservable = this.productservice.getAllProducts();
      productsObservable.subscribe((Products) => {
        this.products = Products;
      });
    });
  }
  private dataSource = new BehaviorSubject<rates[]>([]);
  currentData$ = this.dataSource.asObservable();

  addRatesToDB(data: any): Observable<any> {
    return this.http.post(SEND_TO_DB, data).pipe(
      tap({
        next: (data) => {
          this.toastr.success(`Rates updated !`);
        },
        error: (errorResponse) => {
          this.toastr.error(errorResponse.error, 'Rates update failed ?');
        },
      })
    );
  }

  updateData(values: rates[]) {
    this.dataSource.next(values);
  }

  getRatesFromDB(): Observable<rates[]> {
    return this.http.get<rates[]>(GET_GSGST_FROM_DB);
  }

  //calculate the price of products//
  priceCalculation() {
    this.products!.forEach((val) => {
      if ((val.metalType = ['gold'])) {
        val.price = ((val.weight! * (val.wastage! + this.gst) + val.weight!) * this.GR22)+val.makingCost!;
      } 
      else if ((val.metalType = ['silver'])) {
        val.price = ((this.SR + val.wastage!*100)*val.weight!)*this.gst;
      } 
      else if ((val.metalType = ['coin'])) {
        val.price =
          this.GR24 * val.weight! +
          this.GR24 * val.makingCost! +
          this.gst * this.GR18;
      }
    });
  } //4686 ((107+23)*35)=4550         4718.7
  //calculate the price of products//

  //product review//
  addReviews(data: any): Observable<any> {
    return this.http.post(ADD_REVIEW, data).pipe(
      tap({
        next: (data) => {
          this.toastr.success(`Review posted !`);
        },
        error: (errorResponse) => {
          this.toastr.error(errorResponse.error, 'Review Post Failed ?');
        },
      })
    );
  }

  getReviews(): Observable<any[]> {
    return this.http.get<any[]>(SHOP_REVIEW);
  }
  //product review//

  goldPrice22(product: jewelleryType, goldRate: number, gst: number): number {
    const weight = product.weight || 0;
    const mc = product.makingCost || 0;

    const price =
      weight * goldRate +
      weight * goldRate * mc +
      weight * goldRate * gst;
    return parseFloat(price.toFixed(2));
  }
  goldPrice24(product: jewelleryType): number {
    const weight = product.weight || 0;
    const mc = product.makingCost || 0;

    const price =
      weight * this.GR24 + weight * this.GR24 * mc + weight * this.GR24 * this.gst;
    return parseFloat(price.toFixed(2));
  }
  goldPrice18(product: jewelleryType, goldRate: number, gst: number): number {
    const weight = product.weight || 0;
    const mc = product.makingCost || 0;

    const price =
      weight * goldRate +
      weight * goldRate * mc +
      weight * goldRate * gst;
    return parseFloat(price.toFixed(2));
  }
  silverPrice(product: jewelleryType, silverRate: number, gst: number): number {
    const weight = product.weight || 0;
    const mc = product.makingCost || 0;

    const price =
      weight * silverRate +
      weight * silverRate * mc +
      weight * silverRate * gst;
    return parseFloat(price.toFixed(2));
  }
}