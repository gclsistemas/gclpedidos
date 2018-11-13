import { Component } from '@angular/core';
import {IonicPage, Loading, LoadingController, MenuController, NavController, NavParams} from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';
import { SingletonProvider } from '../../providers/singleton/singleton';
import { WebserviceProvider } from '../../providers/webservice/webservice';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'login-page'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loading: Loading;
  loginInfo = {
    email: '',
    password: ''
  };

  constructor(public helper: HelperProvider, private loadingCtrl: LoadingController, public menuCtrl: MenuController, public navCtrl: NavController, public navParams: NavParams, public singleton: SingletonProvider,
              public webservice: WebserviceProvider) {
  }

  createAccount() {
    this.navCtrl.setRoot('register-page');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.menuCtrl.enable(false, 'myMenu');
    if (localStorage.getItem('user') && localStorage.getItem('pwd')) {
      this.loginInfo.email = localStorage.getItem('user');
      this.loginInfo.password = localStorage.getItem('pwd');
      this.login();
    }
  }

  login() {
    this.showLoading();
    this.webservice.checkLogin(this.loginInfo)
      .then((res: any) => {
        // console.log(res);
        // alert(JSON.stringify(res));
        if (res.user) {
          this.singleton.user = res.user;
          localStorage.setItem('user', this.loginInfo.email);
          localStorage.setItem('pwd', this.loginInfo.password);
          this.navCtrl.setRoot('home-page', {title: 'Nuevo pedido'});
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

  /*onPageDidEnter() {
    // the left menu should be disabled on the login page
    this.menu.enable(false, 'myMenu');
  }

  onPageDidLeave() {
    // enable the left menu when leaving the login page
    this.menu.enable(true, 'myMenu');
  }*/

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Procesando...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

}
