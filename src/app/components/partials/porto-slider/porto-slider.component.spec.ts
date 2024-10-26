import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortoSliderComponent } from './porto-slider.component';

describe('PortoSliderComponent', () => {
  let component: PortoSliderComponent;
  let fixture: ComponentFixture<PortoSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortoSliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortoSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
