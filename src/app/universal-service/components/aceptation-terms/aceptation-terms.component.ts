import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { UsfServiceService } from '@app/core/usf/usf-service.service';
import { BaseComponent } from '@app/core/base/BaseComponent';

declare let alertify: any;

export interface Model {
  agency: string;
}

export interface PeopleData {
  number: number;
  money: string;
}

@Component({
  selector: 'app-aceptation-terms',
  templateUrl: './aceptation-terms.component.html',
  styleUrls: ['./aceptation-terms.component.scss']
})
export class AceptationTermsComponent extends BaseComponent implements OnInit {
  public agencies = [
    'Programa de Asistencia para Nutrición Suplementaria (SNAP) (Estampillas para Alimentos)',
    'Ingreso Suplementario de Seguridad (SSI)',
    'Medicaid',
    'Asistencia Federal para la Vivienda Pública (FPHA)',
    'Beneficio de Pensión para Veteranos y Sobrevivientes'
  ];

  public form: FormGroup;

  model = new (class {
    agency = 'Seleccionar';
    ldiRestriction: boolean;
    peopleDataSelectedNumber: number;
    peopleDataSelected: PeopleData;
    earningsValidation: boolean;
    lifelineProgramInscription: boolean;
    aceptationTerm: boolean;
  })();

  homePeopleData: PeopleData[] = [
    { number: 1, money: '$16,389' },
    { number: 2, money: '$22,221' },
    { number: 3, money: '$28,053' },
    { number: 4, money: '$33,885' },
    { number: 5, money: '$39,717' },
    { number: 6, money: '$45,549' },
    { number: 7, money: '$51,381' },
    { number: 8, money: '$57,213' }
  ];

  dealer: number;
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

  constructor(
    public authenticationService: AuthenticationService,
    public usfServiceService: UsfServiceService,
    public router: Router,
    public fb: FormBuilder
  ) {
    super(authenticationService, usfServiceService, router, fb);
    this.dealer = this.authenticationService.credentials.Dealer;
  }

  ngOnInit() {
    window.scroll(0, 0);

    this.form = this.fb.group({
      agency: [
        null,
        Validators.compose([
          // Validators.required
        ])
      ],
      ldiRestriction: [null, Validators.compose([Validators.required])]
    });

    this.model.peopleDataSelectedNumber = this.homePeopleData[0].number;
    this.model.peopleDataSelected = this.homePeopleData[0];
  }

  goToPreviewViewAndFirm() {
    if (this.validateForm()) {
      this.processValidation = true;

      const datos = {
        method: 'CreateTerminosMcapi',
        USER_ID: this.authenticationService.credentials.userid,
        CASE_ID: this.validateSSNData.CASENUMBER,
        TERM: !this.model.aceptationTerm ? '0' : '1'
      };

      console.log(datos);

      this.usfServiceService.doAction(datos).subscribe(
        resp => {
          console.log(resp);

          if (!this.model.aceptationTerm) {
            this.processValidation = false;
            alertify.alert('Aviso', 'Su solicitud no pudo ser procesada. Su caso fue enviado al Back End.', () => {
              this.goTo('/home');
            });
          } else {
            const datos2 = {
              method: 'Updlongdistance',
              USER_ID: this.authenticationService.credentials.userid,
              CASE_ID: this.validateSSNData.CASENUMBER,
              LDI: this.model.ldiRestriction ? '1' : '0'
            };

            console.log(datos2);

            this.usfServiceService.doAction(datos2).subscribe(
              resp2 => {
                console.log(resp2);

                if (!resp2.body.HasError) {
                  // this.router.navigate(['/universal-service/activation'], { replaceUrl: true });

                  const datos3 = {
                    method: 'CreateSubscriberMcapi',
                    UserID: this.authenticationService.credentials.userid,
                    caseID: this.validateSSNData.CASENUMBER,
                    DealerFl: this.dealer
                  };

                  console.log(datos3);

                  this.usfServiceService.doAction(datos3).subscribe(
                    resp3 => {
                      this.processValidation = false;
                      this.suscriberNumber = resp3.body.subscriber;
                      this.banNumber = resp3.body.mBan;
                      if (!resp3.body.HasError) {
                        sessionStorage.setItem('suscriberNumber', resp3.body.subscriber);
                        this.router.navigate(['/universal-service/activation'], { replaceUrl: true });
                      } else {
                        if (resp3.body.ErrorDesc.toLocaleLowerCase().indexOf('enviado al back end')) {
                          this.suscriberNumber = localStorage.getItem('phone1');
                          // ottro numero es localStorage.getItem('simCard')
                          this.msjError = resp3.body.ErrorDesc;
                          this.toBackEnd = true;
                          this.caseIDReject = datos3.caseID;
                          console.log(this.dataObjectAddress, this.validateSSNData);
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
                  this.processValidation = false;
                  alertify.alert('Aviso', resp2.body.ErrorDesc, () => {
                    this.goTo('/home');
                  });
                }
              },
              error => {
                this.processValidation = false;
                console.log(error);
              }
            );
          }
        },
        error => {
          this.processValidation = false;
          console.log(error);
        }
      );
    }
  }

  goToAccountCreation() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }

  onChangeSelect($event: any) {
    this.model.peopleDataSelected = this.homePeopleData.find(x => x.number.toString() === $event);
  }

  validateForm() {
    return this.form.valid && this.model.aceptationTerm !== undefined;
  }

  setAceptationTerms(value: boolean) {
    if (!this.model.aceptationTerm) {
      this.model.aceptationTerm = value;
    }
  }
}
