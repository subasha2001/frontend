import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'default-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './default-button.component.html',
  styleUrl: './default-button.component.css',
})
export class DefaultButtonComponent {
  @Input() type: 'submit' | 'button' = 'submit';
  @Input() text: string = 'Submit';
  @Input() bgColor = '#ff0f39c7';
  @Input() color = 'white';
  @Input() fontSize = 1.3;
  @Input() width = 100;
  @Input() disabled = false;
  @Output() onClick = new EventEmitter();
}