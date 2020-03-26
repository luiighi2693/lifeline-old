import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseComponent, DataAgencyMoneySelection } from '@app/core/base/BaseComponent';
import { UsfServiceService } from '@app/core/usf/usf-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { constants } from '@env/constants';
declare let alertify: any;

export interface DocumentLifeline {
  name: string;
  types: string[];
  maxSize: number;
  subDocuments: SubDocumentLifeline[];
}

export interface SubDocumentLifeline {
  name: string;
  maxSize: number;
}

export interface RequiredDocumentContent {
  id: string;
  name: string;
  isCharged: boolean;
  idToSearch: string;
  isContinue: boolean;
  fileIds: string[];
  maxSize: number;
  isPDF: boolean;
}

@Component({
  selector: 'app-document-digitalization',
  templateUrl: './document-digitalization.component.html',
  styleUrls: ['./document-digitalization.component.scss']
})
export class DocumentDigitalizationComponent extends BaseComponent implements OnInit {
  previewView = false;
  loadingDocs = false;

  // DEV: Evidencia de factura
  // PROD: Evidencia Dirección Física

  documents: DocumentLifeline[] = [
    {
      name: 'Formulario de Servicio Universal',
      types: ['.pdf', '.jpeg', '.png'],
      maxSize: 10000,
      subDocuments: [
        {
          name: 'Formulario de Aplicación (Forma 5629)',
          maxSize: 8
        },
        {
          name: 'Anejos',
          maxSize: 1
        }
      ]
    },
    {
      name: 'Formulario Hoja de Hogar',
      types: ['.pdf', '.jpeg', '.png'],
      maxSize: 10000,
      subDocuments: [
        {
          name: 'Formulario de Aplicación (Forma 5631)',
          maxSize: 4
        }
      ]
    },
    {
      name: 'Certificación de elegibilidad',
      types: ['.pdf', '.jpeg', '.png'],
      maxSize: 10000,
      subDocuments: []
    },
    {
      name: 'Evidencia de factura',
      types: ['.pdf', '.jpeg', '.png'],
      maxSize: 10000,
      subDocuments: [
        {
          name: 'Licencia de Conducir',
          maxSize: 1
        },
        {
          name: 'ID',
          maxSize: 1
        },
        {
          name: 'Factura de Luz/Agua/TV/Teléfono',
          maxSize: 1
        }
      ]
    },
    {
      name: 'Evidencia de Identidad',
      types: ['.pdf', '.jpeg', '.png'],
      maxSize: 10000,
      subDocuments: [
        {
          name: 'Certificado de Nacimiento',
          maxSize: 1
        },
        {
          name: 'Pasaporte',
          maxSize: 1
        },
        {
          name: 'Licencia de Conducir',
          maxSize: 1
        }
      ]
    },
    {
      name: 'Transferencia de Beneficio',
      types: ['.pdf', '.jpeg', '.png'],
      maxSize: 10000,
      subDocuments: [
        {
          name: 'Hoja de Transferencia de Beneficio',
          maxSize: 1
        }
      ]
    },
    {
      name: 'Otros',
      types: ['.pdf', '.jpeg', '.png'],
      maxSize: 10000,
      subDocuments: [
        {
          name: 'Otros',
          maxSize: 4
        }
      ]
    }
  ];

  public form: FormGroup;

  subDocumentTypeSelected: string;
  subDocumentTypeSelectedMaxSize: number;
  subDocumentErrorService: string;
  subDocumentsTypeSelected: string[] = [];

  requiredDocuments: string[] = [];
  requiredDocumentSelected: any;
  requiredDocumentsContent: RequiredDocumentContent[] = [];

  uploadHasError = false;
  uploadHasValidationError = false;
  documentName: string;
  documentNameErrorService: string;

  uploadHasValidationErrorSize: number;
  uploadHasValidationErrorTypes: string;

  dataAgencyMoneySelection: DataAgencyMoneySelection;

  certificacionIngresoDocuments: SubDocumentLifeline[] = [
    {
      name: 'Planilla',
      maxSize: 15
    },
    {
      name: 'Talonario de los últimos tres (3) meses consecutivos',
      maxSize: 15
    },
    {
      name: 'Declaración de Beneficio de Seguro Social',
      maxSize: 15
    },
    {
      name: 'Declaración Veteranos',
      maxSize: 15
    },
    {
      name: 'Declaración Retiro/Pensión',
      maxSize: 15
    },
    {
      name: 'Declaración Desempleo/Seguro del Estado',
      maxSize: 15
    },
    {
      name: 'Divorcio/Pensión Alimentaria',
      maxSize: 15
    },
    {
      name: 'Otros',
      maxSize: 15
    }
  ];

