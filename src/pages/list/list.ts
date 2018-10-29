/**
 * Generated class for the InformationTakenPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 *
 * How to Create PDF Files with Ionic using PDFMake [v3]
 * https://ionicacademy.com/create-pdf-files-ionic-pdfmake/
 * http://pdfmake.org
 * https://www.javascripting.com/view/pdfmake
 */

import { Component, ViewChild } from '@angular/core';
import {
  Nav, IonicPage, NavController, Platform,
  NavParams, AlertController, ItemSliding, LoadingController, Loading,
  PopoverController, ActionSheetController, ModalController
} from 'ionic-angular';
import * as moment from 'moment';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

import { SingletonProvider } from '../../providers/singleton/singleton';
import { HelperProvider } from '../../providers/helper/helper';
import {WebserviceProvider} from '../../providers/webservice/webservice';

@IonicPage({
  name: 'list-page'
})

@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {
  @ViewChild(Nav) nav: Nav;
  pedidos: any[] = [];
  pedidos_todos: any[] = [];
  onDialog: boolean = false;
  loading: Loading;
  myInput: string;

  /*letterObj = {
    to: '',
    from: '',
    text: ''
  };*/
  pdfObj = null;

  splash = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController,
              public popoverCtrl: PopoverController, public actionSheetCtrl: ActionSheetController,
              public modalCtrl: ModalController, private loadingCtrl: LoadingController, private singleton: SingletonProvider,
              private plt: Platform, private file: File, private fileOpener: FileOpener, private helper: HelperProvider,
              public webservice: WebserviceProvider) {
  }

  onInput(event) {
    // set val to the value of the searchbar
    let val = event.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.pedidos = this.pedidos_todos.filter((item) => {
        return (item.cliente.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.id.toString().indexOf(val.toLowerCase()) > -1);
      })
    }
    else {
      this.pedidos = this.pedidos_todos;
    }
  }

  onCancel(event) {
    this.pedidos = this.pedidos_todos;
  }

  private createPdf(index) {
    let docDefinition = {
      content: [
        // { image: '../../assets/imgs/logo.png' },
        { text: 'DATOS DEL PEDIDO', style: 'header' },
        { text: 'Fecha de pedido: ' + moment(this.pedidos[index].fecha, 'YYYY-MM-DD').format('DD/MM/YYYY'), style: 'subheader' },
        { text: 'Nro: ' + this.pedidos[index].id, style: 'subheader' },
        { text: 'Cliente: ' + this.pedidos[index].cliente, style: 'subheader' },
        { text: 'Cantidad: ' + this.pedidos[index].cantidad, style: 'subheader' },
        { text: 'Importe Total: ' + this.pedidos[index].importeTotal, style: 'subheader' },
        { text: (this.pedidos[index].cancelado ? 'Cancelado el ' + moment(this.pedidos[index].fechaCancelado).format('DD/MM/YYYY') :
            (this.pedidos[index].pagado ? 'Pagado: ' + moment(this.pedidos[index].fechaPago).format('DD/MM/YYYY') :
              (this.pedidos[index].embalada ? 'Embalada el ' + moment(this.pedidos[index].fechaEmbalada).format('DD/MM/YYYY') :
                (this.pedidos[index].enviado ? 'Enviado el ' + moment(this.pedidos[index].fechaEnviado).format('DD/MM/YYYY') :
    'Sin procesar')))), style: 'subheader' },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0]
        },
        story: {
          italic: true,
          alignment: 'center',
          width: '50%',
        }
      }
    };
    this.pdfObj = pdfMake.createPdf(docDefinition);
  }

  /*presentFiles(slidingItem: ItemSliding, index) {
    let id = this.pedidos[index].id;
    let adjuntosModal = this.modalCtrl.create('adjuntos-page', { pedido_id: id });
    //this.navCtrl.setRoot('home-page', { solicitudId: this.tomados[index].id });
    adjuntosModal.onDidDismiss(data => {
      console.log(data);
    });
    adjuntosModal.present();
  }*/

  private downloadPdf(index, openfile) {
    let pdfName = "pedido";
    if (this.plt.is('cordova')) {
      this.pdfObj.getBuffer((buffer) => {
        let blob = new Blob([buffer], { type: 'application/pdf' });
        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.dataDirectory, pdfName + '.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          if (openfile) {
            this.fileOpener.open(this.file.dataDirectory + pdfName + '.pdf', 'application/pdf');
          }
        })
      });
    } else {
      // On a browser simply use download!
      this.pdfObj.download();
    }
  }

  editItem(slidingItem: ItemSliding, index) {
    this.navCtrl.setRoot('home-page', { pedido_id: this.pedidos[index].id });
    slidingItem.close();
  }

  editSelected() {
    let cantSeleccionados = 0;
    let idx = -1;
    for (let i = 0; i < this.pedidos.length; i++) {
      if (this.pedidos[i].seleccionado) {
        idx = i;
        cantSeleccionados++;
        if (cantSeleccionados > 1) {
          break;
        }
      }
    }
    if (cantSeleccionados === 1) {
      this.navCtrl.setRoot('home-page', { pedido_id: this.pedidos[idx].id });
    } else {
      this.helper.presentToast('Seleccione un sólo item a editar.');
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListPage');
    this.getListado();
    setTimeout(() => this.splash = true, 1000);
  }

  private getListado() {
    this.showLoading();
    this.webservice.download_pedidos(this.singleton.user.id)
      .then((res: any) => {
        console.log(res);
        if (res.message) {
          console.log(res.message);
          this.helper.presentToast(res.message);
        } else {
          this.pedidos_todos = res.pedidos;
          this.pedidos = this.pedidos_todos;
        }
      })
      .catch(err => {
        console.log(err);
        this.helper.presentToast(err);
      });
    this.loading.dismiss();
  }

  private removeItem(index) {
    this.showLoading();
    let obj = {fechaCancelado : moment().format('YYYY-MM-DD  HH:mm:ss')};
    this.webservice.put("/pedido/update/" + this.pedidos[index].id, obj)
      .then(
        (res: any) => {
        console.log(res);
        this.helper.presentToast(res.message);
      },
      err => {
        alert(err);
        console.log(err);
      });
    this.loading.dismiss();
  }

  sendToPdf() {
    for (let i = 0; i < this.pedidos.length; i++) {
      if (this.pedidos[i].seleccionado) {
        this.createPdf(i);
        this.downloadPdf(i, false);
      }
    }
  }

  toPDF(slidingItem: ItemSliding, index) {
    this.createPdf(index);
    this.downloadPdf(index, true);
  }

  deleteSelected() {
    if (confirm("Elimina pedidos seleccionados?")) {
      this.pedidos = this.pedidos.filter((item: any) => {
        return (item.seleccionado == false);
      });
    }
  }

  itemsEMail(index) {
    let texto = '<table style="width:100%;"><tr>';
    texto += "<th align='left'>Fecha</th>";
    texto += "<th align='left'>Nro Pedido</th>";
    texto += "<th align='left'>Cliente</th>";
    texto += "<th align='right'>Cantidad</th>";
    texto += "<th align='right'>Importe Total</th>";
    texto += "</tr>";
    for (let i = 0; i < this.pedidos[index].items.length; i++) {
      texto += "<tr>";
      texto += "<td align='left'>" + moment(this.pedidos[index].items[i].fecha, 'YYYY-MM-DD').format('DD/MM/YYYY') + "</td>";
      texto += "<td align='left'>" + this.pedidos[index].items[i].id + "</td>";
      texto += "<td align='left'>" + this.pedidos[index].items[i].cliente + "</td>";
      texto += "<td align='right'>" + this.pedidos[index].items[i].cantidad + "</td>";
      texto += "<td align='right'>$" + this.pedidos[index].items[i].importeTotal + "</td>";
      texto += "</tr>";
    }
    texto += '</tr></table>';
    return texto;
  }

  sendToEMail() {
    /*let i = 0;
    for (i = 0; i <= this.pedidos.length - 1; i++) {
      if (this.pedidos[i].seleccionado) {
        let obj = {id: this.pedidos[i].id};
        this.webService.postPhp('/solicitudes/app_send_mail.php', obj).subscribe(
          res => {
            let info = res["_body"];
            let obj = JSON.parse(info);
            this.helper.presentToast(obj.message);
          },
          err => {
            //alert(JSON.stringify(err));
            console.log(JSON.stringify(err));
          }
        );
      }
    }*/
  }

  confirmDelete(slidingItem: ItemSliding, index) {
    if (this.onDialog) return;
    let alert = this.alertCtrl.create({
      message: 'Esta seguro que desea cancelar el pedido?',
      buttons: [
        {
          text: 'Volver',
          role: 'cancel',
          handler: () => {
            this.onDialog = false;
          }
        },
        {
          text: 'Cancelar pedido',
          handler: () => {
            this.removeItem(index);
            this.onDialog = false;
          }
        }
      ]
    });
    alert.present();
    this.onDialog = true;
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create('popover-page');
    popover.present({
      ev: myEvent
    });

    popover.dismiss(data => {
      if (data) {
        if (data.idx == 1) {  // Send via email
          this.sendToEMail();
        }
      }
    })
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Editar seleccionado',
          icon: 'create',
          handler: () => {
            console.log('Editar seleccionado');
            this.editSelected();
          }
        },
        {
          text: 'Enviar por e-mail seleccionados',
          icon: 'mail',
          handler: () => {
            console.log('Send to email');
            this.sendToEMail();
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Procesando...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

}
