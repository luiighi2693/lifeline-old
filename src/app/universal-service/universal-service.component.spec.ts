import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversalServiceComponent } from './universal-service.component';

describe('UniversalServiceComponent', () => {
  let component: UniversalServiceComponent;
  let fixture: ComponentFixture<UniversalServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniversalServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniversalServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