  certificacionProgramaDocuments: SubDocumentLifeline[] = [
    {
      name: 'Programa de Asistencia para Nutrición Suplementaria (SNAP) (Estampillas para Alimentos)',
      maxSize: 5
    },
    {
      name: 'Medicaid',
      maxSize: 5
    },
    {
      name: 'Asistencia Federal para la Vivienda Pública (FPHA)',
      maxSize: 5
    },
    {
      name: 'Beneficio de Pensión para Veteranos y Sobrevivientes',
      maxSize: 5
    }
  ];

  previewUrl: string;

  indexContent: number = null;
  indexDocumentName: number = null;
  indexFile: number = null;

  @ViewChild('inputFiles', { static: true }) inputFiles: ElementRef;
  private warningValidationCharge = false;

  constructor(
    public authenticationService: AuthenticationService,
    public usfServiceService: UsfServiceService,
    public router: Router,
    public fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    super(authenticationService, usfServiceService, router, fb);
    // this.requiredDocuments = this.usfServiceService.getValue('requiredDocuments');
    // PROD
    // this.requiredDocuments = ['112::Otros'];
    this.requiredDocuments = ['867::Otros'];
    this.parseRequiredDocumentsContent();

    this.subDocumentsTypeSelected.push('Seleccionar');

    // this.dataAgencyMoneySelection = this.usfServiceService.getValue('dataAgencyMoneySelection');

    // PROD :
    // this.documents[2].name =
    //   this.dataAgencyMoneySelection.agency === 'Seleccionar'
    //     ? 'Certificación (Ingreso)'
    //     : 'Certificación Programa (Agencia)';

    // this.documents[2].subDocuments =
    //   this.dataAgencyMoneySelection.agency === 'Seleccionar'
    //     ? this.certificacionIngresoDocuments
    //     : this.certificacionProgramaDocuments;
  }

  ngOnInit() {
    console.log();

    window.scroll(0, 0);

    this.form = this.fb.group({
      documentTypeSelected: [
        null,
        Validators.compose([
          // Validators.required
        ])
      ],
      subDocumentTypeSelected: [
        null,
        Validators.compose([
          // Validators.required
        ])
      ]
    });
  }

  goToAddressDate() {
    if (this.validateAllDocumentsChargued()) {
      this.router.navigate(['/universal-service/register-case'], { replaceUrl: true });
    }
  }

  goToAccountCreation() {
    if (this.validateAllDocumentsChargued()) {
      this.router.navigate(['/universal-service/account-creation'], { replaceUrl: true });
    }
  }

  continueChargeDocuments() {
    this.warningValidationCharge = true;
  }

  continueChargeDocumentsProcess() {
    this.warningValidationCharge = false;
    this.requiredDocumentsContent[this.indexContent].isContinue = true;
    this.previewView = false;
  }

  onChangeLifelineCustom(event: string) {
    this.uploadHasValidationError = false;

    if (event !== null) {
      console.log(event);
      this.indexContent = this.requiredDocumentsContent.map(x => x.id).indexOf(event);
      console.log(this.indexContent);
      this.indexDocumentName = this.documents
        .map(x => x.name)
        .indexOf(this.requiredDocumentsContent[this.indexContent].name);
      console.log(this.indexDocumentName);

      this.subDocumentsTypeSelected = ['Seleccionar'];
      this.subDocumentTypeSelected = 'Seleccionar';
      if (this.indexDocumentName !== -1) {
        console.log(this.documents[this.indexDocumentName].subDocuments);
        this.documents[this.indexDocumentName].subDocuments
          .map(x => x.name)
          .forEach(document => {
            this.subDocumentsTypeSelected.push(document);
          });
      }
    }
  }

