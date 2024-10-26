import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { bannerType } from '../../../shared/models/bannerType';
import { BASE_URL } from '../../../shared/models/constants/urls';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css',
})
export class ImageSliderComponent {

  baseurl = BASE_URL;

  @Input() indicators = true;
  @Input() controls = true;
  @Input() autoSlide = false;
  selectedIndex = 0;

  @Input() banneritems: bannerType[] = [];
  intervalId:any;

  showNext() {
    if (this.selectedIndex === this.banneritems.length - 1) {
      this.selectedIndex = 0;
    } else {
      this.selectedIndex++;
    }
  }
  selectImage(i: number): void {
    this.selectedIndex = i;
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.showNext();
    }, 2000);
  }

  stopAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

//9940908982//