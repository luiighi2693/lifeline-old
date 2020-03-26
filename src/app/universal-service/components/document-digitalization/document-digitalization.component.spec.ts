import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentDigitalizationComponent } from './document-digitalization.component';

describe('DocumentDigitalizationComponent', () => {
  let component: DocumentDigitalizationComponent;
  let fixture: ComponentFixture<DocumentDigitalizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentDigitalizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentDigitalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
