import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { constants } from '@env/constants';

@Injectable()
export class UsfServiceService {
  constructor(private http: HttpClient) {}

  doAction(data: any): Observable<any> {
    const credentials: any = this.getValue('credentials');
    if (credentials) {
      console.log(credentials);
      credentials.timeLogin = new Date();
      this.setValue('credentials', credentials);
      console.log('renoved session');
    }

    const url = constants.MOCK_API ? constants.MOCK_API_PATH : constants.URL + constants.API_PATH;
    return this.http.post<any>(url, data, { observe: 'response' });
  }

  public getValue = (key: string): any | null => {
    let data: any;
    data = JSON.parse(sessionStorage.getItem(key));
    return data;
  };

  setValue = (key: string, data: any) => {
    if (data) {
      sessionStorage.setItem(key, JSON.stringify(data));
    } else {
      sessionStorage.removeItem(key);
    }
  };
}
