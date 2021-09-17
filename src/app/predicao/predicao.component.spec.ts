import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredicaoComponent } from './predicao.component';

describe('PredicaoComponent', () => {
  let component: PredicaoComponent;
  let fixture: ComponentFixture<PredicaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredicaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
