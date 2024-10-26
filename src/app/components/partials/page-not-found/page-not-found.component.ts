import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent {
  @Input()visible = false;
  @Input()notFoundMsg = 'Nothing Found';
  @Input()resetLinkText = 'Reset';
  @Input()resetLinkRoute = '';
}
