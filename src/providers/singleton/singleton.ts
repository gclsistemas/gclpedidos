import { Injectable } from '@angular/core';

/*
  Generated class for the SingletonProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SingletonProvider {

  public user = {
    id: 0,
    apellido: '',
    nombre: '',
    email: '',
    fullname: '',
    empresa_id: 0,
    password: ''
  }

  constructor() {
    console.log('Hello SingletonProvider Provider');
  }

}
