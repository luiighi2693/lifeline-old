import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsfServiceService } from '@app/core/usf/usf-service.service';
import * as moment from 'moment';
import { BaseComponent } from '@app/core/base/BaseComponent';

@Component({
  selector: 'app-social-secure-verification',
  templateUrl: './social-secure-verification.component.html',
  styleUrls: ['./social-secure-verification.component.scss']
})
export class SocialSecureVerificationComponent extends BaseComponent implements OnInit {
  universalServicesUnitApplicant: boolean;
  prepaidAccountCreation: boolean;
  public form: FormGroup;
  existeSinCompletar: any = null;
  existeSinCompletarData: any = null;
  constructor(
    public authenticationService: AuthenticationService,
    public usfServiceService: UsfServiceService,
    public router: Router,
    public fb: FormBuilder
  ) {
    super(authenticationService, usfServiceService, router, fb);
    console.log(this.validateSSNData);
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.existeSinCompletar =
      localStorage.getItem('existSSNCase') !== 'null' ? localStorage.getItem('existSSNCase') : null;
    this.existeSinCompletarData = {
      case: localStorage.getItem('existSSNCaseNumber'),
      name: localStorage.getItem('existSSNCaseName'),
      ssn:
        localStorage.getItem('existSSNCaseSSN').length === 3
          ? '0' + localStorage.getItem('existSSNCaseSSN')
          : localStorage.getItem('existSSNCaseSSN'),
      phone: localStorage.getItem('existSSNCasePhone'),
      address: localStorage.getItem('existSSNCaseAddress'),
      ban: localStorage.getItem('existSSNCaseBan'),
      accountType: localStorage.getItem('accountType'),
      date: localStorage.getItem('lifelineActivationDate')
    };
    this.form = this.fb.group({
      universalServicesUnitApplicant: [null, Validators.compose([Validators.required])],
      prepaidAccountCreation: [null, Validators.compose([Validators.required])]
    });
  }

  goToAddressData() {
    this.router.navigate(['/universal-service/address-date'], { replaceUrl: true });
  }

  getValidLabel() {
    if (this.validateSSNData.data) {
      if (this.validateSSNData.CASENUMBER.toString() !== '0') {
        return 'Caso';
      }
    } else {
      if (this.validateSSNData.dataObject[0].CASENUMBER.toString() !== '0') {
        return 'Caso';
      }
    }
    return 'BAN';
  }
}
