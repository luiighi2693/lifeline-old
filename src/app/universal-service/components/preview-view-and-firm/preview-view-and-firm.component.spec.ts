import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewViewAndFirmComponent } from './preview-view-and-firm.component';

describe('PreviewViewAndFirmComponent', () => {
  let component: PreviewViewAndFirmComponent;
  let fixture: ComponentFixture<PreviewViewAndFirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewViewAndFirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewViewAndFirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
