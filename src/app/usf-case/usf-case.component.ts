import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { UsfServiceService } from '@app/core/usf/usf-service.service';
import { BaseComponent } from '@app/core/base/BaseComponent';
import { exportDefaultSpecifier, isGenerated } from 'babel-types';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { constants } from '@env/constants';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
declare let $: any;

@Component({
  selector: 'app-usf-case',
  templateUrl: './usf-case.component.html',
  styleUrls: ['./usf-case.component.scss']
})
export class UsfCaseComponent extends BaseComponent implements OnInit {
  public status: any = ['PENDIENTE', 'DENEGADO', 'EN PROCESO', 'APROBADO'];
  public statusSelected = '';
  public nameToSearch: String = '';
  public numberUSF: String = '';
  public loadingRequest = false;
  public date_range: any = null;
  public data_conten: any = [];

  public mostrar: any[];
  public beforePage: number;
  public currentPage = 1;
  public afterPage: number;
  public mostrada: number;
  public total_paginas: number;
  public sobrante: number;

  public slectedfirst: boolean;
  public slectedNext: boolean;
  public slectedlast: boolean;

  public totalRowCount = 0;

  public paginationBox = {
    currentPage: 1,
    itemsPerPage: 10
  };
  caseDetail: any = undefined;
  caseDetail2: any = undefined;
  negateDescription: any = null;
  casiIdSaved: any = null;

  constructor(
    private http: HttpClient,
    public authenticationService: AuthenticationService,
    public usfServiceService: UsfServiceService,
    public router: Router,
    public fb: FormBuilder
  ) {
    super(authenticationService, usfServiceService, router, fb);
  }

