import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/core';
import { BaseComponent } from '@app/core/base/BaseComponent';
import { UsfServiceService } from '@app/core/usf/usf-service.service';
import { FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BaseComponent implements OnInit {
  numberCase = '';
  applicationId = '';
  isLoading: boolean;
  permisions = true;
  processValidation = false;
  checkTerms = false;
  someErrorValidation = false;
  errorObject: any = null;
  complete = false;
  firstTime =  true;
  firstTimeNumberCase =  true;
  constructor(
    public authenticationService: AuthenticationService,
    public usfServiceService: UsfServiceService,
    public router: Router,
    public fb: FormBuilder
  ) {
    super(authenticationService, usfServiceService, router, fb);
    this.usfServiceService.setValue('validateSSNData', null);
    this.usfServiceService.setValue('dataObjectAddress', null);
    this.usfServiceService.setValue('ssn', null);
    this.usfServiceService.setValue('requiredDocuments', null);
    this.usfServiceService.setValue('dataAgencyMoneySelection', null);
  }

  ngOnInit() {
    this.isLoading = true;
    this.numberCase = '';
    this.getRol();

    localStorage.setItem('personalData', null);
  }

  goToUniversalService() {
    this.checkTerms = false;

    if (this.validateForm()) {
      this.processValidation = true;
    }
  }

  gotoUsfCase() {
    if (this.validateFormNumberCase()) {
      localStorage.setItem('numberCaseToSearch', this.numberCase);
      this.router.navigate(['/usf-case'], { replaceUrl: true }).then();
    }
  }
  getRol() {
    const data = this.usfServiceService.getValue('credentials');
    let credentials = '';
    credentials = data.RoleName;
    if (credentials === 'USF_SUP_V_Indirectas') {
      this.permisions = false;
    }
    console.log(credentials);
  }

  validateForm() {
    let go = false;
    if (this.applicationId.length == 0){
      go = true;
    } else {
      if (this.applicationId.length == 12){
        go = true;
      } else{
        alert('El ID de la aplicación es incorrecto, intente nuevamente');
        go = false;
      }
    }
    return go;
  }

  async goToUniversalServiceV2() {
    if (this.checkTerms === true) {
      this.usfServiceService.setValue('applicationId', this.applicationId);
      try {
        const resp = await this.usfServiceService.doAction({ method: 'GetListAgentMcapi' }).toPromise();
        const result = resp.body.data;

        // @ts-ignore
        result.forEach(item => {
            item.cod_id = item.cod_id.replace(/ /g, '');
        });

        this.usfServiceService.setValue('agencies', resp.body.data);
        this.goTo('/universal-service/personal-dates');
      } catch (e) {
        console.log(e);
      }
    }
    // TODO: mover a donde se valida el national verifier (despues de validar la direccion)

    // const datos = {
    //   method: 'subscriberVerificationMcapi',
    //   UserID: this.authenticationService.credentials.userid,
    //   // UserID: 97,
    //   eligibilityCheckId: this.applicationId,
    //   repId: this.accountId
    // };
    //
    // console.log(datos);
    //
    // this.usfServiceService.doAction(datos).subscribe(resp => {
    //   console.log(resp);
    //
    //   this.errorObject = resp.body;
    //
    //   if (resp.body.status === 'COMPLETE') {
    //     this.usfServiceService.setValue('subscriberVerificationObject', resp.body);
    //     this.router.navigate(['/universal-service/personal-dates'], { replaceUrl: true }).then();
    //   } else {
    //     this.processValidation = false;
    //     this.someErrorValidation = true;
    //   }
    // });
  }

  setFormatInputAppId() {
    if (this.applicationId.length ==11 && this.complete == false){
      this.applicationId =
        String(this.applicationId).substr(0, 6) +
        '-' +
        String(this.applicationId).substr(6, this.applicationId.length)
        this.complete = true;
        this.firstTime = false;

    } else {
      if(this.firstTime == false && this.applicationId.length < 6){
        this.complete = false;
        this.firstTime = true;
      }
    }
    return this.applicationId;
  }

  setFormatInputCase() {
    if (this.numberCase.length == 11 && this.complete == false){
      this.numberCase =
        String(this.numberCase).substr(0, 6) +
        '-' +
        String(this.numberCase).substr(6, this.numberCase.length);
      this.complete = true;
      this.firstTimeNumberCase = false;

    } else {
      if(this.firstTimeNumberCase == false && this.numberCase.length < 6){
        this.complete = false;
        this.firstTimeNumberCase = true;
      }
    }
    return this.numberCase;
  }

  validateFormNumberCase() {
    let go = true;
    if (!/^([0-9])*$/.test(this.numberCase.toString())) {
      if (this.numberCase.length == 0){
        go = true;
      } else {
        if (this.numberCase.length == 12){
          go = true;
        } else{
          alert('El ID de la aplicación es incorrecto, intente nuevamente');
          go = false;
        }
      }
    }
    return go;
  }
}

