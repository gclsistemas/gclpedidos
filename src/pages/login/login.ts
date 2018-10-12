import { Component } from '@angular/core';
import { IonicPage, LoadingController, Loading, NavController, NavParams } from 'ionic-angular';
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

  constructor(public helper: HelperProvider, private loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams, public singleton: SingletonProvider, public webservice: WebserviceProvider) {
  }

  login() {
    this.showLoading();
    this.webservice.checkLogin(this.loginInfo)
      .then((res: any) => {
        // console.log(res);
        // alert(JSON.stringify(res));
        if (res.user) {
          this.singleton.user = res.user;
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Procesando...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

}
