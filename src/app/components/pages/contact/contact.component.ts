import { Component } from '@angular/core';
import { TitleComponent } from '../../partials/title/title.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../../shared/models/constants/urls';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [TitleComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  contactForm!: FormGroup;
  returnUrl!: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private http: HttpClient
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      number: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      message: ['', Validators.required],
    });
  }

  onSubmit(): void {
    const formData = this.contactForm.value;

    this.http
      .post(BASE_URL+ '/api/mailer/send-email', formData)
      .subscribe(
        (response) => {
          alert('Your response has been sent!');
          this.router.navigateByUrl(this.returnUrl);
        },
        (error) => {
          alert(error.error);
        }
      );
  }
}
