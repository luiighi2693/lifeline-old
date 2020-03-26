import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { BaseComponent, DataAgencyMoneySelection, PeopleData } from '@app/core/base/BaseComponent';
import { UsfServiceService } from '@app/core/usf/usf-service.service';
import { FormBuilder, Validators } from '@angular/forms';
declare let alertify: any;

@Component({
  selector: 'app-register-case',
  templateUrl: './register-case.component.html',
  styleUrls: ['./register-case.component.scss']
})
export class RegisterCaseComponent extends BaseComponent implements OnInit {
  processValidationNLAD = false;
  subscriberVerificationObject: any = {
  };
  processValidationApplicationId = false;

  constructor(
    public authenticationService: AuthenticationService,
    public router: Router,
    public usfServiceService: UsfServiceService,
    public fb: FormBuilder
  ) {
    super(authenticationService, usfServiceService, router, fb);
    // Formateando Acentos
    if (this.dataObjectAddress[0] !== undefined && this.dataObjectAddress[0].CUSTOMERADDRESS !== undefined) {
      this.dataObjectAddress[0].CUSTOMERADDRESS = this.convertAcents(this.dataObjectAddress[0].CUSTOMERADDRESS);
    }

    this.subscriberVerificationObject = this.usfServiceService.getValue('subscriberVerificationObject');

    console.log(this.subscriberVerificationObject);

    if (this.usfServiceService.getValue('applicationId') !== null) {
      if (this.subscriberVerificationObject.applicationId !== this.usfServiceService.getValue('applicationId')) {
        this.processValidationApplicationId = true;
      }
    }
  }

  ngOnInit() {
    window.scroll(0, 0);

    this.form = this.fb.group({
      eligibilityCheckId: ['', Validators.compose([Validators.required])],
      idNumber: ['', Validators.compose([])],
      elegibilityCheck: [null, Validators.compose([Validators.required])]
    });
  }

  convertAcents(oration: string) {
    const acentos = [
      ['&aacute;', 'á'],
      ['&eacute;', 'é'],
      ['&iacute;', 'í'],
      ['&oacute;', 'ó'],
      ['&uacute;', 'ú'],
      ['&ntilde;', 'ñ'],
      ['&Aacute;', 'Á'],
      ['&Eacute;', 'É'],
      ['&Iacute;', 'Í'],
      ['&Oacute;', 'Ó'],
      ['&Uacute;', 'Ú'],
      ['&Ntilde;', 'Ñ']
    ];
    acentos.map(function(acento: any) {
      oration = oration.replace(acento[0], acento[1]);
    });
    return oration;
  }

  goToUsfVerification() {
    if (this.subscriberVerificationObject.status === 'COMPLETE' && this.subscriberVerificationObject.activeSubscriber === 'N') {
      this.router.navigate(['/universal-service/document-digitalization'], { replaceUrl: true });
    }
  }

  getSnn(SSN: string) {
    return SSN.length === 3 ? '0' + SSN : SSN;
  }

  goHome() {
    this.processValidationNLAD = true;
  }
}
