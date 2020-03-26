import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsfVerificationComponent } from './usf-verification.component';

describe('UsfVerificationComponent', () => {
  let component: UsfVerificationComponent;
  let fixture: ComponentFixture<UsfVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsfVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsfVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