  onFileChangeMultiple($event: Event) {
    this.subDocumentTypeSelectedMaxSize = undefined;
    this.uploadHasError = false;
    this.loadingDocs = true;
    this.uploadHasValidationError = false;
    // @ts-ignore
    this.documentName = $event.target.files[0].name;
    // @ts-ignore
    const fileExtention = $event.target.files[0].type.replace('application/', '.').replace('image/', '.');
    // @ts-ignore
    const size = $event.target.files[0].size / 1024;

    console.log(this.indexContent, this.indexDocumentName);
    console.log(this.documents[this.indexDocumentName].types, fileExtention);

    if (this.requiredDocumentsContent[this.indexContent].maxSize === null) {
      this.requiredDocumentsContent[this.indexContent].maxSize = this.documents[
        this.indexDocumentName
      ].subDocuments.find(x => x.name === this.subDocumentTypeSelected).maxSize;
    }

    if (
      this.documents[this.indexDocumentName].types.indexOf(fileExtention) !== -1 &&
      size <= this.documents[this.indexDocumentName].maxSize
    ) {
      const FR = new FileReader();
      const FR2 = new FileReader();

      FR.addEventListener('load', e => {
        // @ts-ignore
        const imageBase64 = e.target.result.split(';base64,')[1];

        const datos = {
          method: 'UpdloadDocumentMcapi',
          documentTypeID: this.requiredDocumentsContent[this.indexContent].id,
          user_Id: this.authenticationService.credentials.userid,
          case_number: this.validateSSNData.CASENUMBER,
          content: imageBase64,
          fileType: fileExtention
        };

        console.log(datos);

        this.usfServiceService.doAction(datos).subscribe(
          resp => {
            // this.usfServiceService.setValidateSSNData(resp.body);
            console.log(resp);

            if (!resp.body.HasError) {
              this.loadingDocs = false;
              this.requiredDocumentsContent[this.indexContent].fileIds.push(resp.body.data[0].documentID);
              this.requiredDocumentsContent[this.indexContent].isCharged = true;
              this.requiredDocumentsContent[this.indexContent].isPDF = fileExtention === '.pdf';
            } else {
              this.uploadHasError = true;
              this.loadingDocs = false;
              alertify.alert('Aviso', resp.body.ErrorDesc, () => {
                console.log(this.requiredDocumentsContent);
              });
            }

            // @ts-ignore
            $event.target.value = '';

            this.documentNameErrorService = this.documents[this.indexDocumentName].name;
            this.subDocumentErrorService = this.subDocumentTypeSelected;

            this.indexContent = 0;
            this.requiredDocumentSelected = this.requiredDocumentsContent[this.indexContent].id;
            this.subDocumentsTypeSelected = ['Seleccionar'];
            this.subDocumentTypeSelected = 'Seleccionar';
          },
          error => {
            console.log(error);
            // this.uploadHasError = true;
            this.loadingDocs = false;

            // @ts-ignore
            $event.target.value = '';

            this.indexContent = 0;
            this.requiredDocumentSelected = this.requiredDocumentsContent[this.indexContent].id;
            this.subDocumentsTypeSelected = ['Seleccionar'];
            this.subDocumentTypeSelected = 'Seleccionar';

            alertify.alert('Aviso', error.error.ErrorDesc, () => {
              console.log(this.requiredDocumentsContent);
            });
          }
        );
      });

      FR2.addEventListener('load', e => {
        if (fileExtention === '.pdf') {
          // @ts-ignore
          const count = FR2.result.match(/\/Type[\s]*\/Page[^s]/g).length;
          console.log('Number of Pages:', count);

          if (count <= this.requiredDocumentsContent[this.indexContent].maxSize) {
            // @ts-ignore
            FR.readAsDataURL($event.target.files[0]);
          } else {
            this.loadingDocs = false;
            this.documentName = this.documents[this.indexDocumentName].name;
            this.uploadHasValidationError = true;
            this.uploadHasValidationErrorSize = this.documents[this.indexDocumentName].maxSize;
            this.uploadHasValidationErrorTypes = this.documents[this.indexDocumentName].types.join(', ');
            this.subDocumentTypeSelectedMaxSize = this.requiredDocumentsContent[this.indexContent].maxSize;
          }
        } else {
          // @ts-ignore
          FR.readAsDataURL($event.target.files[0]);
        }
      });
      // @ts-ignore
      FR2.readAsBinaryString($event.target.files[0]);
    } else {
      this.loadingDocs = false;
      this.documentName = this.documents[this.indexDocumentName].name;
      this.uploadHasValidationError = true;
      this.uploadHasValidationErrorSize = this.documents[this.indexDocumentName].maxSize;
      this.uploadHasValidationErrorTypes = this.documents[this.indexDocumentName].types.join(', ');
    }
  }

