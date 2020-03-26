import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalDatesComponent } from './personal-dates.component';

describe('PersonalDatesComponent', () => {
  let component: PersonalDatesComponent;
  let fixture: ComponentFixture<PersonalDatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalDatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
