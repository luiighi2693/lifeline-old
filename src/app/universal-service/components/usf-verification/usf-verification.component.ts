import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Util from '@app/universal-service/util';
import { UsfServiceService } from '@app/core/usf/usf-service.service';
import { BaseComponent } from '@app/core/base/BaseComponent';
declare let $: any;

export interface Model {
  firstName: string;
  secondName: string;
  lastName: string;
  birthday: string;
  sufix: string;
  socialSecure: string;
}

@Component({
  selector: 'app-usf-verification',
  templateUrl: './usf-verification.component.html',
  styleUrls: ['./usf-verification.component.scss']
})
export class UsfVerificationComponent extends BaseComponent implements OnInit {
  datePicker_is_init = false;
  processValidationNLAD = false;

  format2 = 'XXX-XX-XXXX';
  valueSSN = '';
  checkSSN = false;
  invalidSSN = true;

  public sufixes = ['MR', 'MRS', 'ENG', 'ATTY', 'DR'];

  public form: FormGroup;
  model: Model = new (class implements Model {
    sufix = '';
    socialSecure = '';
    birthday = '';
    firstName = '';
    lastName = '';
    secondName = '';
  })();

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
      sufix: [null, Validators.compose([Validators.required])],
      firstName: [null, Validators.compose([Validators.required])],
      secondName: [
        null,
        Validators.compose([
          // Validators.required
        ])
      ],
      lastName: [null, Validators.compose([Validators.required])],
      socialSecure: [null, Validators.compose([Validators.required])],
      birthday: [null, Validators.compose([Validators.required])]
    });
  }

  goToDocumentDigitalization() {
    if (this.form.valid && this.model.socialSecure.length === 11) {
      this.processValidationNLAD = true;

      console.log(this.model);

      const datos = {
        method: 'CreateDepend',
        CASE_ID: this.validateSSNData.CASENUMBER,
        DEPENT_SUFIJO: this.model.sufix,
        DEPENT_NAME: this.model.firstName,
        DEPENT_MN: this.model.secondName,
        DEPENT_LAST: this.model.lastName,
        DEPENT_DOB: this.moment(this.model.birthday).format('YYYY-MM-DD'),
        DEPENT_SSN: String(this.valueSSN)
          .replace('-', '')
          .replace('-', '')
          .replace('-', '')
      };

      console.log(datos);

      setTimeout(() => {
        this.usfServiceService.doAction(datos).subscribe(resp => {
          this.processValidationNLAD = false;
          this.usfServiceService.setValue('requiredDocuments', resp.body.required);
          console.log(resp);

          if (!resp.body.HasError) {
            this.goTo('/universal-service/address-date');
          } else {
            this.alertify.alert('Aviso', resp.body.ErrorDesc, function() {});
          }
        });
      }, 2000);
    }
  }

  back() {
    this.router.navigate(['/universal-service/personal-dates'], { replaceUrl: true });
  }

  formatInputSocialSecure(input: string) {
    this.model.socialSecure = this.formatInput(this.model.socialSecure, this.format2);
  }
  // NUEVA ESTRUCCTURA >>>>>>>>>>>>>>>>>>>
  // tslint:disable-next-line:member-ordering
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
  // tslint:disable-next-line:member-ordering
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
      $('#inputControl3').datepicker({
        dateFormat: 'mm/dd/yy',
        changeMonth: true,
        changeYear: true,
        yearRange: '-100:-18',
        maxDate: '-18y',
        minDate: '-100y',
        defaultDate: '+-18y',
        onSelect: (dateText: any) => {
          console.log(dateText + ' *onSelect');
          this.model.birthday = dateText;
        },
        onChangeMonthYear: function(year: any, month: any, datepicker: any) {
          // #CAMBIO APLICADO y Necesario ya que al seleccionar el mes y cambiar el a#o en los selects
          // # no Cambiaba el valor del input  Ahora si se esta aplocando el cambio
          console.log('onChangeMonthYear');
          if ($('#inputControl3').val().length === 10) {
            console.log('to :' + month + ' ' + $('#inputControl3').val().sub + ' ' + year);

            const new_date = new Date(
              month +
                '/' +
                $('#inputControl3')
                  .val()
                  .substr(3, 2) +
                '/' +
                year
            );

            $('#inputControl3').datepicker('setDate', new_date);
          }
        }
      });
      this.datePicker_is_init = true;
    }
    $('#inputControl3').datepicker('show');
  }
  // tslint:disable-next-line:member-ordering
  public formateadorFecha(entrada: string) {
    // NO se aceptara mas de 10 caracteres
    if (entrada.length > 10) {
      entrada = entrada.substr(0, 10);
    }
    // Limpiando especificando caracteres no permitidos
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

  // tslint:disable-next-line:member-ordering
  public ic_blur() {
    setTimeout(() => {
      console.log('#blur :' + this.model.birthday);

      if (!this.moment(this.model.birthday, 'MM/DD/YYYY').isValid()) {
        console.log('Invalid Date');
        this.model.birthday = '';
      } else {
        console.log('Valid Date');
        if (
          !this.moment(this.model.birthday).isAfter(this.moment().subtract(100, 'years')) ||
          !this.moment().isAfter(this.moment(this.model.birthday))
        ) {
          console.log('Invalid Date');
          this.model.birthday = '';
        }
      }
    }, 200);
  }

  // tslint:disable-next-line:member-ordering
  public ic_key_up() {
    this.model.birthday = this.formateadorFecha(this.model.birthday);
    console.log(this.model.birthday);
    console.log('ic_key_up');
  }
  onBlurSSN() {
    if (this.model.socialSecure !== undefined) {
      // tslint:disable-next-line: radix
      if (
        this.model.socialSecure.length === 11 &&
        // tslint:disable-next-line: radix
        (parseInt(
          String(this.valueSSN)
            .replace('-', '')
            .replace('-', '')
        ) >= 99999999 ||
          // tslint:disable-next-line: radix
          parseInt(
            String(this.valueSSN)
              .replace('-', '')
              .replace('-', '')
          ) >= 9999999)
      ) {
        // this.model.socialSecure = 'XXX-XX-' + this.valueSSN.substr(5, 4);

        // si tiene los 2 - guiones  ya esta validado
        let remplazo = String(this.valueSSN.replace('-', '').replace('-', '')).replace('-', '');
        remplazo = 'XXX' + '-' + 'XX' + '-' + String(this.valueSSN).substr(-4, 4);

        console.log(remplazo);
        this.model.socialSecure = remplazo;
        console.log('onBlurSSN If');
      } else {
        console.log(this.valueSSN);
        this.model.socialSecure = undefined;
        this.valueSSN = undefined;
        this.checkSSN = false;
        console.log('onBlurSSN else');
      }
    }
  }
  onFocusSSN() {
    if (this.model.socialSecure !== undefined) {
      // tslint:disable-next-line: radix
      if (
        this.model.socialSecure.length === 11 &&
        // tslint:disable-next-line: radix
        (parseInt(
          String(this.valueSSN)
            .replace('-', '')
            .replace('-', '')
        ) >= 99999999 ||
          // tslint:disable-next-line: radix
          parseInt(
            String(this.valueSSN)
              .replace('-', '')
              .replace('-', '')
          ) >= 9999999)
      ) {
        // si trae guiones se limpia
        this.valueSSN = String(this.valueSSN)
          .replace('-', '')
          .replace('-', '')
          .replace('-', '');
        console.log(this.valueSSN);

        // Restaurando el valor
        this.model.socialSecure =
          String(this.valueSSN).substr(0, 3) +
          '-' +
          String(this.valueSSN).substr(3, 2) +
          '-' +
          String(this.valueSSN).substr(5, 4);

        console.log('onFocusSSN If');
      } else {
        this.model.socialSecure = undefined;
        this.valueSSN = undefined;
        this.checkSSN = false;
      }
    }
  }

  public formatInput(input: string, format: string) {
    /* BETA */
    if (
      input !== undefined &&
      input.length === 11 && // tslint:disable-next-line: radix
      (parseInt(
        String(this.valueSSN)
          .replace('-', '')
          .replace('-', '')
      ) >= 99999999 ||
        // tslint:disable-next-line: radix
        parseInt(
          String(this.valueSSN)
            .replace('-', '')
            .replace('-', '')
        ) >= 9999999)
    ) {
      console.log('antes del cambio');
      console.log(input);
      console.log(this.valueSSN);
      // si tiene los 2 - guiones  ya esta validado
      this.valueSSN = String(input)
        .replace('-', '')
        .replace('-', '')
        .replace('-', '');
      this.valueSSN =
        String(this.valueSSN).substr(0, 3) +
        '-' +
        String(this.valueSSN).substr(3, 2) +
        '-' +
        String(this.valueSSN).substr(5, 4);
      console.log(format);
      console.log(this.format2);
      console.log(this.model.socialSecure);
      this.invalidSSN = false;
      this.checkSSN = true;
      console.log(this.form.controls['socialSecure'].valid);
      return this.valueSSN;
    }
    /* * * * * * * * * * * * * * * * * */

    // Almacenando valor real en variable temporal
    if (input !== undefined && input.length > 1 && String(input).substr(input.length - 1, 1) !== 'X') {
      // console.log(input.substr(input.length - 1, 1));
      this.valueSSN += String(input.substr(input.length - 1, 1));
    } else {
      if (input !== 'X' && input !== 'XXX-XX-XXXX') {
        this.valueSSN = input;
        // console.log(input);
      } else {
        console.log('comparacion para eliminar');
        console.log(input + ' input');
        console.log(this.valueSSN + ' valueSSN');
      }
    }

    // tslint:disable-next-line:radix
    if (
      input !== undefined &&
      input.length === 11 && // tslint:disable-next-line: radix
      (parseInt(
        String(this.valueSSN)
          .replace('-', '')
          .replace('-', '')
      ) >= 99999999 ||
        // tslint:disable-next-line: radix
        parseInt(
          String(this.valueSSN)
            .replace('-', '')
            .replace('-', '')
        ) >= 9999999)
    ) {
      console.log('invalido con ' + input.length);
      this.invalidSSN = true;
    }

    // Si llega a 11 Caracteres hay que hacer la validacion Real contra el servicio
    // ya que tiene el formato XXX-XX-XXXX  de 11 caracteres serian 9 digitos
    // parseInt( this.valueSSN ) > 99999999 [USADO PARA VALIDAR Y CUMPLIR LA CONDICION QUE SEA NUERICO Y DE 9 DIGITOS ]
    // tslint:disable-next-line:radix
    if (
      input !== undefined &&
      input.length === 11 && // tslint:disable-next-line: radix
      (parseInt(this.valueSSN.replace('-', '').replace('-', '')) >= 99999999 ||
        // tslint:disable-next-line: radix
        parseInt(
          String(this.valueSSN)
            .replace('-', '')
            .replace('-', '')
        ) >= 9999999)
    ) {
      console.log('invalidSSN f');
      this.invalidSSN = false;
      this.checkSSN = true;
      console.log(this.valueSSN);
    }

    if (format === this.format2) {
      console.log(input);
      console.log(format);
      console.log(this.format2);
      if (input !== undefined && input.length === 4) {
        if (input[input.length - 1] === '-') {
          return input.substr(0, input.length - 1) + input.substr(input.length - 1, input.length);
        } else {
          return input.substr(0, input.length - 1) + '-' + input.substr(input.length - 1, input.length);
        }
      }

      if (input !== undefined && input.length === 7) {
        console.log(input);
        if (input[input.length - 1] === '-') {
          return input.substr(0, input.length - 1) + input.substr(input.length - 1, input.length);
        } else {
          return input.substr(0, input.length - 1) + '-' + input.substr(input.length - 1, input.length);
        }
      }

      if (input !== undefined && input.length > 7) {
        return input;
      } else {
        return input;
      }
    }
    console.log('va a blanquear');
    return '';
  }
}
