import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { jewelleryType } from '../shared/models/productType';
import { HttpClient } from '@angular/common/http';
import {
  BANNER_URL,
  BASE_URL,
  DELETE_BANNER_BY_ID_URL,
  DELETE_PRODUCT_BY_ID_URL,
  IMG_UPLOAD,
  PRODUCTS_BY_CATEGORY_URL,
  PRODUCTS_BY_ID_URL,
  PRODUCTS_BY_METALTYPE_URL,
  PRODUCTS_BY_SEARCH_URL,
  PRODUCTS_CATEGORIES_URL,
  PRODUCTS_METALTYPES_URL,
  PRODUCTS_URL,
  UPDATE_PRODUCT_BY_ID_URL,
} from '../shared/models/constants/urls';
import { Category } from '../shared/models/categories';
import { bannerType } from '../shared/models/bannerType';
import { metalType } from '../shared/models/metalType';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient, private toastr: ToastrService) {}

  addProduct(product: jewelleryType): Observable<jewelleryType> {
    return this.http
      .post<jewelleryType>(PRODUCTS_URL + '/addProduct', product)
      .pipe(
        tap({
          next: (name) => {
            localStorage.setItem('products', JSON.stringify(name));
            this.toastr.success('Product Added');
          },
          error: (err) => {
            this.toastr.error(err, 'Error adding product');
          },
        })
      );
  }
  uploadImage(image: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post(IMG_UPLOAD, formData);
  }

  addBanner(data: bannerType): Observable<bannerType> {
    return this.http.post<bannerType>(BANNER_URL + '/addBanner', data).pipe(
      tap({
        next: (name) => {
          localStorage.setItem('banner', JSON.stringify(name));
          alert('banner added');
        },
        error: (err) => {
          alert(err);
        },
      })
    );
  }
  getBannerItems(): Observable<bannerType[]> {
    // return this.http.get<bannerType[]>('https://backend-gpj.onrender.com/api/banner');
    return this.http.get<bannerType[]>(`${BASE_URL}/api/banner`);
  }

  getAllProducts(): Observable<jewelleryType[]> {
    return this.http.get<jewelleryType[]>(PRODUCTS_URL);
  }

  getProductsBySearchTerm(searchTerm: string) {
    return this.http.get<jewelleryType[]>(PRODUCTS_BY_SEARCH_URL + searchTerm);
  }

  getAllMetalType(): Observable<metalType[]> {
    return this.http.get<metalType[]>(PRODUCTS_METALTYPES_URL);
  }

  getAllCategory(): Observable<Category[]> {
    return this.http.get<Category[]>(PRODUCTS_CATEGORIES_URL);
  }

  getProductsByMetalType(metalTypeName: string): Observable<jewelleryType[]> {
    return metalTypeName === 'All'
      ? this.getAllProducts()
      : this.http.get<jewelleryType[]>(
          PRODUCTS_BY_METALTYPE_URL + metalTypeName
        );
  }

  getProductsByCategory(categoryName: string): Observable<jewelleryType[]> {
    return categoryName === 'All'
      ? this.getAllProducts()
      : this.http.get<jewelleryType[]>(PRODUCTS_BY_CATEGORY_URL + categoryName);
  }

  getProductById(productId: string): Observable<jewelleryType> {
    return this.http.get<jewelleryType>(PRODUCTS_BY_ID_URL + productId);
  }

  deleteProductById(productId: string) {
    return this.http.delete(DELETE_PRODUCT_BY_ID_URL + productId);
  }

  updateProductById(product:jewelleryType) {
    return this.http.put(UPDATE_PRODUCT_BY_ID_URL + product.id, product);
  }

  deleteBannerById(productId: string) {
    return this.http.delete(DELETE_BANNER_BY_ID_URL + productId);
  }
}