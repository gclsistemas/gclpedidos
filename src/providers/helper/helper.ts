import { Injectable } from '@angular/core';
import {AlertController, ToastController} from 'ionic-angular';

/*
  Generated class for the HelperProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HelperProvider {

  constructor(public alertCtrl: AlertController, public toastCtrl: ToastController) {
    console.log('Hello HelperProvider Provider');
  }

  showAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: ['OK']
    });
    alert.present();
  }

  presentToast(message: string, position: string = "bottom") {
    let toast = this.toastCtrl.create({
      message: message,
      position: position,
      duration: 3000,
      showCloseButton: false
    });
    toast.present();
  }

}
