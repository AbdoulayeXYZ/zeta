import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlockPremiumComponent } from './unlock-premium.component';

describe('UnlockPremiumComponent', () => {
  let component: UnlockPremiumComponent;
  let fixture: ComponentFixture<UnlockPremiumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnlockPremiumComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnlockPremiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
