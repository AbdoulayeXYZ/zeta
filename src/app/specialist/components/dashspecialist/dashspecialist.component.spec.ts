import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashspecialistComponent } from './dashspecialist.component';

describe('DashspecialistComponent', () => {
  let component: DashspecialistComponent;
  let fixture: ComponentFixture<DashspecialistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashspecialistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashspecialistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
