import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { UsfServiceService } from '@app/core/usf/usf-service.service';
import { BaseComponent } from '@app/core/base/BaseComponent';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

declare let $: any;

export interface Model {
  birthday: string;
  idExpirationDate: string;
}

@Component({
  selector: 'app-personal-dates',
  templateUrl: './personal-dates.component.html',
  styleUrls: ['./personal-dates.component.scss']
})
export class PersonalDatesComponent extends BaseComponent implements OnInit {
  checkSSN = false;
  valueSSN = '';
  processValidationSIF = false;
  valueBirthday = '';
  valueExpirationDate = '';
  datePicker_is_init = false;
  inputControl = '';
  inputControl2 = '';
  subscriberVerificationObject: any = null;
  dataReady = false;
  dealer: number;
  loaded = false
  @ViewChild('birthdayDemo') birthdayDemoS: ElementRef;
  birthdayDemoModel = '';
  birthdaFlag = false;
  back = false;

  public sufixes = ['MR.', 'MRS.', 'ENG.', 'ATTY.', 'DR.'];
  public idTypes = ['Licencia de Conducir', 'Pasaporte'];
  public dependPeopleFlag: FormControl = new FormControl(false, Validators.minLength(2));
  model: Model = new (class implements Model {
    birthday = '';
    idExpirationDate = '';
  })();
  optionsModel: number[];

  dataAgency: any[] = null;
  asistence = true;
  repID: string = '';
  sufix = "";
  firstName="";
  secondName="";
  lastName="";
  socialSecure=""
  gender: boolean = undefined;
  idType=""
  idNumber=""
  public strListAgent: any[] = [];
  public checkListAgency : any[] =[]

  constructor(
    public authenticationService: AuthenticationService,
    public usfServiceService: UsfServiceService,
    public router: Router,
    public fb: FormBuilder
  ) {
    super(authenticationService, usfServiceService, router, fb);
    this.dealer = this.authenticationService.credentials.Dealer;
    this.subscriberVerificationObject = this.usfServiceService.getValue('subscriberVerificationObject');
    console.log(this.subscriberVerificationObject);
    }

  async ngOnInit() {
    window.scroll(0, 0);
    let datos = JSON.parse(localStorage.getItem('personalData'));
    this.dataAgency = this.usfServiceService.getValue('agencies');

    if(datos !== null){
      let agency = datos.strListAgent.split(",");
      for (let i = 0; i < this.dataAgency.length; i++) {
        let checked = false;
        for(let j = 0; j < agency.length; j++){
          if(agency[j]=== this.dataAgency[i].cod_id){
            checked = true;
          }
        }
        const a =  Object.defineProperty(this.dataAgency[i], 'checked', {
        value: checked,
        configurable: true
        });
        this.checkListAgency.push(a);
      }

      console.log(datos);
      this.asistence = datos.asistence;
      this.repID = datos.repId;
      this.sufix = datos.CUSTOMER_SUFFIX;
      this.firstName = datos.CUSTOMER_NAME;
      this.secondName = datos.CUSTOMER_MN;
      this.lastName = datos.CUSTOMER_LAST;
      this.socialSecure = 'XXX-XX-' + String(datos.CUSTOMER_SSN).substr(-4, 4);
      this.valueSSN = datos.CUSTOMER_SSN;
      this.checkSSN = true;

      this.gender = datos.GENDER === 1 ? true:false;
      this.idType = datos.CUSTOMER_ID_TYPE === 0 ? this.idTypes[1] : this.idTypes[0];
      this.idNumber = datos.ID_NUMBER;

      this.inputControl = datos.CUSTOMER_DOB;
      this.valueBirthday = this.inputControl;
      this.model.birthday = this.inputControl;

      this.inputControl2 = datos.DTS_EXP;
      this.model.idExpirationDate = this.inputControl2;
      this.valueExpirationDate = this.inputControl2;

      console.log('Agencias', datos.strListAgent.split(','));
      console.log('real', this.checkListAgency);
    } else {
      for (let i = 0; i < this.dataAgency.length; i++) {
        const a =  Object.defineProperty(this.dataAgency[i], 'checked', {
        value: false,
        configurable: true
        });
        this.checkListAgency.push(a);
     }
    }
      this.form = this.fb.group({
      sufix: ['', Validators.compose([Validators.required])],
      firstName: ['', Validators.compose([Validators.required])],
      secondName: ['', Validators.compose([])],
      lastName: ['', Validators.compose([Validators.required])],
      socialSecure: ['', Validators.compose([Validators.required])],
      birthday: [null, Validators.compose([Validators.required])],
      gender: [null, Validators.compose([Validators.required])],
      idType: ['', Validators.compose([Validators.required])],
      idNumber: ['', Validators.compose([Validators.required])],
      idExpirationDate: [null, Validators.compose([Validators.required])],
      liveWithAnoterAdult: [null, Validators.compose([])],
      hasLifelineTheAdult: [null, Validators.compose([])],
      sharedMoneyWithTheAdult: [null, Validators.compose([])],
      asistence: [null, Validators.compose([Validators.required])],
    });

  }
  onChangeOpt() {
    console.log(this.optionsModel);
  }
  inFormat(cadena_fecha: string) {
    const temp_str = cadena_fecha.replace('/', '');
    const temp_str2 = temp_str.replace('/', '');
    console.log(temp_str2);
    return {
      year: temp_str2.substr(4, 4),
      day: temp_str2.substr(2, 2),
      month: temp_str2.substr(0, 2)
    };
  }

