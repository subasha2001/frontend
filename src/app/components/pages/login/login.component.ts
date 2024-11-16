import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { TitleComponent } from '../../partials/title/title.component';
import { InputComponent } from '../../partials/input/input.component';
import { DefaultButtonComponent } from '../../partials/default-button/default-button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    TitleComponent,
    RouterLink,
    ReactiveFormsModule,
    InputComponent,
    DefaultButtonComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitted: boolean = false;
  returnUrl = '';

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
      .login({
        email: this.fc.email.value,
        number: this.fc.number.value,
        password: this.fc.password.value,
      })
      .subscribe(() => {
        this.router.navigateByUrl(this.returnUrl);
      });
  }
}
