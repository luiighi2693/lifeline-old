import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressDateComponent } from './address-date.component';

describe('AddressDateComponent', () => {
  let component: AddressDateComponent;
  let fixture: ComponentFixture<AddressDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
