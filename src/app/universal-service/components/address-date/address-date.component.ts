import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import Util from '@app/universal-service/util';
import { CustomValidators } from 'ngx-custom-validators';
import { UsfServiceService } from '@app/core/usf/usf-service.service';
import { BaseComponent } from '@app/core/base/BaseComponent';

declare let alertify: any;

export interface Model {
  temporalAddress1: boolean;
  contactNumber1: string;
  contactNumber2: string;
  temporalAddress: boolean;
  address: string;
  depUnitOther: string;
  municipality: string;
  estate: string;
  postalCode: string;
  email: string;
  contactChannel: string;
  postalAddressFlag: boolean;
  postalAddress: string;
  postalDepUnitOther: string;
  postalMunicipality: string;
  postalEstate: string;
  postalCode2: string;
  addressSelected: string;
  temporalAddressExtraContent: string;
  suggestedFlag: boolean;
  suggestedAddress: string;
  suggestedDepUnitOther: string;
  suggestedMunicipality: string;
  suggestedPostalCode: string;
  fisicalAddress: string;
  fisicalDepUnitOther: string;
  fisicalMunicipality: string;
  fisicalPostalCode: string;
  infisicalAddress: string;
  infisicalUrban: string;
  infisicalState: string;
  infisicalMunicipality: string;
  infisicalPostalCode: string;
  clientOK: boolean;
}

@Component({
  selector: 'app-address-date',
  templateUrl: './address-date.component.html',
  styleUrls: ['./address-date.component.scss']
})
export class AddressDateComponent extends BaseComponent implements OnInit {
  validationProcessUSPS = false;
  validationDataAddressInput = false;
  validationProcessMAILPREP = false;

  contactChannelEmail = false;
  contactChannelPhone = false;
  contactChannelTextMessage = false;
  contactChannelMail = false;

  public dataReject: any = null;

  format1 = 'XXX-XXX-XX-XX';

  public municipalities = [
    '65 de Infantería',
    'Adjuntas',
    'Aguada',
    'Aguadilla',
    'Aguas Buenas',
    'Aguirre',
    'Aibonito',
    'Angeles',
    'Arecibo',
    'Arroyo',
    'Atocha',
    'Añasco',
    'Bajadero',
    'Barceloneta',
    'Barranquitas',
    'Barrio Obrero',
    'Bayamón',
    'Boquerón',
    'Cabo Rojo',
    'Caguas',
    'Camuy',
    'Canóvanas',
    'Caparra Heights',
    'Carolina',
    'Castañer',
    'Cataño',
    'Cayey',
    'Ceiba',
    'Ciales',
    'Cidra',
    'Coamo',
    'Comerío',
    'Corozal',
    'Coto Laurel',
    'Culebra',
    'Dorado',
    'Ensenada',
    'Fajardo',
    'Fernández Juncos',
    'Florida',
    'Fort Buchanan',
    'Garrochales',
    'General Post Office',
    'Guayama',
    'Guayanilla',
    'Guaynabo',
    'Gurabo',
    'Guánica',
    'Hatillo',
    'Hato Rey',
    'Hormigueros',
    'Humacao',
    'Isabela',
    'Jayuya',
    'Juana Díaz',
    'Juncos',
    'La Plata',
    'Lajas',
    'Lares',
    'Las Marías',
    'Las Piedras',
    'Levittown',
    'Loiza',
    'Loiza Street Station',
    'Luquillo',
    'Manatí',
    'Maricao',
    'Maunabo',
    'Mayagüez',
    'Mercedita',
    'Minillas Station',
    'Moca',
    'Morovis',
    'Naguabo',
    'Naranjito',
    'Old San Juan',
    'Orocovis',
    'Palmer',
    'Pámpanos',
    'Playa',
    'Patillas',
    'Peñuelas',
    'Ponce',
    'Puerta de Tierra',
    'Puerto Real',
    'Punta Santiago',
    'Quebradillas',
    'Ramey Station',
    'Rincón',
    'Rio Blanco',
    'Rio Grande',
    'Río Piedras',
    'Rosario',
    'Sabana Hoyos',
    'Sabana Grande',
    'Sabana Seca',
    'Salinas',
    'San Antonio',
    'San Germán',
    'San José',
    'San Juan',
    'San Lorenzo',
    'San Sebastián',
    'Santa Isabel',
    'Santurce',
    'Toa Alta',
    'Toa Baja',
    'Trujillo Alto',
    'Utuado',
    'UPR Station',
    'Vega Alta',
    'Vega Baja',
    'Veterans Plaza',
    'Vieques',
    'Villalba',
    'Yabucoa',
    'Yauco'
  ];

