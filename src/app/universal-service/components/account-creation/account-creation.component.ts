import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@app/core/base/BaseComponent';
import { UsfServiceService } from '@app/core/usf/usf-service.service';

declare let alertify: any;

export interface Model {
  accountType: string;
  tecnology: string;
  planType: string;
  imei: string;
  simCard: string;
}

export interface Plan {
  plan: string;
  planName: string;
  planDetails: string[];
}

@Component({
  selector: 'app-account-creation',
  templateUrl: './account-creation.component.html',
  styleUrls: ['./account-creation.component.scss']
})
export class AccountCreationComponent extends BaseComponent implements OnInit {
  processValidationSIF = false;

  public accountTypes = ['Prepago Móvil'];
  public planTypes = ['Móvil Prepago'];
  public tecnologies = ['GSM'];
  public locations: any[];
  public thereIsLocations = false;
  public selectedLocation = '';
  public step = 'step1';
  public form: FormGroup;
  model: Model = new (class implements Model {
    accountType = '';
    tecnology = '';
    planType = '';
    imei = '';
    simCard = '';
  })();

  /*
  {
    plan: 'Plan 2099',
    planDetails: [
      '1,000 minutos para uso de voz local, larga distancia a Estados Unidos' +
        ' y “Roaming” en EEUU compartido. Costo del minuto adicional es 10¢.',
      '400 SMS/MMS locales, a EEUU y a ciertos destinos internacionales',
      'Costo SMS/MMS adicional enviado es de 10¢.',
      'SMS/MMS recibidos son gratis.'
    ]
  },
  */
  plans: Plan[] = [
    {
      plan: 'Plan 2219',
      planName: '2219',
      planDetails: [
        '1,100 minutos para uso de voz local, larga distancia a Estados Unidos' + ' y “Roaming” en EEUU.',
        '1,000 SMS/MMS en PR & USA.',
        'SMS/MMS recibidos son gratis.',
        ' 3 GB de data para uso en PR y en EEUU con Bloqueo.'
      ]
    },
    {
      plan: 'Plan 2219 LTE',
      planName: '2219LTE',
      planDetails: [
        '1,100 minutos para uso de voz local, larga distancia a Estados Unidos' + ' y “Roaming” en EEUU.',
        '1,000 SMS/MMS en PR & USA.',
        'SMS/MMS recibidos son gratis.',
        ' 3 GB de data para uso en PR y en EEUU con Bloqueo.'
      ]
    }
  ];

  planSelected: Plan = undefined;

  public checkImeiValidated = false;

  public dealer: any;
  checkLDI: any = null;

  processValidation = false;
  toBackEnd = false;
  msjError = '';
  caseIDReject: any = null;
  suscriberNumber: any = null;
  banNumber: any = null;

  currentDate: any = {
    dd: new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate(),
    mm: new Date().getMonth() < 9 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1,
    yy: new Date().getFullYear()
  };
  stepOneDone = false;

  constructor(
    public authenticationService: AuthenticationService,
    public usfServiceService: UsfServiceService,
    public router: Router,
    public fb: FormBuilder
  ) {
    super(authenticationService, usfServiceService, router, fb);

    if (this.dataObjectAddress[0] !== undefined && this.dataObjectAddress[0].CUSTOMERADDRESS !== undefined) {
      this.dataObjectAddress[0].CUSTOMERADDRESS = this.convertAcents(this.dataObjectAddress[0].CUSTOMERADDRESS);
    }
  }

  ngOnInit() {
    window.scroll(0, 0);

    this.dealer = this.authenticationService.credentials.Dealer;

    this.dealer.toString() === '0' ? this.getLocationsCustom() : this.getLocations();

    this.form = this.fb.group({
      accountType: [null, Validators.compose([Validators.required])],
      tecnology: [null, Validators.compose([Validators.required])],
      planType: [null, Validators.compose([Validators.required])],
      selectedLocation: [null, Validators.compose([Validators.required])],
      imei: [null, Validators.compose([Validators.required])],
      simCard: [null, Validators.compose([Validators.required])]
    });
  }

