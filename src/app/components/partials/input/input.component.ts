import { Component, Input } from '@angular/core';
import { InputBoxComponent } from "../input-box/input-box.component";
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputValidationComponent } from "../input-validation/input-validation.component";

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [InputBoxComponent, InputValidationComponent, ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent {

  @Input()control!:AbstractControl;
  @Input()showErrorsWhen:boolean = true;
  @Input() type: 'text' | 'password' | 'email' = 'text';
  @Input()label!:string;

  get formControl(){
    return this.control as FormControl;
  }
}
