import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { jewelleryType } from '../../../shared/models/productType';
import { ProductsService } from '../../../services/products.service';
import { Observable } from 'rxjs';
import { PageNotFoundComponent } from "../../partials/page-not-found/page-not-found.component";
import { TitleComponent } from '../../partials/title/title.component';
@Component({
  selector: 'app-diamond-jewels',
  standalone: true,
  imports: [PageNotFoundComponent, CommonModule, RouterLink, TitleComponent],
  templateUrl: './diamond-jewels.component.html',
  styleUrl: './diamond-jewels.component.css'
})
export class DiamondJewelsComponent {
  products: jewelleryType[] = [];

  constructor(private service: ProductsService, private actRoute: ActivatedRoute) {
    actRoute.params.subscribe((params) => {
      let productsObservable: Observable<jewelleryType[]>;
      if(params.categoryName){
        productsObservable = this.service.getProductsByCategory(params.categoryName);
      } else {
        productsObservable = this.service.getAllProducts();
      }

      productsObservable.subscribe((Products) => {
        this.products = Products;
      })
    })
  }
}