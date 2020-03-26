import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AceptationTermsComponent } from './aceptation-terms.component';

describe('AceptationTermsComponent', () => {
  let component: AceptationTermsComponent;
  let fixture: ComponentFixture<AceptationTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AceptationTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AceptationTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
