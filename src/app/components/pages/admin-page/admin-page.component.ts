import { Component, OnInit } from '@angular/core';
import { InputComponent } from '../../partials/input/input.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { jewelleryType } from '../../../shared/models/productType';
import { ProductsService } from '../../../services/products.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { bannerType } from '../../../shared/models/bannerType';
import { ToastrService } from 'ngx-toastr';
import { GoldSilverService } from '../../../services/gold-silver.service';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [
    InputComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css',
})
export class AdminPageComponent implements OnInit {
  products: jewelleryType[] = [];
  isAdded: boolean = false;
  returnUrl = '';
  bannerImg: bannerType[] = [];

  constructor(
    private actRoute: ActivatedRoute,
    private service: ProductsService,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private GS: GoldSilverService
  ) {
    this.actRoute.params.subscribe((params) => {
      let productsObservable: Observable<jewelleryType[]>;
      productsObservable = this.service.getAllProducts();

      productsObservable.subscribe((Products) => {
        this.products = Products;
      });
    });

    actRoute.params.subscribe((params) => {
      let bannerObservable: Observable<bannerType[]> =
        this.service.getBannerItems();
      bannerObservable.subscribe((Items) => {
        this.bannerImg = Items;
      });
    });

    this.goldSilver = this.fb.group({
      gold22: [''],
      gold24: [''],
      gold18: [''],
      silver: [''],
      gst: [''],
    });

    this.goldProduct = this.fb.group({
      name: [''],
      imageDis: [''],
      imageHov: [''],
      description: [''],
      metalType: [''],
      category: [''],
      weight: [''],
      mc: [''],
      size: [''],
      stock: [''],
      wastage: [''],
      price: [''],
    });
  }

  ngOnInit(): void {
    this.returnUrl = this.actRoute.snapshot.queryParams['returnUrl'];
  }

  addBanner(data: bannerType) {
    if (data) {
      this.service.addBanner(data).subscribe((_) => {
        this.router.navigateByUrl(this.returnUrl);
      });
    }
  }

  //delete products and banner//
  toDelete: string = 'gold';
  toDeleteItem(val: string) {
    this.toDelete = val;
  }

  deleteProduct(id: string) {
    this.service.deleteProductById(id).subscribe(() => {
      this.router.navigateByUrl(this.returnUrl);
    });
  }
  deleteBanner(id: string) {
    this.service.deleteBannerById(id).subscribe(() => {
      this.router.navigateByUrl(this.returnUrl);
    });
  }
  //delete products and banner//

  //image upload//
  selectedFile: File | null = null;
  displayImageUrl: string | null = null;

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
    }
    this.displayImageUrl = this.selectedFile!.name;
  }

  onUpload() {
    if (this.selectedFile) {
      this.service.uploadImage(this.selectedFile).subscribe((response) => {
        this.displayImageUrl = response.imageUrl;
        this.toastr.success('Image Uploaded Successfully');
      });
    }
  }
  //image upload//

  selectedDiv: number | null = 0;
  toggleDiv(index: number) {
    this.selectedDiv = this.selectedDiv === index ? null : index;
  }

  goldSilver!: FormGroup;

  onSubmit(): void {
    if (this.goldSilver.invalid) console.log('invalid form');

    this.GS.addRatesToDB({
      gold22: this.goldSilver.controls.gold22.value,
      gold24: this.goldSilver.controls.gold24.value,
      gold18: this.goldSilver.controls.gold18.value,
      silver: this.goldSilver.controls.silver.value,
      gst: this.goldSilver.controls.gst.value,
    }).subscribe((data) => {
      this.router.navigateByUrl(this.returnUrl);
      this.GS.updateData(data);
    });
  }

  goldProduct!: FormGroup;
  addProduct(): void {
    if (this.goldProduct.valid) {
      const formData = this.goldProduct.value;

      const productData = {
        ...formData,
        category: formData.category.split(',').map((cat: string) => cat.trim()),
      };

      this.service.addProduct(productData).subscribe((_) => {
        this.router.navigateByUrl(this.returnUrl);
      });
    }
  }
}