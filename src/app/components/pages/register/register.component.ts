import { Component, OnInit } from '@angular/core';
import { InputComponent } from "../../partials/input/input.component";
import { TitleComponent } from "../../partials/title/title.component";
import { DefaultButtonComponent } from "../../partials/default-button/default-button.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IUserRegister } from '../../../shared/models/interfaces/iUserRegister';
import { PasswordsMatchValidators } from '../../../shared/models/validators/password_match-validators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [InputComponent, TitleComponent, DefaultButtonComponent, RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterPageComponent implements OnInit {
  registerForm!: FormGroup;
  isSubmitted = false;
  returnUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.minLength(10)]]
    },
      {
        validators: PasswordsMatchValidators('password', 'confirmPassword')
      });
    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;
  }

  get fc() {
    return this.registerForm.controls;
  }

  submit() {
    this.isSubmitted = true;
    if (this.registerForm.invalid) return;

    const fv = this.registerForm.value;
    const user: IUserRegister = {
      name: fv.name,
      email: fv.email,
      password: fv.password,
      confirmPassword: fv.confirmPassword,
      address: fv.address
    }
    this.userService.register(user).subscribe(() => {
      this.router.navigateByUrl(this.returnUrl);
    })
  }
}