  goToSocialSecureVerification() {
    if (
      this.validateForm()
      // true
      ) {
      console.log(this.model);
      const datos = {
        method: 'validareSSNAdMcapi',
        CUSTOMER_SUFFIX: this.form.get('sufix').value,
        USER_ID: this.authenticationService.credentials.userid.toString(),
        CUSTOMER_NAME: this.form.get('firstName').value,
        CUSTOMER_MN: this.form.get('secondName').value,
        CUSTOMER_LAST: this.form.get('lastName').value,
        CUSTOMER_SSN: this.valueSSN
          .replace('-', '')
          .replace('-', '')
          .replace('-', ''),
        CUSTOMER_DOB: this.moment(this.valueBirthday).format('YYYY-MM-DD'),
        GENDER: this.form.get('gender').value ? '1' : '0',
        CUSTOMER_ID_TYPE: this.form.get('idType').value === 'Pasaporte' ? '0' : '1',
        ID_NUMBER: this.form.get('idNumber').value,
        DTS_EXP: this.moment(this.valueExpirationDate).format('YYYY-MM-DD'),
        DealerFl: this.dealer,
        strListAgent: this.strListAgent.toString(),
        strEliAsited: this.form.get('asistence').value ? '1' : '0',
        repId: this.repID,
        asistence: this.asistence,
      };

      console.log(datos); localStorage.setItem('personalData', JSON.stringify(datos))
      localStorage.setItem('valueSSN', this.valueSSN)
      // localStorage.setItem('SSN', );
      // this.form.get('birthday').setValue('02/02/2019');

      this.usfServiceService.doAction(datos).subscribe(resp => {
        this.processValidationSIF = false;
        this.usfServiceService.setValue('validateSSNData', resp.body);
        console.log(resp);

        if (!resp.body.HasError) {
          // Limpiando en caso satisfactorio
          localStorage.setItem('existSSNCase', null);
          localStorage.setItem('existSSNCaseName', null);
          localStorage.setItem('existSSNCaseNumber', null);
          localStorage.setItem('existSSNCaseSSN', null);
          localStorage.setItem('existSSNCasePhone', null);
          localStorage.setItem('existSSNCaseAddress', null);
          localStorage.setItem('existSSNCaseBan', null);
          localStorage.setItem('lifelineActivationDate', null);
          localStorage.setItem('accountType', null);

          this.usfServiceService.setValue('ssn', this.valueSSN.replace('-', '').replace('-', ''));

          if (this.usfServiceService.getValue('validateSSNData').CASENUMBER !== 0) {
            if (this.dependPeopleFlag.value) {
              this.router.navigate(['/universal-service/usf-verification'], { replaceUrl: true }).then();
            } else {
              localStorage.setItem('personalData', null);
              localStorage.setItem('valueSSN', null)
              this.router.navigate(['/universal-service/address-date'], { replaceUrl: true }).then();
            }
          } else {
            this.alertify.alert(
              'Aviso',
              'Hemos detectado un error en la creación del caso. Su caso fue eliminado.',
              () => {
                this.goTo('/home');
              }
            );
          }
        } else {
          if (resp.body.dataObject.length > 0) {
            // cuando viene en dataObject
            // es que NO se Registro completamente
            localStorage.setItem('existSSNCase', 'incomplete');
            localStorage.setItem('existSSNCaseName', resp.body.dataObject[0].name);
            localStorage.setItem('existSSNCaseNumber', resp.body.dataObject[0].CASENUMBER);
            localStorage.setItem('existSSNCaseSSN', resp.body.dataObject[0].ssn);
            localStorage.setItem('existSSNCasePhone', resp.body.dataObject[0].phone1);
            localStorage.setItem('existSSNCaseAddress', resp.body.dataObject[0].address);
            localStorage.setItem('existSSNCaseBan', resp.body.dataObject[0].ban);
            localStorage.setItem('accountType', resp.body.dataObject[0].accountType);
            localStorage.setItem('lifelineActivationDate', resp.body.dataObject[0].efectivedate);
          } else {
            // en data es que SI se Registro completamente
            localStorage.setItem('existSSNCase', null);
            localStorage.setItem('existSSNCase', resp.body.data[0]);
            localStorage.setItem('existSSNCaseName', resp.body.data[0].name);
            localStorage.setItem('existSSNCaseNumber', resp.body.data[0].CASENUMBER);
            localStorage.setItem('existSSNCaseSSN', resp.body.data[0].ssn);
            localStorage.setItem('existSSNCasePhone', resp.body.data[0].subscriberNumber);
            localStorage.setItem('existSSNCaseAddress', resp.body.data[0].address);
            localStorage.setItem('existSSNCaseBan', resp.body.data[0].ban);
            localStorage.setItem('lifelineActivationDate', resp.body.data[0].lifelineActivationDate);
            localStorage.setItem('accountType', resp.body.data[0].accountType);
          }
          this.router.navigate(['/universal-service/social-secure-verification'], { replaceUrl: true });
        }
      });
    }
  }

