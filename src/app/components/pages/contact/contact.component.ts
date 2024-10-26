import { Component } from '@angular/core';
import { TitleComponent } from '../../partials/title/title.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import emailjs from 'emailjs-com';
import { environment } from '../../../shared/models/env/environment.prod';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [TitleComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {

  contactForm!: FormGroup;
  returnUrl!:string;

  constructor(private fb: FormBuilder, private router:Router, private actRouts:ActivatedRoute, private toastr:ToastrService) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      number: ['', Validators.required],
      email: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  onSubmit(): void {
    const { name, number, email, message } = this.contactForm.value;

    const templateParams = {
      name,
      number,
      email,
      message,
    };
    this.returnUrl = this.actRouts.snapshot.queryParams.returnUrl;
    emailjs
      .send(
        environment.emailJsServiceId,
        environment.emailJsTemplateId,
        templateParams,
        environment.emailJsPrivateKey,
      )
      .then(
        (response) => {
          this.router.navigateByUrl(this.returnUrl);
          this.toastr.success('Your Response Have been sent!');
        },
        (error) => {
          this.toastr.error('Failed to send your Response')
        }
      );
  }
}
