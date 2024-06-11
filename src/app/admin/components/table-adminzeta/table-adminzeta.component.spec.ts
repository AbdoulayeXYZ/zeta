import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableAdminzetaComponent } from './table-adminzeta.component';

describe('TableAdminzetaComponent', () => {
  let component: TableAdminzetaComponent;
  let fixture: ComponentFixture<TableAdminzetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableAdminzetaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableAdminzetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
