import {Component} from '@angular/core';
import {IonicPage, Loading, LoadingController, MenuController, NavController, NavParams} from 'ionic-angular';
import {HelperProvider} from '../../providers/helper/helper';
import {SingletonProvider} from '../../providers/singleton/singleton';
import {WebserviceProvider} from '../../providers/webservice/webservice';
// import {UidOriginal} from '@ionic-native/uid';
// import {AndroidPermissionsOriginal} from '@ionic-native/android-permissions';

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
    password: '',
    imei: ''
  };

  //private androidPermissions: AndroidPermissionsOriginal, private uid: UidOriginal,
  constructor(public helper: HelperProvider, private loadingCtrl: LoadingController, public menuCtrl: MenuController, public navCtrl: NavController,
              public navParams: NavParams, public singleton: SingletonProvider, public webservice: WebserviceProvider) {
  }

  // async getImei() {
  //   //https://ionicframework.com/docs/native/uid/
  //   const { hasPermission } = await this.androidPermissions.checkPermission(
  //     this.androidPermissions.PERMISSION.READ_PHONE_STATE
  //   );
  //
  //   if (!hasPermission) {
  //     const result = await this.androidPermissions.requestPermission(
  //       this.androidPermissions.PERMISSION.READ_PHONE_STATE
  //     );
  //
  //     if (!result.hasPermission) {
  //       throw new Error('Permissions required');
  //     }
  //
  //     // ok, a user gave us permission, we can get him identifiers after restart app
  //     return;
  //   }
  //
  //   return this.uid.IMEI;
  // }

  /*createAccount() {
    this.navCtrl.setRoot('register-page');
  }*/

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
        console.log(res);
        // alert(JSON.stringify(res));
        if (res.user) {
          this.singleton.user = res.user;
          localStorage.setItem('user', this.loginInfo.email);
          localStorage.setItem('pwd', this.loginInfo.password);
          this.loading.dismiss();
          this.navCtrl.setRoot('home-page', {title: 'Nuevo pedido'});
        } else {
          this.loading.dismiss();
          console.log(res.message);
          this.helper.presentToast(res.message);
        }
      })
      .catch(err => {
        this.loading.dismiss();
        console.log(err);
        this.helper.presentToast(err);
      });

    // this.getImei().then((imei: string) => {
    //   this.loginInfo.imei = imei;
    //   console.log(this.loginInfo);
    //   this.webservice.checkLogin(this.loginInfo)
    //     .then((res: any) => {
    //       console.log(res);
    //       // alert(JSON.stringify(res));
    //       if (res.user) {
    //         this.singleton.user = res.user;
    //         localStorage.setItem('user', this.loginInfo.email);
    //         localStorage.setItem('pwd', this.loginInfo.password);
    //         this.loading.dismiss();
    //         this.navCtrl.setRoot('home-page', {title: 'Nuevo pedido'});
    //       } else {
    //         this.loading.dismiss();
    //         console.log(res.message);
    //         this.helper.presentToast(res.message);
    //       }
    //     })
    //     .catch(err => {
    //       this.loading.dismiss();
    //       console.log(err);
    //       this.helper.presentToast(err);
    //     });
    // }, err => {
    //   this.loading.dismiss();
    //   console.log(err);
    //   this.helper.presentToast(err);
    // });
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
