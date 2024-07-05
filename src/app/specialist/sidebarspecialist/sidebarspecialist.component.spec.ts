import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarspecialistComponent } from './sidebarspecialist.component';

describe('SidebarspecialistComponent', () => {
  let component: SidebarspecialistComponent;
  let fixture: ComponentFixture<SidebarspecialistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarspecialistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SidebarspecialistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
