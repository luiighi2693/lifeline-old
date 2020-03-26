import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@app/core/base/BaseComponent';
import { FormBuilder } from '@angular/forms';
import { UsfServiceService } from '@app/core/usf/usf-service.service';
declare let alertify: any;

export interface Model {
  CUSTOMER_NAME: string;
  CUSTOMER_LAST: string;
  USF_CASEID: string;
  mBan: string;
  subscriber: string;
}

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss']
})
export class ActivationComponent extends BaseComponent implements OnInit {
  model: Model = new (class implements Model {
    CUSTOMER_NAME = '';
    CUSTOMER_LAST = '';
    USF_CASEID = '';
    mBan = '';
    subscriber = '';
  })();

  suscriberNumber: string;
  public dealer: any;
  public message: string;

  constructor(
    public authenticationService: AuthenticationService,
    public usfServiceService: UsfServiceService,
    public router: Router,
    public fb: FormBuilder
  ) {
    super(authenticationService, usfServiceService, router, fb);

    let userId = this.authenticationService.credentials.userid;
    let caseId = this.validateSSNData.CASENUMBER;

    // this.suscriberActivation = true;
    this.dealer = this.authenticationService.credentials.Dealer;

    if (this.dealer.toString() === '0') {
      this.message = 'Su Número de Telefono prepago está en proceso de activacion';
    } else {
      this.message = 'Su Número de Telefono prepago  ya está activo y listo para su uso';
    }

    const datos = {
      method: 'getBanMcapi',
      UserID: userId,
      caseID: caseId
    };

    console.log(datos);

    this.usfServiceService.doAction(datos).subscribe(
      resp => {
        console.log(resp);

        // this.suscriberActivation = false;

        if (!resp.body.HasError) {
          this.model = resp.body;

          this.suscriberNumber = sessionStorage.getItem('suscriberNumber');
        } else {
          alertify.alert('Aviso', resp.body.ErrorDesc, () => {
            this.goTo('/home');
          });
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  ngOnInit() {
    window.scroll(0, 0);
  }
}
