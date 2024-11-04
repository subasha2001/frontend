import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { jewelleryType } from '../../../shared/models/productType';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.css',
})
export class UpdateProductComponent {
  product!: any;
  updateMsg!:string | undefined;
  constructor(
    actRoute: ActivatedRoute,
    private productservice: ProductsService
  ) {
    let productId = actRoute.snapshot.paramMap.get('id');
    productId &&
      productservice.getProductById(productId).subscribe((val) => {
        this.product = val;
      });
  }

  updateProduct(data: any) {
    if (this.product) {
      data.id = this.product.id;
      this.productservice.updateProductById(data).subscribe((val) => {
        if (val) {
          this.updateMsg = 'Product has been updated';
        }
      })
      setTimeout(() => {
        this.updateMsg = undefined;
      }, 3000);
      console.log(data);
    }
  }
}