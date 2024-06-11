import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSpecialistComponent } from './table-specialist.component';

describe('TableSpecialistComponent', () => {
  let component: TableSpecialistComponent;
  let fixture: ComponentFixture<TableSpecialistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableSpecialistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableSpecialistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