  public setFormatInputSSN() {
    this.form.get('socialSecure').setValue(this.formatInput());
  }

  public formatInput() {
    const input: string = this.form.get('socialSecure').value;
    if (this.validateRightSSN()) {
      this.valueSSN = input.replace(/-/g, '');
      this.valueSSN =
        String(this.valueSSN).substr(0, 3) +
        '-' +
        String(this.valueSSN).substr(3, 2) +
        '-' +
        String(this.valueSSN).substr(5, 4);
      this.checkSSN = true;
      return this.valueSSN;
    }

    if (input.length > 1 && String(input).substr(input.length - 1, 1) !== 'X') {
      this.valueSSN += String(input.substr(input.length - 1, 1));
    } else if (input !== 'X' && input !== 'XXX-XX-XXXX') {
      this.valueSSN = input;
    }

    if (input.length === 4 || input.length === 7) {
      return (
        input.substr(0, input.length - 1) +
        (input[input.length - 1] === '-' ? '' : '-') +
        input.substr(input.length - 1, input.length)
      );
    } else {
      return input;
    }
  }

  public activarDatepickerFechaN() {
    if (this.datePicker_is_init === false) {
      // tslint:disable-next-line:prefer-const
      let dia = String(new Date().getDate());
      // tslint:disable-next-line:radix
      if (parseInt(dia) < 10) {
        dia = '0' + dia;
      }
      // tslint:disable-next-line:prefer-const
      let mes = String(new Date().getMonth());
      // tslint:disable-next-line:radix
      if (parseInt(mes) < 10) {
        mes = '0' + mes;
      }
      const fecha_ = {
        d: String(dia),
        m: String(mes),
        y: String(new Date().getFullYear() - 21)
      };

      $('#inputControl')
        .datepicker({
          dateFormat: 'mm/dd/yy',
          changeMonth: true,
          changeYear: true,
          yearRange: '-100:-21',
          maxDate: '-21y',
          minDate: '-100y',
          defaultDate: '-22y',
          onSelect: (dateText: any) => {
            this.inputControl = dateText;
            console.log(dateText + ' *onSelect');
          },
          onChangeMonthYear: function(year: any, month: any, datepicker: any) {
            // #CAMBIO APLICADO y Necesario ya que al seleccionar el mes y cambiar el a#o en los selects
            // # no Cambiaba el valor del input  Ahora si se esta aplocando el cambio
            console.log('onChangeMonthYear');
            if ($('#inputControl').val().length === 10) {
              console.log('to :' + month + ' ' + $('#inputControl').val().sub + ' ' + year);

              const new_date = new Date(
                month +
                  '/' +
                  $('#inputControl')
                    .val()
                    .substr(3, 2) +
                  '/' +
                  year
              );

              $('#inputControl').datepicker('setDate', new_date);
            }
          }
        })
        .on('change', function(evtChange: any) {
          console.log(evtChange);
          console.log('Change event');
        });

      $('#inputControl2').datepicker({
        dateFormat: 'mm/dd/yy',
        changeMonth: true,
        changeYear: true,
        yearRange: '+0:+10',
        minDate: 0,
        defaultDate: '+1y',
        onSelect: (dateText: any) => {
          this.inputControl2 = dateText;
          console.log(dateText + ' *onSelect');
        }
      });
    }
    $('#inputControl').datepicker('show');
  }

