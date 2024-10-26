import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldJewelsComponent } from './gold-jewels.component';

describe('GoldJewelsComponent', () => {
  let component: GoldJewelsComponent;
  let fixture: ComponentFixture<GoldJewelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoldJewelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoldJewelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
