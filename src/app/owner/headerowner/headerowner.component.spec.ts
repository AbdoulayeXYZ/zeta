import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderownerComponent } from './headerowner.component';

describe('HeaderownerComponent', () => {
  let component: HeaderownerComponent;
  let fixture: ComponentFixture<HeaderownerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderownerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderownerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
