import { Component } from '@angular/core';
import {IonicPage, Loading, LoadingController, MenuController, NavController, NavParams} from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';
import { WebserviceProvider } from '../../providers/webservice/webservice';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'register-page'
})
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  loading: Loading;
  empresas: any[] = [];
  registerInfo = {
    fullname: '',
    email: '',
    empresa_id: 0,
    password: ''
  };

  constructor(public helper: HelperProvider, private loadingCtrl: LoadingController, public menuCtrl: MenuController, public navCtrl: NavController, public navParams: NavParams,
              public webservice: WebserviceProvider) {
  }

  backLogin() {
    this.navCtrl.setRoot('login-page');
  }

  ionViewDidLoad() {
    this.showLoading();
    console.log('ionViewDidLoad RegisterPage');
    this.menuCtrl.enable(false, 'myMenu');
    this.webservice.get('/get/empresas')
      .then((res: any) => {
        this.empresas = res;
      })
      .catch(err => {
        console.log(err);
        this.helper.presentToast(err);
      });
    this.loading.dismiss();
  }

  register() {
    this.showLoading();
    this.webservice.register(this.registerInfo)
      .then((res: any) => {
        // console.log(res);
        // alert(JSON.stringify(res));
        if (res.user) {
          localStorage.setItem('user', this.registerInfo.email);
          localStorage.setItem('pwd', this.registerInfo.password);
          this.navCtrl.setRoot('home-page');
        } else {
          console.log(res.message);
          this.helper.presentToast(res.message);
        }
      })
      .catch(err => {
        console.log(err);
        this.helper.presentToast(err);
      });
    this.loading.dismiss();
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Procesando...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

}
