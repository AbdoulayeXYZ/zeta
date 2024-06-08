import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfomodelComponent } from './infomodel.component';

describe('InfomodelComponent', () => {
  let component: InfomodelComponent;
  let fixture: ComponentFixture<InfomodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InfomodelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfomodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
