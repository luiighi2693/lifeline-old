export default class Util {
  static checkNumbersOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode === 8) {
      return true;
    } else {
      const patron = /[0-9]/;
      return patron.test(String.fromCharCode(charCode));
    }
  }

  static checkCharactersOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode === 8 || charCode === 32) {
      return true;
    } else {
      const patron = /[A-Za-z]/;
      return patron.test(String.fromCharCode(charCode));
    }
  }
}
