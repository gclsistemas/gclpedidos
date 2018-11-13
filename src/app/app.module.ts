import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { HelperProvider } from '../providers/helper/helper';
import { HttpClientModule } from '@angular/common/http';
import { SingletonProvider } from '../providers/singleton/singleton';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { WebserviceProvider } from '../providers/webservice/webservice';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    File,
    FileOpener,
    HelperProvider,
    SplashScreen,
    StatusBar,
    SingletonProvider,
    WebserviceProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
