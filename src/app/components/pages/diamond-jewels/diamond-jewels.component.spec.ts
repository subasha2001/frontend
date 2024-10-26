import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiamondJewelsComponent } from './diamond-jewels.component';

describe('DiamondJewelsComponent', () => {
  let component: DiamondJewelsComponent;
  let fixture: ComponentFixture<DiamondJewelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiamondJewelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiamondJewelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