  public estates = ['Puerto Rico'];

  public form: FormGroup;
  model: Model = new (class implements Model {
    temporalAddress1 = false;
    contactNumber1: string = null;
    contactNumber2: string = null;
    temporalAddress = false;
    address = '';
    depUnitOther = '';
    municipality = '';
    estate = '';
    postalCode = '';
    email = '';
    contactChannel = '';
    postalAddressFlag: boolean;
    postalAddress = '';
    postalDepUnitOther = '';
    postalMunicipality = '';
    postalEstate = '';
    postalCode2 = '';
    addressSelected = 'postal';
    temporalAddressExtraContent = '';
    suggestedFlag = false;
    suggestedAddress = '';
    suggestedDepUnitOther = '';
    suggestedMunicipality = '';
    suggestedPostalCode = '';
    fisicalAddress = '';
    fisicalDepUnitOther = '';
    fisicalMunicipality = '';
    fisicalPostalCode = '';
    infisicalAddress = '';
    infisicalState = '';
    infisicalUrban = '';
    infisicalMunicipality = '';
    infisicalPostalCode = '';
    clientOK = false;
  })();

  counter1 = 1;
  counter2 = 1;
  counter4 = 1;
  someErrorValidation = false;
  suggestedAddressValidation: any;
  nvLoader = false;

  constructor(
    public authenticationService: AuthenticationService,
    public usfServiceService: UsfServiceService,
    public router: Router,
    public fb: FormBuilder
  ) {
    super(authenticationService, usfServiceService, router, fb);
  }

