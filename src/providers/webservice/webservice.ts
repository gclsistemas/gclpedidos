import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { HelperProvider } from '../helper/helper';

/*
  Generated class for the WebserviceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WebserviceProvider {

  private urlWeb: string = 'https://gclsistemas.com.ar/pedidosclientes';
  private httpHeaders = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'
  });

  constructor(public http: HttpClient) { //public helper: HelperProvider,
    console.log('Hello WebserviceProvider Provider');
  }

  /**
   *
   * @param {any} obj
   * @returns {Promise<any>}
   */
  checkLogin(obj: any) {
    console.log('WebserviceProvider - checkLogin');
    return new Promise(resolve => {
      /*this.http.post(this.urlWeb + '/checklogin', obj, {headers: this.httpHeaders}).subscribe(response => {
        resolve(response);
      }, err => {
        console.log(err);
        // this.helper.presentToast(err);
        resolve(err);
      });*/
      this.http.get(this.urlWeb + '/checklogin', {headers: this.httpHeaders, params: obj}).subscribe(response => {
        resolve(response);
      }, err => {
        console.log(err);
        // this.helper.presentToast(err);
        resolve(err);
      });
    });
  }

  /**
   *
   * @param {number} user_id Id de usuario logueado.
   * @returns {Promise<any>}
   */
  download(user_id: number) {
    console.log('WebserviceProvider - download');
    return new Promise(resolve => {
      this.http.get(this.urlWeb + '/download/' + user_id, {headers: this.httpHeaders}).subscribe(response => {
        resolve(response);
      }, err => {
        console.log(err);
        // this.helper.presentToast(err);
        resolve(err);
      });
    });
  }

  /**
   *
   * @param {string} url Sin http/htpps. Ej: /pedidos/lista.
   * @param {any} obj
   * @returns {Observable<Object>}
   */
  public get(url: string, obj: any = null) {
    if (obj) {
      return new Promise(resolve => {
        this.http.get(this.urlWeb + url, {headers: this.httpHeaders, params: obj}).subscribe(response => {
          resolve(response);
        }, err => {
          console.log(err);
          // this.helper.presentToast(err);
          resolve(err);
        });
      });
    }
    return new Promise(resolve => {
      this.http.get(this.urlWeb + url, {headers: this.httpHeaders}).subscribe(response => {
        resolve(response);
      }, err => {
        console.log(err);
        // this.helper.presentToast(err);
        resolve(err);
      });
    });
  }

  /**
   *
   * @param url Sin http/htpps. Ej: /pedidos/lista.
   * @param obj Datos a guardar.
   * @returns {Observable<Object>}
   */
  public post(url: string, obj: any) {
    return new Promise(resolve => {
      this.http.post(this.urlWeb + url, obj, {headers: this.httpHeaders}).subscribe(response => {
        resolve(response);
      }, err => {
        console.log(err);
        // this.helper.presentToast(err);
        resolve(err);
      });
    });
  }

  /**
   *
   * @param url Sin http/htpps. Ej: /pedidos/lista.
   * @param obj Datos a actualizar.
   * @returns {Observable<Object>}
   */
  public put(url: string, obj: any) {
    return new Promise(resolve => {
      this.http.put(this.urlWeb + url, obj, {headers: this.httpHeaders}).subscribe(response => {
        resolve(response);
      }, err => {
        console.log(err);
        // this.helper.presentToast(err);
        resolve(err);
      });
    });
  }

}
