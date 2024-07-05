import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarownerComponent } from './sidebarowner.component';

describe('SidebarownerComponent', () => {
  let component: SidebarownerComponent;
  let fixture: ComponentFixture<SidebarownerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarownerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SidebarownerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