  ngOnInit() {
    this.slectedfirst = true;
    this.slectedNext = false;
    this.slectedlast = false;
    let mes = (new Date().getMonth() + 1).toString();
    if (new Date().getMonth() + 1 < 10) {
      mes = '0' + mes;
    }
    this.date_range = {
      start: new Date().getFullYear() + '-01-01',
      end: new Date().getFullYear() + '-' + mes + '-' + new Date().getDate()
    };
    if (localStorage.getItem('numberCaseToSearch') !== null) {
      this.numberUSF = localStorage.getItem('numberCaseToSearch');
      this.loadingRequest = true;
      this.getCasesUSF();
    }
    let self = this;
    function searchCases() {
      console.log('searchCases', self.date_range);
      self.getCasesUSF();
    }

    $(function() {
      // tslint:disable: prefer-const
      let start = moment().subtract(29, 'days');
      let end = moment();

      // tslint:disable-next-line: no-shadowed-variable
      function cb(start: any, end: any) {
        $('#rangedate').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
      }

      $('#rangedate').daterangepicker(
        {
          icon: 'ui-icon-triangle-1-s',
          initialText: 'Enero 01, 2018 - Enero 23 2018',
          datepickerOptions: {
            numberOfMonths: 2
          },
          startDate: start,
          endDate: end,
          ranges: {
            Today: [moment(), moment()],
            Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [
              moment()
                .subtract(1, 'month')
                .startOf('month'),
              moment()
                .subtract(1, 'month')
                .endOf('month')
            ]
          },
          change: function(event: any, data: any) {
            this.loadingRequest = true;
            this.date_range = JSON.parse($('#rangedate').val());
            self.date_range = this.date_range;
            searchCases();
          }
        },
        cb
      );

      $('#rangedate').on('cancel.daterangepicker', function(ev: any, picker: any) {
        // cuando se aplica un cambio de Fecha
        console.log(ev, picker);
      });
      cb(start, end);
    });
    // Limpiando Tabla
    document.querySelectorAll('.tablecols').forEach((iten: any) => {
      console.log(iten);
      iten.remove();
    });
  }
  validaEnter(evt: any) {
    if (evt.keyCode === 13) {
      // si pisa enter
      this.getCasesUSF();
    }
  }
  goToHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }
  isEmpty() {
    return this.nameToSearch.trim().length;
  }

  FilterByNroUsf() {}

  validacionOcultarRow(iten: any) {
    if (this.numberUSF.trim() !== '' && (String(iten.caseID) === String(this.numberUSF.trim()) || String(iten.applicationId) === String(this.numberUSF.trim()))) {
      return false;
    } else if (this.numberUSF.trim() !== '' && (String(iten.caseID) !== String(this.numberUSF.trim()) || String(iten.applicationId) !== String(this.numberUSF.trim()))) {
      return true;
    } else  if (this.statusSelected === '' && this.isEmpty() === 0) {
      return false;
    } else if (this.statusSelected !== '' && this.isEmpty() === 0 && this.statusSelected !== iten.status) {
      return true;
    } else if (this.statusSelected !== '' && this.isEmpty() === 0 && this.statusSelected === iten.status) {
      return false;
    } else if (
      this.statusSelected !== '' &&
      this.statusSelected === iten.status &&
      this.isEmpty() !== 0 &&
      iten.fullName
        .toString()
        .toLocaleLowerCase()
        .includes(this.nameToSearch.toString().toLocaleLowerCase())
    ) {
      return false;
    } else {
      if (
        this.isEmpty() !== 0 &&
        iten.fullName
          .toString()
          .toLocaleLowerCase()
          .includes(this.nameToSearch.toString().toLocaleLowerCase())
      ) {
        return false;
      } else {
        return true;
      }
    }
  }

  exportTo() {
    let dataArray: any = [['Nro de USF', 'BAN', 'Fecha Registro de USF', ' Nombre y Apellido Cliente', 'Estatus']];
    this.data_conten.forEach((caso: any) => {
      dataArray.push([caso.caseID, caso.ban, caso.date, caso.fullName, caso.status]);
    });

    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dataArray);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    // XLSX.writeFile(wb, 'CasesUSF.xlsx');

    // TEST
    // The exported read and readFile functions accept an options argument:
    // {password: '123', WTF: true}
    /**/
    XLSX.readFile(XLSX.writeFile(wb, 'CasesUSF.xlsx'), { password: '123', WTF: true });
  }

  getCasesUSF() {

    this.loadingRequest = true;
    const data = {
      method: 'getCasesWithFiltersMcapi',
      DateFrom: this.date_range.start,
      DateTo: this.date_range.end,
      pageNo: this.paginationBox.currentPage,
      pageSize: this.paginationBox.itemsPerPage,
      caseID: /^([0-9])*$/.test(this.numberUSF.toString()) ? this.numberUSF : '',
      Status: this.statusSelected,
      userID: this.authenticationService.credentials.userid,
      applicationId: /^([0-9])*$/.test(this.numberUSF.toString()) ? '' : this.numberUSF
  };
    //    this.http.post<any>(constants.URL_CASES, data, { observe: 'response' }).subscribe((dt: any) => {
    return this.usfServiceService.doAction(data).subscribe((dt: any) => {
      if (!dt.HasError) {
        this.data_conten = [];
        this.mostrar = [];
        this.totalRowCount = dt.body.totalRowCount;
        this.mostrada = 10;

        console.log('cantidad de intem que trae la base de datos: ' + this.totalRowCount);
        this.total_paginas = Math.trunc(this.totalRowCount / 10);
        this.sobrante = this.totalRowCount % 10;
        if (this.sobrante !== 0) {
          this.total_paginas = this.total_paginas + 1;
        }
        console.log('total paginas ' + this.total_paginas);

        if (this.totalRowCount !== 0 && this.totalRowCount > 10 && dt.body.customercases.length <= 10) {
          this.paginationBox.itemsPerPage = this.total_paginas * 10;

          this.getCasesUSF();
        } else {
          dt.body.customercases.forEach((caso: any) => {
            let date_temp = new Date(caso.DTS_CREATED);
            let dd: number = date_temp.getDate();
            let ddTxt = '';
            let mm: number = date_temp.getMonth() + 1;
            let mmTxt = '';

            if (dd < 10) {
              ddTxt = '0' + dd.toString();
              console.log(ddTxt);
            } else {
              ddTxt = dd.toString();
            }

            if (mm < 10) {
              mmTxt = '0' + mm.toString();
            } else {
              mmTxt = mm.toString();
            }

            this.data_conten.push({
              caseID: caso.USF_CASEID,
              ban: caso.ACCOUNT_NUMBER,
              date: mmTxt + '/' + ddTxt + '/' + date_temp.getFullYear(),
              fullName: caso.CUSTOMER_NAME + ' ' + caso.CUSTOMER_LAST,
              status: caso.CASE_STATUS,
              applicationId: caso.applicationId,
              eligibilityExpirationDate: caso.eligibilityExpirationDate
            });
          });
          this.firstPage();
          this.getPage(1);
          this.loadingRequest = false;
        }
      }
    });
  }

  // funciones de paginado
  nextPage() {
    if (this.totalRowCount > 10) {
      if (this.currentPage < this.total_paginas - 3) {
        this.currentPage = this.currentPage + 3;
        console.log('esta avanzando');
        this.getPage(1);
      } else {
        //alert('ya estas es la ultima pagina y no se puede avanzar');
      }
    }
  }

  previusPage() {
    if (this.currentPage > 2) {
      console.log('esta retrocediendo');
      this.currentPage = this.currentPage - 3;
      this.getPage(1);
    } else {
      this.currentPage = 1;
      // alert('ya estas es la primera pagina y no se puede retroceder');
    }
  }
  firstPage() {
    console.log('esta redireccionando a la aprimera pagina');
    this.currentPage = 1;
    this.getPage(1);
  }

  lastPage() {
    if (this.totalRowCount > 10) {
      console.log('esta redireccionando a la ultima pagina');
      this.currentPage = this.total_paginas - 2;
      this.getPage(1);
    }
  }

  getPage(x: number) {
    //array auxiliar:
    this.mostrar = [];
    //parametro de entrada de la funcion
    let param = x - 1;
    //objeto con variables de control de paginado
    let pages = {
      b: 0,
      item_final: 0,
      item_inicial: 0,
      mostrar: [1, 2] // cualquier cosa despues de cambia
    };

    pages.b = this.currentPage;
    pages.b = pages.b + param;
    pages.item_final = pages.b * 10;
    pages.item_inicial = pages.item_final - 9;

    // para el pie de la tabla:

    console.log('se esta redirigiendo a la pagina: ' + pages.b);
    console.log('se primer item: ' + pages.item_inicial);
    console.log('se ultimo item: ' + pages.item_final);
    let cont = 0;
    let bar = [];
    for (let i = pages.item_inicial - 1, l = pages.item_final; i < l; i++) {
      if (this.data_conten[i]) {
        this.mostrar[cont] = this.data_conten[i];
      }
      cont = cont + 1;
    }

    if (this.mostrar.length == 10) {
      this.mostrada = pages.item_final;
    } else {
      this.mostrada = pages.item_final - (10 - this.mostrar.length);
    }

    console.log(this.mostrar);
    //estilo dinamico:
    switch (x) {
      case 1:
        this.slectedfirst = true;
        this.slectedNext = false;
        this.slectedlast = false;
        break;
      case 2:
        this.slectedfirst = false;
        this.slectedNext = true;
        this.slectedlast = false;
        break;
      default:
        this.slectedfirst = false;
        this.slectedNext = false;
        this.slectedlast = true;
        break;
    }

    return pages;
  }

  showDetails(caseID: any) {
    this.casiIdSaved = null;
    this.negateDescription = null;
    const data = {
      method: 'getCasesModifyBackendId',
      caseID: caseID,
      UserID: this.authenticationService.credentials.userid
    };
    this.usfServiceService.doAction(data).subscribe((resp: any) => {
      console.log(resp.body.dataBacken);
      if (resp.body.dataBacken.length > 0) {
        this.caseDetail = resp.body.dataBacken[0];
        this.caseDetail2 = resp.body.dataBacken[0];
      }

      const data2 = {
        method: 'getCasesdeniedMcapi',
        caseID: caseID,
        // caseID: 1399,
        UserID: this.authenticationService.credentials.userid
        // UserID: 99
      };
      this.usfServiceService.doAction(data2).subscribe((resp2: any) => {
        console.log(resp2.body);
        if (resp2.body.data.length !== 0) {
          // @ts-ignore
          this.negateDescription = resp2.body.data.map(x => x.DENIED_DESCRIPCION).join(', ');
        }
      });

      const data3 = {
        method: 'eligibilitycheckStatusMcapi',
        eligibilityCheckId: this.caseDetail.eligibilityCheckId,
        repId: ''
      };
      this.usfServiceService.doAction(data3).subscribe((resp3: any) => {
        console.log(resp3.body);
        if (resp3.body.activeSubscriber === 'N' && resp3.body.status === 'COMPLETE') {
          this.casiIdSaved = caseID;
        }
      });
    });
  }

  continueToCase() {
    let dataObjectAddress = [];
    dataObjectAddress.push({
      CUSTOMERNAME: this.caseDetail.CUSTOMER_NAME,
      CUSTOMERLASTNAME: this.caseDetail.CUSTOMER_LAST,
      CUSTOMERADDRESS: this.caseDetail.ADDRESS_1 + ' ' +
                      this.caseDetail.ADDRESS_2 + ' ' +
                      this.caseDetail.CITY + ' ' +
                      this.caseDetail.STATE + ' ' +
                      this.caseDetail.ZIPCODE,
      SUGGESTADDRESS: this.caseDetail2.ADDRESS_1 + ' ' +
                      this.caseDetail2.ADDRESS_2 + ' ' +
                      this.caseDetail2.CITY + ' ' +
                      this.caseDetail2.STATE + ' ' +
                      this.caseDetail2.ZIPCODE,
      SSN: this.caseDetail.CUSTOMER_SSN,
      contactNumber1: this.caseDetail.PHONE_1,
      contactNumber2: this.caseDetail2.PHONE_1
    });


    sessionStorage.setItem('validateSSNData', '{"CASENUMBER":' + this.casiIdSaved + '}');
    sessionStorage.setItem('ssn', this.caseDetail.CUSTOMER_SSNMAX);
    sessionStorage.setItem('dataObjectAddress', JSON.stringify(dataObjectAddress));
    this.router.navigate(['/universal-service/document-digitalization'], { replaceUrl: true }).then();
  }
}