  ngOnInit() {
    window.scroll(0, 0);

    this.form = this.fb.group({
      temporalAddress1: [null, Validators.compose([Validators.required])],
      contactNumber1: [
        null,
        Validators.compose([
          // Validators.required
        ])
      ],
      contactNumber2: [
        null,
        Validators.compose([
          // Validators.required
        ])
      ],
      temporalAddress: [null, Validators.compose([Validators.required])],
      address: [
        null,
        Validators.compose([
          // Validators.required
        ])
      ],
      depUnitOther: [
        null,
        Validators.compose([
          // Validators.required
        ])
      ],
      municipality: [null, Validators.compose([Validators.required])],
      estate: [null, Validators.compose([Validators.required])],
      postalCode: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required, CustomValidators.email])],
      contactChannel: [
        null,
        Validators.compose([
          // Validators.required
        ])
      ],
      postalAddressFlag: [null, Validators.compose([Validators.required])],
      postalAddress: [
        null,
        Validators.compose([
          // Validators.required
        ])
      ],
      postalDepUnitOther: [
        null,
        Validators.compose([
          // Validators.required
        ])
      ],
      postalMunicipality: [
        null,
        Validators.compose([
          // Validators.required
        ])
      ],
      postalEstate: [
        null,
        Validators.compose([
          // Validators.required
        ])
      ],
      postalCode2: [
        null,
        Validators.compose([
          // Validators.required
        ])
      ],
      addressSelected: [
        null,
        Validators.compose([
          // Validators.required
        ])
      ]
    });
  }

  goToBack() {
    this.validationDataAddressInput = false;
  }

  goToValidationDataAddressInput() {
    if (
      this.form.valid &&
      ((this.model.temporalAddress && this.model.temporalAddressExtraContent.length > 0) ||
        !this.model.temporalAddress) &&
      this.validatePostalAddress() &&
      this.validateContactChannel() &&
      ((!this.model.temporalAddress && this.model.address.length > 0 && this.model.contactNumber1.length === 12) ||
        this.model.temporalAddress) &&
      this.validateContactNumber2()
    ) {
      console.log(this.model);
      this.validationProcessUSPS = true;

      const datos = {
        method: 'addressValidationMcapi',
        user_ID: this.authenticationService.credentials.userid,
        case_ID: this.validateSSNData.CASENUMBER,
        addresstype: this.model.temporalAddress ? 3 : 1,
        address1: this.model.temporalAddress
          ? this.model.temporalAddressExtraContent + ' ' + this.model.address
          : this.model.address,
        address2: this.model.depUnitOther,
        city: this.model.municipality,
        state: 'PR',
        zip: this.model.postalCode,
        phone1: this.model.contactNumber1,
        phone2: this.model.contactNumber2,
        email: this.model.email,
        contact_preference: this.getContactChannelValues(),
        PostalAddress: this.model.postalAddressFlag ? 'true' : 'false',
        temporal_address: this.model.temporalAddress1 ? '1' : '0',
        PostalAddress1: this.model.postalAddress,
        PostalAddress2: this.model.postalDepUnitOther,
        PostalAddresscity: this.model.postalMunicipality,
        PostalAddressState: 'PR',
        PostalAddresszip: this.model.postalCode2,
        strconsentInd: this.model.clientOK ? 'Y' : 'N'
      };

      console.log(datos);

      this.usfServiceService.doAction(datos).subscribe(resp => {
        this.validationProcessUSPS = false;

        if (!resp.body.HasError) {
          //CASO DE EXITO
          // para ser usado en caso de excepcion en ultima ventana
          localStorage.setItem('phone1', datos.phone1);

          this.validationDataAddressInput = true;
          this.model.addressSelected = 'postal';

          // this.model.fisicalAddress = resp.body.data[0].addr;
          // this.model.fisicalDepUnitOther = resp.body.data[0].bldgorfirm;
          // this.model.fisicalMunicipality = resp.body.data[0].city;
          // this.model.fisicalPostalCode = resp.body.data[0].zip;

          // this.model.infisicalAddress = resp.body.data[0].inaddr;
          // this.model.infisicalUrban = resp.body.data[0].inurban;
          // this.model.infisicalState = resp.body.data[0].instate;
          // this.model.infisicalMunicipality = resp.body.data[0].incity;
          // this.model.infisicalPostalCode = resp.body.data[0].inzip;

          const dataObjectAddress = resp.body.dataObject;
          dataObjectAddress[0].contactNumber1 = this.model.contactNumber1;
          dataObjectAddress[0].contactNumber2 = this.model.contactNumber2;

          //CASO 4
          this.model.suggestedFlag = dataObjectAddress[2].SUGGESTADDRESS !== '';

          // this.model.suggestedAddress = resp.body.data[0].addr;
          // this.model.suggestedDepUnitOther = resp.body.data[0].urban;
          // this.model.suggestedMunicipality = resp.body.data[0].city;
          // this.model.suggestedPostalCode = resp.body.data[0].zip;

          this.suggestedAddressValidation = resp.body.dataObject[2];
          this.model.addressSelected = !this.model.suggestedFlag ? 'postalSuggested' : 'postal';
          console.log(this.model.addressSelected);

          // CASE 4
          if (
            (this.model.temporalAddress && !this.model.postalAddressFlag) ||
            (dataObjectAddress[2].SUGGESTADDRESS === '' && dataObjectAddress[0].CUSTOMERADDRESS === '')
          ) {
            if (this.model.suggestedFlag) {
              dataObjectAddress[2].SUGGESTADDRESS =
                this.model.suggestedAddress +
                ' ' +
                this.model.suggestedDepUnitOther +
                ' ' +
                this.model.suggestedMunicipality +
                ' PR ' +
                this.model.suggestedPostalCode;
            } else {
              if (!this.model.postalAddressFlag) {
                dataObjectAddress[2].SUGGESTADDRESS =
                  this.model.postalAddress +
                  ' ' +
                  this.model.postalDepUnitOther +
                  ' ' +
                  this.model.postalMunicipality +
                  ' PR ' +
                  this.model.postalCode2;
              } else {
                dataObjectAddress[2].SUGGESTADDRESS =
                  this.model.address +
                  ' ' +
                  this.model.depUnitOther +
                  ' ' +
                  this.model.municipality +
                  ' PR ' +
                  this.model.postalCode;
              }
            }
          }

          dataObjectAddress[0].CUSTOMERADDRESS =
            this.model.address +
            ' ' +
            this.model.depUnitOther +
            ' ' +
            this.model.municipality +
            ' PR ' +
            this.model.postalCode;

          this.usfServiceService.setValue('dataObjectAddress', dataObjectAddress);
        } else {
          localStorage.setItem('phone1', null);
          this.dataReject = resp.body.data[0];
          alertify.alert(
            'Aviso',
            // tslint:disable-next-line:max-line-length
            resp.body.ErrorDesc,
            () => {
              //casos de error
              //caso 1
              if (!this.model.temporalAddress && this.model.postalAddressFlag) {
                if (this.counter1 > 4) {
                  // this.goToHome();
                  this.showEception();
                } else {
                  this.counter1++;
                }
              }

              //caso 2
              if (!this.model.temporalAddress && !this.model.postalAddressFlag) {
                if (this.counter2 > 4) {
                  // this.goToHome();
                  this.showEception();
                } else {
                  this.counter2++;
                }
              }

              //caso 3
              if (this.model.temporalAddress && this.model.postalAddressFlag) {
                // this.goToHome();
                this.showEception();
              }

              //caso 4
              if (this.model.temporalAddress && !this.model.postalAddressFlag) {
                if (this.counter4 > 4) {
                  // this.goToHome();
                  this.showEception();
                } else {
                  this.counter4++;
                }
              }
            }
          );
        }
      });

      // setTimeout(() => {
      //   this.validationProcessUSPS = false;
      //   this.validationDataAddressInput = true;
      // }, 3000);
    }
  }

  validateContactNumber2() {
    if (this.model.contactNumber2) {
      return this.model.contactNumber2.length === 12;
    } else {
      return false;
    }
  }

  goToRegisterCase() {
    this.validationDataAddressInput = false;

    const datos = {
      method: 'subscriberVerificationMcapi',
      UserID: this.authenticationService.credentials.userid,
      caseID: this.validateSSNData.CASENUMBER,
      applicationId: this.usfServiceService.getValue('applicationId')
    };

    console.log(datos);
    this.nvLoader = true;

    this.usfServiceService.doAction(datos).subscribe(resp => {
      console.log(resp);
      this.nvLoader = false;
      this.usfServiceService.setValue('subscriberVerificationObject', resp.body);
      this.router.navigate(['/universal-service/register-case'], { replaceUrl: true }).then();
    });
  }

  showEception() {
    // this.someErrorValidation = true;
    this.goToHome();
  }

  goToPersonalDates() {
    this.router.navigate(['/universal-service/personal-dates'], { replaceUrl: true });
  }

  formatInputContactNumber(input: string) {
    switch (input) {
      case 'contactNumber1': {
        this.model.contactNumber1 = this.formatInput(this.model.contactNumber1, this.format1);
        break;
      }

      case 'contactNumber2': {
        this.model.contactNumber2 = this.formatInput(this.model.contactNumber2, this.format1);
        break;
      }
    }
  }

  public formatInput(input: string, format: string) {
    if (format === this.format1) {
      if (input.length === 4) {
        return input.substr(0, input.length - 1) + '-' + input.substr(input.length - 1, input.length);
      }

      if (input.length === 8) {
        return input.substr(0, input.length - 1) + '-' + input.substr(input.length - 1, input.length);
      }

      // if (input.length === 11) {
      //   return input.substr(0, input.length - 1) + '-' + input.substr(input.length - 1, input.length);
      // }

      return input;
    }

    return '';
  }

  validatePostalAddress() {
    if (this.model.postalAddressFlag) {
      return true;
    } else {
      return (
        this.model.postalAddress.length > 0 &&
        this.model.postalMunicipality.length > 0 &&
        this.model.postalEstate.length > 0 &&
        this.model.postalCode2.length > 0
      );
    }
  }

  public validateContactChannel() {
    let contactChannelArray = [];
    contactChannelArray.push(
      this.contactChannelEmail,
      this.contactChannelPhone,
      this.contactChannelTextMessage,
      this.contactChannelMail
    );
    console.log(contactChannelArray);
    return contactChannelArray.includes(true);
  }

  public getContactChannelValues() {
    let contactChannelArray = [];
    let contactChannelArrayValues: number[] = [];
    let index = 0;

    contactChannelArray.push(
      this.contactChannelEmail,
      this.contactChannelPhone,
      this.contactChannelTextMessage,
      this.contactChannelMail
    );

    contactChannelArray.forEach(contactChannelflag => {
      if (contactChannelflag) {
        contactChannelArrayValues.push(index + 1);
      }
      index++;
    });

    // return contactChannelArrayValues;
    return '[' + contactChannelArrayValues.join(',') + ']';
  }

  // changeValueTemporalAdress() {
  //   console.log(this.model.temporalAddress);
  //
  //   if (this.model.temporalAddress) {
  //     this.form.controls['address'].clearValidators();
  //   } else {
  //     this.form.controls['address'].setValidators([Validators.required]);
  //   }
  //
  //   this.validatePostalAddress();
  // }
  validateSuggestedCustomAddress() {
    if (this.suggestedAddressValidation) {
      return this.suggestedAddressValidation.SUGGESTADDRESS !== '';
    } else {
      return false;
    }
  }

  blurContactNumber1() {
    if (this.model.contactNumber1) {
      if (this.model.contactNumber1.length >= 3) {
        if (!this.model.contactNumber1.startsWith('787')) {
          if (!this.model.contactNumber1.startsWith('939')) {
            this.model.contactNumber1 = '';
          }
        }
      }
    }
  }

  blurContactNumber2() {
    if (this.model.contactNumber2) {
      if (this.model.contactNumber2.length >= 3) {
        if (!this.model.contactNumber2.startsWith('787')) {
          if (!this.model.contactNumber2.startsWith('939')) {
            this.model.contactNumber2 = '';
          }
        }
      }
    }
  }
}
