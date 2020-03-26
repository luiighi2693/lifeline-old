import { Router } from '@angular/router';

export class BaseRouter {
  constructor(public router: Router) {}

  goTo(state: string) {
    this.router.navigate([state], { replaceUrl: true }).then();
  }
}
