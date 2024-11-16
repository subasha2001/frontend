import { Component } from '@angular/core';
import { TitleComponent } from '../../partials/title/title.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InputComponent } from '../../partials/input/input.component';
import { DefaultButtonComponent } from '../../partials/default-button/default-button.component';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    TitleComponent,
    ReactiveFormsModule,
    InputComponent,
    DefaultButtonComponent,
    RouterLink,
  ],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css',
})
export class AdminLoginComponent {
  loginForm!: FormGroup;
  isSubmitted: boolean = false;
  returnUrl = '';
  goldRate!: any;

  constructor(
    private formBuilder: FormBuilder,
    private service: UserService,
    private actRouts: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      number: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    this.returnUrl = this.actRouts.snapshot.queryParams.returnUrl;
  }

  get fc() {
    return this.loginForm.controls;
  }

  submit() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) console.log('invalid form');

    this.service
      .adminLogin({
        email: this.fc.email.value,
        number: this.fc.number.value,
        password: this.fc.password.value,
      })
      .subscribe(() => {
        this.router.navigateByUrl(this.returnUrl);
      });
  }
}