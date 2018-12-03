import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';

/*
  Generated class for the WebserviceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WebserviceProvider {

  private urlWeb: string = 'https://gclsistemas.com.ar/pedidosclientes';
  /*private httpHeaders = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Headers': 'Accept, Access-Control-*, Authorization, Content-Type, Origin, X-Requested-With, Access-Control-Request-Method, Access-Control-Request-Headers',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS, POST, PUT',
    // 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    // 'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
    // 'Access-Control-Allow-Headers': 'Content-Type, X-Amz-Date, Authorization, X-Api-Key, Origin, Accept, Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Allow-Origin',
    // 'Access-Control-Allow-Headers': 'Origin, Accept, Access-Control-*, Content-Type, Access-Control-Request-*',
    'Accept': 'application/json'
  });*/
  /*private httpHeaders = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Headers': 'X-PINGOTHER, Content-Type, Authorization, Content-Length, X-Requested-With, Access-Control-*',
    // 'Access-Control-Allow-Headers': 'X-PINGOTHER, pingpong',
    // 'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS, POST, PUT',
    'Access-Control-Allow-Headers': '*'
  });*/
  /*private httpHeaders = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT', //,HEAD,OPTIONS
    //'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Origin, Accept, Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Allow-Origin'
  });*/
  /*private httpHeaders = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*'
  });*/

  private httpHeaders = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
    // 'Access-Control-Allow-Headers': 'Accept, Content-Type',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  });

  constructor(public http: HttpClient) {
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
   * @param empresa_id Id de la empresa asignada al cliente logueado.
   */
  download_productos_empresa(empresa_id: number) {
    console.log('WebserviceProvider - download_productos_empresa');
    return new Promise(resolve => {
      this.http.get(this.urlWeb + '/download/productos/' + empresa_id, {headers: this.httpHeaders}).subscribe(response => {
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
  download_pedidos(user_id: number) {
    console.log('WebserviceProvider - download pedidos');
    return new Promise(resolve => {
      this.http.get(this.urlWeb + '/download/pedidos/' + user_id, {headers: this.httpHeaders}).subscribe(response => {
        resolve(response);
      }, err => {
        console.log(err);
        // this.helper.presentToast(err);
        resolve(err);
      });
    });
  }

  download_pedidos_cliente(cliente_id: number) {
    console.log('WebserviceProvider - download pedidos');
    return new Promise(resolve => {
      this.http.get(this.urlWeb + '/download/pedidos/cliente/' + cliente_id, {headers: this.httpHeaders}).subscribe(response => {
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

  register(obj: any) {
    console.log('WebserviceProvider - register');
    return new Promise(resolve => {
      /*this.http.post(this.urlWeb + '/register', obj, {headers: this.httpHeaders}).subscribe(response => {
        resolve(response);
      }, err => {
        console.log(err);
        // this.helper.presentToast(err);
        resolve(err);
      });*/
      this.http.get(this.urlWeb + '/register', {headers: this.httpHeaders, params: obj}).subscribe(response => {
        resolve(response);
      }, err => {
        console.log(err);
        // this.helper.presentToast(err);
        resolve(err);
      });
    });
  }

}
