import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { BaseRouter } from '@app/core/base/BaseRouter';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends BaseRouter implements OnInit {
  username: string;
  dealerCode: string;
  roleName: string;
  directedSell: boolean;
  constructor(public authenticationService: AuthenticationService, public router: Router) {
    super(router);
    if (authenticationService.isAuthenticated()) {
      console.log(authenticationService.getCredentials());
      this.username = authenticationService.getCredentials().UserName;
      this.dealerCode = authenticationService.getCredentials().DealerCode;
      this.roleName = authenticationService.getCredentials().RoleName;
      this.directedSell = this.isDirectedSell();
    }
  }

  ngOnInit() {}

  validateSession() {
    if (this.authenticationService !== undefined) {
      return this.authenticationService.getCredentials() !== null;
    } else {
      return false;
    }
  }

  isDirectedSell() {
    return (
      this.roleName.toUpperCase() === 'USF-SUP' ||
      this.roleName.toUpperCase() === 'USF-AGENT' ||
      this.roleName.toUpperCase() === 'USF-REPSTORE'
    );
  }
}