  goToAceptationTerms() {
    if (
      this.form.valid &&
      this.checkImeiValidated &&
      this.model.imei.length === 15 &&
      this.model.simCard.length === 20 &&
      this.selectedLocation !== undefined &&
      this.selectedLocation !== ''
    ) {
      this.stepOneDone = false;
      this.processValidationSIF = true;
      console.log(this.selectedLocation);
      const datos = {
        method: 'CreateNewAccountMcapi',
        UserID: this.authenticationService.credentials.userid,
        caseID: this.validateSSNData.CASENUMBER,
        mAccountType: 'I',
        mAccountSubType: 'P',
        customer_ssn: this.usfServiceService.getValue('ssn').toString().replace('-', ''),
        SIMSerial: this.model.simCard,
        IMEISerial: this.model.imei,
        tech: this.model.tecnology,
        mSocCode: this.planSelected.planName,
        USF_LOCATION: this.selectedLocation
      };

      console.log(datos);

      this.usfServiceService.doAction(datos).subscribe(resp => {
        if (!resp.body.HasError) {
          this.stepOneDone = true;
          // para ser usado en caso de excepcion en ultima ventana
          localStorage.setItem('simCard', this.model.simCard);
          // this.router.navigate(['/universal-service/aceptation-terms'], { replaceUrl: true });
          const datos3 = {
            method: 'CreateSubscriberMcapi',
            UserID: this.authenticationService.credentials.userid,
            caseID: this.validateSSNData.CASENUMBER,
            DealerFl: this.dealer
          };

          console.log(datos3);

          this.usfServiceService.doAction(datos3).subscribe(
            resp3 => {
              this.processValidationSIF = false;
              this.processValidation = false;
              this.suscriberNumber = resp3.body.subscriber;
              this.banNumber = resp3.body.mBan;
              if (!resp3.body.HasError) {
                sessionStorage.setItem('suscriberNumber', resp3.body.subscriber);
                this.router.navigate(['/universal-service/activation'], { replaceUrl: true });
              } else {
                this.stepOneDone = false;
                if (resp3.body.ErrorDesc.toLocaleLowerCase().indexOf('enviado al back end')) {
                  this.suscriberNumber = localStorage.getItem('phone1');
                  // ottro numero es localStorage.getItem('simCard')
                  this.msjError = resp3.body.ErrorDesc;
                  this.toBackEnd = true;
                  this.caseIDReject = datos3.caseID;
                  // console.log(this.dataObjectAddress, this.validateSSNData);
                } else {
                  alertify.alert('Aviso', resp3.body.ErrorDesc, () => {
                    this.goTo('/home');
                  });
                }
              }
            },
            error => {
              this.processValidation = false;
              console.log(error);
            }
          );
        } else {
          this.processValidationSIF = false;
          this.processValidation = false;

          localStorage.setItem('simCard', null);

          alertify.alert(
            'Aviso',
            // tslint:disable-next-line:max-line-length
            'Ha ocurrido un error intentando crear la cuenta, recuerde que al segundo intento el caso será eliminado.',
            () => {
              this.manageStep();
            }
          );
        }
      });
    }
  }

  manageStep() {
    if (this.step === 'step1') {
      this.step = 'step2';
    } else {
      this.goToStep2();
    }
  }

  goToStep2() {
    const datos3 = {
      method: 'DeleteCaseAllMcapi',
      USER_ID: this.authenticationService.credentials.userid,
      CASE_ID: this.validateSSNData.CASENUMBER
    };

    console.log(datos3);

    this.usfServiceService.doAction(datos3).subscribe(
      resp3 => {
        this.goToHome();
      },
      error => {
        this.processValidation = false;
        console.log(error);
      }
    );
  }

  goToDocumentDigitalization() {
    this.router.navigate(['/universal-service/document-digitalization'], { replaceUrl: true });
  }

  onCheckChange($event: any) {
    this.checkImeiValidated = !this.checkImeiValidated;
  }

  setPlan($event: any) {
    this.planSelected = this.plans.find(x => x.plan === $event);
  }
  getLocations() {
    const data = this.usfServiceService.getValue('credentials');
    let loadLocations = [];
    this.locations = [];
    loadLocations = data.Locations;

    if (loadLocations.length > 0) {
      this.thereIsLocations = true;
      for (let i = 0; i < loadLocations.length; i++) {
        this.locations.push(loadLocations[i].location);
      }
      console.log(this.locations);
    }
  }
  getLocationsCustom() {
    this.locations = [];

    const datos = {
      method: 'getLocationMcapi'
    };

    console.log(datos);

    this.usfServiceService.doAction(datos).subscribe(resp => {
      console.log(resp.body.length);

      if (resp.body.length > 0) {
        this.thereIsLocations = true;

        // @ts-ignore
        resp.body.forEach(item => {
          this.locations.push(item.location_sif);
        });

        console.log(this.locations);
      }
    });
  }

  getSuggestAddress() {
    return this.dataObjectAddress.length === 3 ?
      this.dataObjectAddress[2].SUGGESTADDRESS : this.dataObjectAddress[0].SUGGESTADDRESS;
  }
}
