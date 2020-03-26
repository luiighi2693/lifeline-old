import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthenticationService } from '@app/core';
import { UsfServiceService } from '@app/core/usf/usf-service.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    sessionStorage.setItem(
      'credentials',
      '{"ErrorDesc":null,"ErrorInterInfo":null,"ErrorNum":0,"HasError":false,' +
        '"Active":true,"DealerCode":"00001","Device_Id":null,"Email":"USF2",' +
        '"IsAdmin":false,"LastLogin":null,"LastName":"USF2","Location":"Reg - General","Locations":[],' +
        '"LoginAttems":0,"Name":"USF2","Password":null,"PhoneNumber":null,"RoleID":2,' +
        '"RoleName":"USF-Agent","UserName":"USF2","userid":85}'
    );

    TestBed.configureTestingModule({
      imports: [CommonModule, HttpClientModule, RouterTestingModule],
      declarations: [HeaderComponent],
      providers: [AuthenticationService, UsfServiceService]
    })
      .compileComponents()
      .then();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
