import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UsfServiceService } from '@app/core/usf/usf-service.service';
declare let alertify: any;

/**
 * Provides a base for authentication workflow.
 * The Credentials interface as well as login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class AuthenticationService {
  private _credentials: any | null;
  private _max_min_inactive = 15;

  constructor(public usfServiceService: UsfServiceService, private router: Router) {
    const savedCredentials = this.usfServiceService.getValue('credentials');
    if (savedCredentials) {
      savedCredentials.timeLogin = new Date();
      this._credentials = savedCredentials;
    }

    setInterval(() => {
      if (this.getMinutesInSessionI() >= this._max_min_inactive) {
        if (router.url !== '/login') {
          alertify.alert(
            'Sesión Inactiva',
            'No hemos detectado actividad en los últimos ' +
              this._max_min_inactive +
              ' minutos. Por favor inicie nuevamente ingresando su nombre de usuario y contraseña.',
            () => {
              this._credentials = null;
              this.router.navigate(['/'], { replaceUrl: true }).then();
            }
          );
        }
      } else if (this.getTimeLogin === undefined || this._credentials === null) {
        this.router.navigate(['/'], { replaceUrl: true }).then();
      }
    }, 60000); // 60.000 milisegundos Referentes a 1 min
  }

  validaSessionActiva() {
    if (!this.isAuthenticated() || this.getTimeLogin === undefined) {
      this.router.navigateByUrl('/').then();
      return -1;
    }
  }

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: any): Observable<any> {
    const data = {
      userName: context.username,
      Password: context.password,
      method: 'loginAdMcapi'
    };
    return this.usfServiceService.doAction(data);
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout() {
    this.setCredentials();
  }

  /**
   * Retorna el tiempo en que se identifico
   * @return Object Type Date
   */
  public getTimeLogin(): Date {
    if (this.credentials === null) {
      return new Date('01/01/1900'); // se manda una fecha expirada cuando no tenga session activa
    } else {
      return this.credentials.timeLogin;
    }
  }

  /**
   * Retorna el tiempo de MINUTOS en de session Transcurrido
   * @return number
   */
  public getMinutesInSessionI(): number {
    if (this.getTimeLogin() !== undefined) {
      return new Date(new Date().getTime() - this.getTimeLogin().getTime()).getMinutes();
    } else {
      return 0;
    }
  }

  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get credentials(): any | null {
    return this._credentials;
  }

  public getCredentials(): any | null {
    return this._credentials;
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param credentials The user credentials.
   */
  public setCredentials(credentials?: any) {
    this._credentials = credentials || null;
    this.usfServiceService.setValue('credentials', this._credentials);
  }
}
