import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SteplifeComponent } from './steplife.component';

describe('SteplifeComponent', () => {
  let component: SteplifeComponent;
  let fixture: ComponentFixture<SteplifeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SteplifeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SteplifeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
