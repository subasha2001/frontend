import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './title.component.html',
  styleUrl: './title.component.css'
})
export class TitleComponent {
  @Input() title! :string;
  @Input() margin? = '15px 0 15px 3px';
  @Input() fontSize? = '20px';
  @Input() color? = '';
}
