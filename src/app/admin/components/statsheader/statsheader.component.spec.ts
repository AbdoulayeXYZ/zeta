import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsheaderComponent } from './statsheader.component';

describe('StatsheaderComponent', () => {
  let component: StatsheaderComponent;
  let fixture: ComponentFixture<StatsheaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatsheaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatsheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
