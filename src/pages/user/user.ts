import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';
import { SingletonProvider } from '../../providers/singleton/singleton';
import { WebserviceProvider } from '../../providers/webservice/webservice';

/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'user-page'
})
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {

  pageTitle: '';

  constructor(public helper: HelperProvider, public navCtrl: NavController, public navParams: NavParams, public singleton: SingletonProvider, public webservice: WebserviceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');
    // console.log(this.singleton.user);
    this.pageTitle = this.navParams.get('title');
  }

  updateUser() {
    let obj = this.singleton.user;
    delete obj.id;
    if (!obj.password) {
      delete obj.password;
    }
    this.webservice.put('/user/' + this.singleton.user.id, obj)
      .then((res: any) => {
        console.log(res);
        this.helper.presentToast(res.message);
      })
      .catch(err => {
        console.log(err);
        this.helper.presentToast(err);
      });
  }

}
