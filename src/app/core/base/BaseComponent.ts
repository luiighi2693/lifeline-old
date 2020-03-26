import { AuthenticationService } from '@app/core';
import { UsfServiceService } from '@app/core/usf/usf-service.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import Util from '@app/universal-service/util';
import * as moment from 'moment';
import { BaseRouter } from '@app/core/base/BaseRouter';
declare let alertify: any;
declare let $: any;

export interface ValidateSSNData {
  data: ValidateSSNDataContent[];
  dataObject: ValidateSSNDataContent[];
  response: string;
  CASENUMBER: number;
}

export interface ValidateSSNDataContent {
  accountType: string;
  address: string;
  ban: string;
  lifelineActivationDate: string;
  name: string;
  ssn: string;
  subscriberNumber: string;
  phone1: string;
  CASENUMBER: string;
}

export interface DataObjectAddress {
  CASENUMBER: string;
  CUSTOMERADDRESS: string;
  CUSTOMERLASTNAME: string;
  CUSTOMERNAME: string;
  DOB: string;
  SSN: string;
  SUGGESTADDRESS: string;
  contactNumber1: string;
  contactNumber2: string;
}

export interface PeopleData {
  number: number;
  money: string;
}

export interface DataAgencyMoneySelection {
  agency: string;
  ldiRestriction: boolean;
  peopleDataSelectedNumber: number;
  peopleDataSelected: PeopleData;
  earningsValidation: boolean;
  lifelineProgramInscription: boolean;
  aceptationTerm: boolean;
}

export class BaseComponent extends BaseRouter {
  public form: FormGroup;
  validateSSNData: ValidateSSNData;
  dataObjectAddress: DataObjectAddress[];
  moment = moment;
  alertify = alertify;
  $ = $;

  constructor(
    public authenticationService: AuthenticationService,
    public usfServiceService: UsfServiceService,
    public router: Router,
    public fb: FormBuilder
  ) {
    super(router);
    authenticationService.validaSessionActiva();
    this.authenticationService.getCredentials().timeLogin = new Date();
    this.authenticationService.setCredentials(this.authenticationService.getCredentials());
    this.validateSSNData = this.usfServiceService.getValue('validateSSNData');
    this.dataObjectAddress = this.usfServiceService.getValue('dataObjectAddress');
  }

  public goToHome() {
    this.router.navigate(['/home'], { replaceUrl: true }).then();
  }

  public checkNumbersOnly = (event: any): boolean => Util.checkNumbersOnly(event);

  public checkCharactersOnly = (event: any): boolean => Util.checkCharactersOnly(event);

  getFormatDateCustom = (date: string) => this.moment(new Date(date)).format('MM/DD/YYYY');

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
}