  parseRequiredDocumentsContent() {
    this.requiredDocumentsContent.push({
      id: null,
      name: 'Seleccionar',
      isCharged: true,
      idToSearch: null,
      isContinue: false,
      fileIds: [],
      isPDF: false,
      maxSize: null
    });

    // DEV:
    // name:
    //           requiredDocument.split('::')[1] === 'Certificación de programa'
    //             ? 'Certificación de elegibilidad'
    //             : requiredDocument.split('::')[1],
    // PROD:
    // name: requiredDocument.split('::')[1],

    this.requiredDocuments.forEach(requiredDocument => {
      this.requiredDocumentsContent.push({
        id: requiredDocument.split('::')[0],
        name:
          requiredDocument.split('::')[1] === 'Certificación de programa'
            ? 'Certificación de elegibilidad'
            : requiredDocument.split('::')[1],
        isCharged: false,
        idToSearch: null,
        isContinue: false,
        fileIds: [],
        isPDF: false,
        maxSize: null
      });
    });

    this.indexContent = 0;
    this.requiredDocumentSelected = this.requiredDocumentsContent[0].id;
  }

  // tslint:disable-next-line: member-ordering
  validateDocumentCharged() {
    return (
      !this.requiredDocumentsContent[this.indexContent].isCharged && this.subDocumentTypeSelected !== 'Seleccionar'
    );
  }

  showPreviewFileMultiple(index: number, fileNumber: number) {
    this.indexContent = index;
    this.indexFile = fileNumber;
    console.log('showPreviewFile: ', this.requiredDocumentsContent[index].fileIds[fileNumber]);

    this.previewView = true;
    this.previewUrl =
      'assets/previewDocument.html?docid=' +
      this.requiredDocumentsContent[index].fileIds[fileNumber] +
      '&clienttype=html&username=' +
      constants.ONBASE_USERNAME +
      '&password=' +
      constants.ONBASE_PASSWORD;
  }

  validateAllDocumentsChargued() {
    console.log(this.requiredDocumentsContent.filter(x => x.name !== 'Otros').every(item => item.isCharged));
    console.log(this.requiredDocumentsContent.filter(x => x.name !== 'Otros'));
    return this.requiredDocumentsContent.filter(x => x.name !== 'Otros').every(item => item.isCharged);
  }

  getSecureUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getHeightModal() {
    return window.innerHeight - window.innerHeight * 0.27 + 'px';
  }

  callDeleteSubDocumentMultiple(): Observable<any> {
    const datos = {
      method: 'DeleteDocumentMcapi',
      documentTypeID: this.requiredDocumentsContent[this.indexContent].fileIds[this.indexFile],
      documentTypeUsf: this.requiredDocumentsContent[this.indexContent].id,
      user_Id: this.authenticationService.credentials.userid,
      case_number: this.validateSSNData.CASENUMBER
    };

    console.log(datos);

    return this.usfServiceService.doAction(datos);
  }

  deleteSubDocumentMultiple() {
    this.callDeleteSubDocumentMultiple().subscribe(
      resp => {
        console.log(resp);

        this.requiredDocumentsContent[this.indexContent].fileIds.splice(this.indexFile, 1);

        if (this.requiredDocumentsContent[this.indexContent].fileIds.length === 0) {
          this.requiredDocumentsContent[this.indexContent].isCharged = false;
        }

        this.indexContent = 0;
        this.requiredDocumentSelected = this.requiredDocumentsContent[this.indexContent].id;
        this.subDocumentsTypeSelected = ['Seleccionar'];
        this.subDocumentTypeSelected = 'Seleccionar';

        this.previewView = false;
      },
      error => {
        console.log(error);
      }
    );
  }

  reUploadDocument() {
    this.callDeleteSubDocumentMultiple().subscribe(
      resp => {
        console.log(resp);

        this.requiredDocumentsContent[this.indexContent].fileIds = this.requiredDocumentsContent[
          this.indexContent
        ].fileIds.splice(this.indexFile + 1, 1);

        if (this.requiredDocumentsContent[this.indexContent].fileIds.length === 0) {
          this.requiredDocumentsContent[this.indexContent].isCharged = false;
        }

        const el: HTMLElement = this.inputFiles.nativeElement as HTMLElement;
        el.click();

        this.previewView = false;
      },
      error => {
        console.log(error);
      }
    );
  }

  uploadOtherDocument() {
    const el: HTMLElement = this.inputFiles.nativeElement as HTMLElement;
    el.click();
    this.previewView = false;
  }
}
