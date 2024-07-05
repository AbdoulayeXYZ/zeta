import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabuserComponent } from './tabuser.component';

describe('TabuserComponent', () => {
  let component: TabuserComponent;
  let fixture: ComponentFixture<TabuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabuserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
