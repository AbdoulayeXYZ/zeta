import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashownerComponent } from './dashowner.component';

describe('DashownerComponent', () => {
  let component: DashownerComponent;
  let fixture: ComponentFixture<DashownerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashownerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashownerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
