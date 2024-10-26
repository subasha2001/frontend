import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'porto-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './porto-slider.component.html',
  styleUrl: './porto-slider.component.css',
})
export class PortoSliderComponent {
  @Input() img!: string;
  @Input() title!: string;
  @Input() description!: string;
}