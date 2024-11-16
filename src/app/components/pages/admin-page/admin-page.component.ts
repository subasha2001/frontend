import { Component, OnInit } from '@angular/core';
import { InputComponent } from '../../partials/input/input.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NgModel,
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
import { BASE_URL } from '../../../shared/models/constants/urls';
import { HttpClient } from '@angular/common/http';

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
  baseurl = BASE_URL;
  deliveryCharges: any[] = [];
  Product!: FormGroup;
  goldSilver!: FormGroup;
  deliveryChargeForm!: FormGroup;

  constructor(
    private actRoute: ActivatedRoute,
    private service: ProductsService,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private GS: GoldSilverService,
    private http: HttpClient
  ) {
    let productsObservable: Observable<jewelleryType[]>;
    productsObservable = this.service.getAllProducts();

    productsObservable.subscribe((Products) => {
      this.products = Products;
    });

    let bannerObservable: Observable<bannerType[]>;
    bannerObservable = this.service.getBannerItems();

    bannerObservable.subscribe((Items) => {
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
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]], // Validate 6-digit pincode
      charge: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.returnUrl = this.actRoute.snapshot.queryParams['returnUrl'];
    this.fetchDeliveryCharges();
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

  //to toggle each div//
  selectedDiv: number | null = 0;
  toggleDiv(index: number) {
    this.selectedDiv = this.selectedDiv === index ? null : index;
  }
  //to toggle each div//

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

  //add products and banner//
  addProduct(): void {
    if (this.Product.valid) {
      const formData = this.Product.value;

      const productData = {
        ...formData,
        category: formData.category.split(',').map((cat: string) => cat.trim()),
      };

      this.service.addProduct(productData).subscribe((_) => {
        this.router.navigateByUrl(this.returnUrl);
      });
    }
  }
  addBanner(data: bannerType) {
    if (data) {
      this.service.addBanner(data).subscribe((_) => {
        this.router.navigateByUrl(this.returnUrl);
      });
    }
  }
  //add products and banner//

  //updating deliverycharge//
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

  pincode: string = '';
  charge: number = 0;
  message: string = '';

  onUpdatingCharges() {
    // Send PUT request to backend to update the delivery charge
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
  //updating deliverycharge//
}