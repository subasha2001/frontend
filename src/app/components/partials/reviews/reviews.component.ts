import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { GoldSilverService } from '../../../services/gold-silver.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css',
})
export class ReviewsComponent implements OnInit {
  constructor(
    actRoute: ActivatedRoute,
    private GS: GoldSilverService,
    private ngZone: NgZone
  ) {
    actRoute.params.subscribe(() => {
      let reviewsObservable: Observable<any[]> = this.GS.getReviews();
      reviewsObservable.subscribe((Items) => {
        this.reviews = Items;
      });
    });
  }
  ngOnInit() {
    this.startAutoSlide();
  }

  reviews!: any[];
  selectedIndex = 0;
  indicators = true;
  private slideInterval: any;

  selectImage(i: number): void {
    this.selectedIndex = i;
  }

  startAutoSlide() {
    this.ngZone.runOutsideAngular(() => {
      this.slideInterval = setInterval(() => {
        this.ngZone.run(() => {
          this.selectedIndex = (this.selectedIndex + 1) % this.reviews.length;
        });
      }, 3000);
    });
  }
  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }
}