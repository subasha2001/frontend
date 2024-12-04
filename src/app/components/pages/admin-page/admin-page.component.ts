import { Component, OnInit } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { bannerType } from '../../../shared/models/bannerType';
import { ToastrService } from 'ngx-toastr';
import { GoldSilverService } from '../../../services/gold-silver.service';
import { BASE_URL } from '../../../shared/models/constants/urls';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css',
})
export class AdminPageComponent implements OnInit {
  returnUrl = '';
  baseurl = BASE_URL;
  deliveryCharges: any[] = [];
  deliveryChargeForm!: FormGroup;

  constructor(
    private productservice: ProductsService,
    private actRoute: ActivatedRoute,
    private service: ProductsService,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private GS: GoldSilverService,
    private http: HttpClient
  ) {
    this.service.getAllProducts().subscribe((Products) => {
      this.products = Products;
    });

    this.service.getBannerItems().subscribe((Items) => {
      this.bannerImg = Items;
    });

    this.goldSilver = this.fb.group({
      gold22: [''],
      gold24: [''],
      gold18: [''],
      silver: [''],
      gst: [''],
    });

    this.Product = this.fb.group({
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

    this.deliveryChargeForm = this.fb.group({
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      charge: ['', [Validators.required, Validators.min(0)]],
    });
    this.Banner = this.fb.group({
      image: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.returnUrl = this.actRoute.snapshot.queryParams['returnUrl'];
    this.fetchDeliveryCharges();
  }

  //to toggle each div//
  selectedDiv: number | null = 0;
  toggleDiv(index: number) {
    this.selectedDiv = this.selectedDiv === index ? null : index;
  }
  //to toggle each div//

  //banner//
  bannerImg: bannerType[] = [];
  Banner!: FormGroup;
  bannerImgUrl!: string;

  deleteBanner(id: string) {
    this.service.deleteBannerById(id).subscribe(() => {
      this.router.navigateByUrl(this.returnUrl);
    });
  }

  onBannerUpload(event: Event, val: string): void {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files[0]) {
      const selectedFile = fileInput.files[0];
      this.bannerImgUrl = selectedFile.name;

      this.service
        .uploadImage(selectedFile)
        .subscribe((response: { imageUrl: string }) => {
          this.Banner.patchValue({ [val]: response.imageUrl });
          this.toastr.success('Banner Image Uploaded');
        });
    }
  }

  addBanner(): void {
    if (this.Banner.valid) {
      const formData = this.Banner.value;

      const BannerData = {
        ...formData,
        image: this.bannerImgUrl,
      };

      this.service.addBanner(BannerData).subscribe(() => {
        this.router.navigate(['/admingpj']);
      });
    }
  }
  //banner//

  //goldSilverGst//
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
  //goldSilverGst//

  //product//
  Product!: FormGroup;
  products: jewelleryType[] = [];
  displayImageUrl: string | null = null;
  hoverImageUrl: string = '';

  toDelete: string = 'gold';
  toDeleteItem(val: string) {
    this.toDelete = val;
  }

  deleteProduct(id: string) {
    this.service.deleteProductById(id).subscribe(() => {
      this.router.navigateByUrl(this.returnUrl);
    });
  }

  onDisplayUpload(event: Event, val: string): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const selectedFile = fileInput.files[0];

      this.displayImageUrl = selectedFile.name;

      this.service
        .uploadImage(selectedFile)
        .subscribe((response: { imageUrl: string }) => {
          this.Product.patchValue({ [val]: response.imageUrl });
          this.toastr.success('Display Image Uploaded');
        });
    }
  }

  onHoverUpload(event: Event, val: string): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const selectedFile = fileInput.files[0];

      this.hoverImageUrl = selectedFile.name;

      this.service
        .uploadImage(selectedFile)
        .subscribe((response: { imageUrl: string }) => {
          this.Product.patchValue({ [val]: response.imageUrl });
          this.toastr.success('Hover Image Uploaded');
        });
    }
  }

  addProduct(): void {
    if (this.Product.valid) {
      const formData = this.Product.value;

      const productData = {
        ...formData,
        category: formData.category.split(',').map((cat: string) => cat.trim()),
        imageDis: this.displayImageUrl,
        imageHov: this.hoverImageUrl,
      };

      this.service.addProduct(productData).subscribe(() => {
        this.router.navigateByUrl(this.returnUrl);
      });
    }
  }
  //product//

  //deliveryCharge//
  pincode: string = '';
  charge: number = 0;
  message: string = '';

  fetchDeliveryCharges() {
    this.http
      .get(BASE_URL + '/api/goldSilver/delivery-charges')
      .subscribe((data: any) => {
        this.deliveryCharges = data;
      });
  }

  onAddingChargeUpdate() {
    if (this.deliveryChargeForm.valid) {
      this.http
        .post(
          BASE_URL + '/api/goldSilver/delivery-charge',
          this.deliveryChargeForm.value
        )
        .subscribe({
          next: () => {
            alert('Delivery charge updated successfully');
            this.deliveryChargeForm.reset();
            this.fetchDeliveryCharges();
          },
          error: (err) => {
            alert('Failed to update delivery charge');
            console.log(err);
          },
        });
    }
  }

  onUpdatingCharges() {
    this.http
      .put(`${BASE_URL}/api/goldSilver/delivery-charge/${this.pincode}`, {
        charge: this.charge,
      })
      .subscribe(
        (response) => {
          this.message = 'Delivery charge updated successfully!';
        },
        (error) => {
          this.message = 'Failed to update delivery charge.';
        }
      );
  }
  //deliveryCharge//

  //to Update Product//
  productId!:string;
  product!:jewelleryType;
  fetchProductDetails() {
    if (!this.productId.trim()) {
      alert('Please enter a valid Product ID.');
      return;
    }

    this.productservice.getProductById(this.productId).subscribe({
      next: (product) => {
        this.product = product;
        if (this.product) {
          this.router.navigate(['/update', this.productId], {
            state: { product: this.product },
          });
        } else {
          alert('Product not found.');
        }
      },
      error: () => {
        alert('Failed to fetch product details. Please try again.');
      },
    });
  }
  //to Update Product//
}