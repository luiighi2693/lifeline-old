import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { AuthenticationService } from '@app/core';
import { BaseRouter } from '@app/core/base/BaseRouter';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseRouter implements OnInit {
  error = '';
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService
  ) {
    super(router);
    this.loginForm = this.formBuilder.group({
      username: [''],
      password: ['']
    });
  }

  ngOnInit() {
    this.authenticationService.logout();
  }

  async login() {
    if (!this.loginForm.invalid && !this.isLoading) {
      this.isLoading = true;

      try {
        const credentials = await this.authenticationService.login(this.loginForm.value)
          .pipe(
            finalize(() => {
              this.loginForm.markAsPristine();
              this.isLoading = false;
            })
          ).toPromise();
        if (!credentials.body.HasError) {
          if (credentials.body.Active) {
            const roleName = credentials.body.RoleName.toUpperCase();
            if (
              roleName === 'USF-SUP' ||
              roleName === 'USF-AGENT' ||
              roleName === 'USF-REPSTORE' ||
              roleName === 'USF_AGENT_V_INDIRECTAS' ||
              roleName === 'USF_SUP_V_INDIRECTAS'
            ) {
              this.authenticationService.setCredentials(credentials.body);
              this.goTo('/home');
            } else {
              this.error =
                'Estimado usuario hemos detectado que su usuario no tiene permisos otorgados para acceso a la  ' +
                'aplicación. Por favor contacte al administrador del sistema.';
            }
          } else {
            this.error =
              'Hemos detectado un error en el ingreso de sus credenciales de acceso. Favor ' +
              'intentarlo nuevamente.';
          }
        } else {
          if (this.loginForm.value.username.length === 0 || this.loginForm.value.password.length === 0) {
            this.error =
              'Hemos detectado un error en el ingreso de sus credenciales de acceso. Favor ' +
              'intentarlo nuevamente ingresando los campos marcados como requeridos.';
          } else {
            if (credentials.body.LoginAttems === 3) {
              this.error =
                'Usted ha excedido el número de intentos permitidos. Su cuenta ha sido bloqueada. ' +
                'Por favor contacte al administrador del sistema.';
            } else {
              this.error =
                'Hemos detectado un error en el ingreso de sus credenciales de acceso. Favor ' +
                'intentarlo nuevamente.';
            }
          }
        }
      } catch (e) {
        this.error =
          'Estimado usuario al momento la aplicación no está disponible para su uso por favor ' +
          'intente nuevamente en 5 min o contacte al administrador del sistema.';
      }
    }
  }
  capturaInKey(evt: any) {
    if (evt.keyCode === 13) {
      this.login();
    }
  }
}
