import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SilverJewelsComponent } from './silver-jewels.component';

describe('SilverJewelsComponent', () => {
  let component: SilverJewelsComponent;
  let fixture: ComponentFixture<SilverJewelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SilverJewelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SilverJewelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
