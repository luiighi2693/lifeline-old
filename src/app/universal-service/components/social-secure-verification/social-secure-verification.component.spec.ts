import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialSecureVerificationComponent } from './social-secure-verification.component';

describe('SocialSecureVerificationComponent', () => {
  let component: SocialSecureVerificationComponent;
  let fixture: ComponentFixture<SocialSecureVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialSecureVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialSecureVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