  public activarDatepickerFechaE() {
    if (this.datePicker_is_init === false) {
      $('#inputControl').datepicker({
        dateFormat: 'mm/dd/yy',
        changeMonth: true,
        changeYear: true,
        yearRange: '-100:-21',
        maxDate: '-21y',
        minDate: '-100y',
        defaultDate: '-22y'
      });
      $('#inputControl2').datepicker({
        dateFormat: 'mm/dd/yy',
        changeMonth: true,
        changeYear: true,
        yearRange: '+0:+10',
        minDate: 0,
        defaultDate: '+1y'
      });
      this.datePicker_is_init = true;
    }
    $('#inputControl2').datepicker('show');
  }

  public formateadorFecha(entrada: string) {
    // NO se aceptara mas de 10 caracteres
    if (entrada.length > 10) {
      entrada = entrada.substr(0, 10);
    }
    // Limpiando especificando caracteres permitidos
    const patron = /abcdefghijklmnopqrstuvwxyz/gi;
    const nuevoValor = '';
    entrada = entrada.replace(patron, nuevoValor);

    if (entrada.length > 2 && entrada.indexOf('/') !== 2) {
      entrada = entrada.replace('/', '');
      entrada = entrada.substr(0, 2) + '/' + entrada.substr(2, entrada.length);
    }

    if (entrada.length > 5 && entrada.indexOf('/', 5) !== 5) {
      // caso para el 2do Slash
      entrada = entrada.substr(0, 5) + '/' + entrada.substr(5, 4);
    }
    if (entrada.length >= 10) {
      console.log(this.inFormat(entrada));
    }
    return entrada;
  }

  public ic_blur() {
    setTimeout(() => {
      const inputValue: string = this.inputControl;
      // tslint:disable-next-line:radix
      const year: number = parseInt(inputValue.substr(-4, 4));
      // tslint:disable-next-line:radix
      if (year > new Date(new Date().setFullYear(new Date().getFullYear() - 21)).getFullYear()) {
        console.log(
          'y:' + year + ' c: ' + new Date(new Date().setFullYear(new Date().getFullYear() - 21)).getFullYear()
        );
        this.valueBirthday = '';
        this.model.birthday = '';
        this.inputControl = '';
      } else {
        this.valueBirthday = inputValue;
        this.model.birthday = inputValue;
        this.inputControl = inputValue;
      }
      console.log('#blur :' + inputValue);

      // tslint:disable-next-line:prefer-const
      let dp1 = document.getElementsByClassName('ui-datepicker-year')[0] as HTMLSelectElement;
      if (dp1 !== undefined && this.datePicker_is_init === false) {
        for (let c = 0; c < dp1.options.length; c++) {
          dp1.options.remove(1);
        }
        document.getElementsByClassName('ui-datepicker-year')[0].innerHTML = '';
        for (let c = new Date().getFullYear() - 21; c > new Date().getFullYear() - 100; c--) {
          const opt = document.createElement('option');
          opt.value = '' + c;
          opt.innerHTML = '' + c;
          dp1.options.add(opt);
        }

        // Test despues de iniciado
        this.datePicker_is_init = true;
      }
      // tslint:disable-next-line:prefer-const
      let selector_mes = document.getElementsByClassName('ui-datepicker-month')[0] as HTMLSelectElement;
      if (selector_mes != undefined) {
        // tslint:disable-next-line:typedef
        selector_mes.addEventListener('change', function(evt) {
          console.log(evt);
          console.log('change Ldpk1:' + dp1.options.length);
          console.log(
            'select Ldpk1 index:' +
              dp1.options.selectedIndex +
              ' value:' +
              dp1.options.item(dp1.options.selectedIndex).value
          );
        });
        // tslint:disable-next-line:typedef
        selector_mes.addEventListener('click', function(evt) {
          console.log(evt);
          console.log('click');
        });
        // ----------------------------------
      }

      if (!this.moment(inputValue, 'MM/DD/YYYY').isValid()) {
        console.log('Invalid Date');
        this.valueBirthday = '';
        this.model.birthday = '';
        this.inputControl = '';
      } else {
        console.log('Valid Date');
        if (
          !this.moment(inputValue, 'MM/DD/YYYY').isAfter(
            this.moment(new Date(), 'MM/DD/YYYY').subtract(100, 'years')
          ) ||
          !this.moment(new Date(), 'MM/DD/YYYY')
            .subtract(21, 'years')
            .isAfter(this.moment(inputValue, 'MM/DD/YYYY'))
        ) {
          console.log('Invalid Date');
          this.valueBirthday = '';
          this.model.birthday = '';
          this.inputControl = '';
        }
      }
    }, 250);
  }

