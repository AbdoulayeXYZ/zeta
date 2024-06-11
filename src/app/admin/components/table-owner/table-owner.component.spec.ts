import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableOwnerComponent } from './table-owner.component';

describe('TableOwnerComponent', () => {
  let component: TableOwnerComponent;
  let fixture: ComponentFixture<TableOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableOwnerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
