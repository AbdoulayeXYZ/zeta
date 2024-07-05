import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderspecialistComponent } from './headerspecialist.component';

describe('HeaderspecialistComponent', () => {
  let component: HeaderspecialistComponent;
  let fixture: ComponentFixture<HeaderspecialistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderspecialistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderspecialistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