  public ic_key_up() {
    this.inputControl = this.formateadorFecha(this.inputControl);
    console.log(this.inputControl);
    // si tiene 10 digitos y esta formateada
    if (
      this.inputControl.length === 10 &&
      this.inputControl.indexOf('/') === 2 &&
      this.inputControl.indexOf('/', 5) === 5
    ) {
      const year: number = parseInt(this.inputControl.substr(-4, 4));
      console.log('y:' + year + ' c: ' + new Date(new Date().setFullYear(new Date().getFullYear() - 21)).getFullYear());

      if (year > new Date(new Date().setFullYear(new Date().getFullYear() - 21)).getFullYear()) {
        this.valueBirthday = '';
        this.model.birthday = '';
        this.inputControl = '';
      } else {
        this.valueBirthday = this.inputControl;
        this.model.birthday = this.inputControl;
      }
    }
    console.log('ic_key_up');
  }

  // ============= Segundo DatePicker ==================
  public ic_blur2() {
    setTimeout(() => {
      const inputValue: string = this.inputControl2;
      this.model.idExpirationDate = inputValue;
      this.valueExpirationDate = inputValue;
      console.log('#blur :' + inputValue);

      if (!this.moment(inputValue, 'MM/DD/YYYY').isValid()) {
        console.log('Invalid Date');
        this.model.idExpirationDate = '';
        this.valueExpirationDate = '';
        this.inputControl2 = '';
      } else {
        console.log('Valid Date');
        if (
          !this.moment(inputValue, 'MM/DD/YYYY').isAfter(this.moment(new Date(), 'MM/DD/YYYY')) ||
          !this.moment(new Date(), 'MM/DD/YYYY')
            .add(10, 'years')
            .isAfter(this.moment(inputValue, 'MM/DD/YYYY'))
        ) {
          console.log('Invalid Date');
          this.model.idExpirationDate = '';
          this.valueExpirationDate = '';
          this.inputControl2 = '';
        }
      }
    }, 200);
  }

  public ic_key_up2() {
    this.inputControl2 = this.formateadorFecha(this.inputControl2);
    console.log(this.inputControl2);
    console.log('ic_key_up2');
  }

  onBlurSSN() {
    if (this.validateRightSSN()) {
      this.form.get('socialSecure').setValue('XXX-XX-' + String(this.valueSSN).substr(-4, 4));
    } else {
      this.form.get('socialSecure').setValue('');
      this.valueSSN = undefined;
      this.checkSSN = false;
    }
  }

  onFocusSSN() {
    if (this.validateRightSSN()) {
      this.valueSSN = String(this.valueSSN).replace(/-/g, '');

      this.form
        .get('socialSecure')
        .setValue(
          String(this.valueSSN).substr(0, 3) +
            '-' +
            String(this.valueSSN).substr(3, 2) +
            '-' +
            String(this.valueSSN).substr(5, 4)
        );
    } else {
      this.form.get('socialSecure').setValue('');
      this.valueSSN = undefined;
      this.checkSSN = false;
    }
  }

  validateRightSSN() {
    return (
      this.form.get('socialSecure').value.length === 11 &&
      parseInt(String(this.valueSSN).replace(/-/g, ''), 10) >= 9999999
    );
  }

  validateForm() {
    let valid = false;
    if(this.back == false){
      if(this.asistence ){
        this.repID.length > 0? valid = true : valid = false;
      } else{
        valid = true;
      }
    } else{
      valid = true;
    }
    return (this.form.valid && valid);
  }

  setCheck(param: any){
    if(this.strListAgent.length > 0){
      let find: number = 0;
      for(let i = 0; i < this.strListAgent.length; i ++){
        if(this.strListAgent[i] === param){
          this.strListAgent.splice(i,1);
          find = 1;
          break
        }
      }
      if(find == 0){
        this.strListAgent.push(param)
      }
    } else{
      this.strListAgent.push(param)
    }
    console.log(param)
    console.log(this.strListAgent.toString())
  }
}
