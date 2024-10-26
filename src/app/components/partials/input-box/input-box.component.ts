import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';

@Component({
  selector: 'input-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-box.component.html',
  styleUrl: './input-box.component.css'
})
export class InputBoxComponent {
  @Input() label!: string;
  @Input() bgColor = 'white';
}
