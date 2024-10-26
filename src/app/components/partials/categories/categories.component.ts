import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BASE_URL } from '../../../shared/models/constants/urls';

@Component({
  selector: 'categories',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent {
  baseurl = BASE_URL;
}
