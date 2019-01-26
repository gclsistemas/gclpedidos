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

/*import { Component, ViewChild } from '@angular/core';
import {
  Nav, IonicPage, NavController, Platform,
  NavParams, AlertController, ItemSliding, LoadingController, Loading,
  PopoverController, ActionSheetController, ModalController
} from 'ionic-angular';*/
import {Component} from '@angular/core';
import {
  IonicPage, NavController, Platform,
  NavParams, AlertController, ItemSliding, LoadingController, Loading,
  PopoverController, ActionSheetController, ModalController
} from 'ionic-angular';
import * as moment from 'moment';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

import {File} from '@ionic-native/file';
import {FileOpener} from '@ionic-native/file-opener';

import {SingletonProvider} from '../../providers/singleton/singleton';
import {HelperProvider} from '../../providers/helper/helper';
import {WebserviceProvider} from '../../providers/webservice/webservice';
// import {Base64} from '@ionic-native/base64';
import {CurrencyPipe} from "@angular/common";

@IonicPage({
  name: 'list-page'
})

@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {
  // @ViewChild(Nav) nav: Nav;
  pageTitle: string = '';
  loading: Loading;
  myInput: string;
  onDialog: boolean = false;
  pedidos: any[] = [];
  pedidos_todos: any[] = [];

  /*letterObj = {
    to: '',
    from: '',
    text: ''
  };*/
  pdfObj = null;

  splash = false;

  //private base64: Base64,
  constructor(private currencyPipe: CurrencyPipe, public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController,
              public popoverCtrl: PopoverController, public actionSheetCtrl: ActionSheetController,
              public modalCtrl: ModalController, private loadingCtrl: LoadingController, private singleton: SingletonProvider,
              private plt: Platform, private file: File, private fileOpener: FileOpener, private helper: HelperProvider,
              public webservice: WebserviceProvider) {
  }

  private createPdf(index) {
    console.log('createPdf ListPage');
    let imgLogoBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAO4AAAAyCAYAAABbEud2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzM0RjZGNzUwMDcyMTFFODhGNkZFRkUwMDI1NDIyMkQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzM0RjZGNzYwMDcyMTFFODhGNkZFRkUwMDI1NDIyMkQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDMzRGNkY3MzAwNzIxMUU4OEY2RkVGRTAwMjU0MjIyRCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDMzRGNkY3NDAwNzIxMUU4OEY2RkVGRTAwMjU0MjIyRCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuXre4EAABfKSURBVHja7V0JeFRF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';

    // this.base64.encodeFile('../../assets/imgs/logo.png')
    //   .then((base64File: string) => {
    //     imgLogoBase64 = base64File;
    //     return imgLogoBase64;
    //     },
    //     (err) => { console.log(err); }
    //     );

    // let imgLogoBase64 = '';
    // this.base64.encodeFile('assets/imgs/logo.png')
    //   .then((base64File: string) => {
    //       console.log('base64File', base64File);
    //       imgLogoBase64 = base64File;
    //       return imgLogoBase64;
    //     },(err) => { console.log(err); }
    //   );

    let bodyTableCabecera = [];
    bodyTableCabecera[bodyTableCabecera.length] = [
      {text: 'Fecha de pedido: ' + moment(this.pedidos[index].fecha, 'YYYY-MM-DD').format('DD/MM/YYYY')},
      {
        text: (this.pedidos[index].cancelado ? 'Cancelado el ' + moment(this.pedidos[index].fechaCancelado).format('DD/MM/YYYY') :
          (this.pedidos[index].pagado ? 'Pagado: ' + moment(this.pedidos[index].fechaPago).format('DD/MM/YYYY') :
            (this.pedidos[index].embalada ? 'Embalada el ' + moment(this.pedidos[index].fechaEmbalada).format('DD/MM/YYYY') :
              (this.pedidos[index].enviado ? 'Enviado el ' + moment(this.pedidos[index].fechaEnviado).format('DD/MM/YYYY') : 'Sin procesar'))))
      }
    ];
    bodyTableCabecera[bodyTableCabecera.length] = [
      //{text: 'Nro: ' + this.pedidos[index].id},
      // {text: 'Cliente: ' + this.singleton.user.fullname}
      {colSpan: 2, text: 'Cliente: ' + this.singleton.user.fullname},
      ''
    ];

    let total: number = 0;
    let bodyTableDetalle = [];
    bodyTableDetalle[bodyTableDetalle.length] = [{text: '#', alignment: 'center'}, {text: 'Descripción', alignment: 'center'}, {text: 'Precio', alignment: 'center'}, {text: 'Importe', alignment: 'center'}];
    for (let idx = 0; idx < this.pedidos[index].orden_venta_detalle.length; idx++) {
      let detalle = this.pedidos[index].orden_venta_detalle[idx];
      bodyTableDetalle[bodyTableDetalle.length] = [
        detalle.cantidad,
        detalle.producto,
        {text: this.currencyPipe.transform(detalle.precio, '$', 'symbol', '1.2-2'), alignment: 'right'},
        {text: this.currencyPipe.transform(detalle.importe, '$', 'symbol', '1.2-2'), alignment: 'right'}
      ];
      total += detalle.importe;
    }
    bodyTableDetalle[bodyTableDetalle.length] = [
      {alignment: 'right', bold: true, colSpan: 3, text: 'Total'},
      '',
      '',
      {text: this.currencyPipe.transform(total, '$', 'symbol', '1.2-2'), alignment: 'right'}
    ];

    let docDefinition = {
      footer: {
        columns: [
          {text: 'No válido como factura', alignment: 'center', italics: true}
        ]
      },
      content: [
        // {image: 'data:image/jpeg;base64,' + imgLogoBase64},
        //   {image: imgLogoBase64},
        {
          layout: 'noBorders',
          table: {
            widths: ['*', 'auto'],
            body: [
              [
                {image: imgLogoBase64},
                // {text: moment(new Date().toISOString()).format('DD/MM/YYYY'), bold: true, alignment: 'right'}
                {
                  alignment: 'center',
                  // layout: 'noBorders',
                  table: {
                    // alignment: 'right',
                    body: [
                      ['Dia', 'Mes', 'Año'],
                      [moment(new Date().toISOString()).format('DD'), moment(new Date().toISOString()).format('MM'), moment(new Date().toISOString()).format('YYYY')]
                    ]
                  },
                }
              ]
            ]
          }
        },
        {text: 'DATOS DEL PEDIDO Nro ' + this.pedidos[index].id, style: 'header'},
        // {text: 'Fecha de pedido: ' + moment(this.pedidos[index].fecha, 'YYYY-MM-DD').format('DD/MM/YYYY')},
        // {
        //   text: (this.pedidos[index].cancelado ? 'Cancelado el ' + moment(this.pedidos[index].fechaCancelado).format('DD/MM/YYYY') :
        //     (this.pedidos[index].pagado ? 'Pagado: ' + moment(this.pedidos[index].fechaPago).format('DD/MM/YYYY') :
        //       (this.pedidos[index].embalada ? 'Embalada el ' + moment(this.pedidos[index].fechaEmbalada).format('DD/MM/YYYY') :
        //         (this.pedidos[index].enviado ? 'Enviado el ' + moment(this.pedidos[index].fechaEnviado).format('DD/MM/YYYY') : 'Sin procesar'))))
        // },
        // {text: 'Nro: ' + this.pedidos[index].id},
        // // {text: 'Cliente: ' + this.pedidos[index].cliente, style: 'subheader'},
        // {text: 'Cliente: ' + this.singleton.user.fullname},
        // // {text: 'Cantidad: ' + this.pedidos[index].cantidad, style: 'subheader'},
        {
          layout: 'noBorders',
          // style: 'tableStyle',
          table: {
            body: bodyTableCabecera
          }
        },
        {
          layout: 'lightHorizontalLines', // optional
          // style: 'tableStyle',
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [50, 200, 80, 130],
            /*body: [
              [{text: '#', alignment: 'center'}, {text: 'Descripción', alignment: 'center'}, {text: 'Precio', alignment: 'center'}, {text: 'Importe', alignment: 'center'}],
              ['Value 1', 'Value 2', {text: 'Value 3', alignment: 'right'}, {text: 'Value 4', alignment: 'right'}],
              // [ { text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4']
              // ['', '', '', ''],
              // ['', '', {text: 'Total', alignment: 'right', bold: true}, {text: this.currencyPipe.transform(this.pedidos[index].importeTotal,'$', true, '1.2-2'), alignment: 'right', bold: true}]
            ],*/
            body: bodyTableDetalle,
            // footer: {
            //   columns: [
            //     '',
            //     '',
            //     {text: 'Total', alignment: 'right', bold: true},
            //     // {text: this.currencyPipe.transform(this.pedidos[index].importeTotal, '$', true, '1.2-2'), alignment: 'right', bold: true}
            //     {text: this.currencyPipe.transform(total, '$', true, '1.2-2'), alignment: 'right', bold: true}
            //   ]
            // }
          }
        },
        // {text: 'Importe Total: ' + this.currencyPipe.transform(this.pedidos[index].importeTotal,'$', true, '1.2-2'), style: 'subheader'},
      ],
      styles: {
        header: {
          alignment: 'center',
          bold: true,
          fontSize: 18,
          margin: [0, 15, 0, 15]
        },
        subheader: {
          fontSize: 14,
          bold: false,
          margin: [0, 15, 0, 0]
        },
        story: {
          italic: true,
          alignment: 'center',
          width: '50%',
        }
        // tableStyle: {
        //   width: '*'
        // }
      }
    };
    this.pdfObj = pdfMake.createPdf(docDefinition);
  }

  private downloadPdf(index, openfile) {
    console.log('downloadPdf ListPage');
    let pdfName = "pedido_" + this.pedidos[index].id + '.pdf';
    if (this.plt.is('cordova')) {
      console.log('cordova ListPage');
      this.pdfObj.getBuffer((buffer) => {
        console.log('Creo blob ListPage');
        let blob = new Blob([buffer], {type: 'application/pdf'});
        // Save the PDF to the data Directory of our App
        console.log(this.file.dataDirectory + pdfName);
        this.file.writeFile(this.file.dataDirectory, pdfName, blob, {replace: true}).then(fileEntry => {
          // Open the PDf with the correct OS tools
          if (openfile) {
            console.log('Open pdf ListPage');
            this.fileOpener.open(this.file.dataDirectory + pdfName, 'application/pdf');
          }
        })
      });
    } else {
      // On a browser simply use download!
      this.pdfObj.download();
    }
  }

  private getListado() {
    this.showLoading();
    this.webservice.download_pedidos_cliente(this.singleton.user.id)
      .then((res: any) => {
        console.log(res);
        if (res.message) {
          console.log(res.message);
          this.loading.dismiss();
          this.helper.presentToast(res.message);
        } else {
          this.pedidos_todos = res.pedidos;
          this.pedidos = this.pedidos_todos;
          setTimeout(() => { this.loading.dismiss(); }, 2500);
        }
      })
      .catch(err => {
        console.log(err);
        this.loading.dismiss();
        this.helper.presentToast(err);
      });
  }

  private removeItem(index) {
    this.showLoading();
    let obj = {fechaCancelado: moment().format('YYYY-MM-DD  HH:mm:ss')};
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

  // allowSlide(event) {
  //   if (!event.cancelable) {
  //     event.preventDefault();
  //   }
  // }

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

  deleteSelected() {
    if (confirm("Elimina pedidos seleccionados?")) {
      this.pedidos = this.pedidos.filter((item: any) => {
        return (item.seleccionado == false);
      });
    }
  }

  editItem(slidingItem: ItemSliding, index) {
    this.navCtrl.setRoot('home-page', {pedido_id: this.pedidos[index].id});
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
      this.navCtrl.setRoot('home-page', {pedido_id: this.pedidos[idx].id});
    } else {
      this.helper.presentToast('Seleccione un sólo item a editar.');
    }
  }

  getCantidad(datos) {
    let total: number = 0;
    for (let i = 0; i < datos.length; i++) {
      total += datos[i].cantidad;
    }
    return total;
  }

  getTotal(datos) {
    let total: number = 0;
    for (let i = 0; i < datos.length; i++) {
      total += datos[i].importe;
    }
    return total;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListPage');
    // this.base64.encodeFile('assets/imgs/logo.png')
    //   .then((base64File: string) => {
    //       console.log('base64File', base64File);
    //       return base64File;
    //     },(err) => { console.log(err); }
    //   );
    this.pageTitle = this.navParams.get('title');
    this.getListado();
    setTimeout(() => this.splash = true, 1000);
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

  onCancel(event) {
    this.pedidos = this.pedidos_todos;
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

  /*presentFiles(slidingItem: ItemSliding, index) {
    let id = this.pedidos[index].id;
    let adjuntosModal = this.modalCtrl.create('adjuntos-page', { pedido_id: id });
    //this.navCtrl.setRoot('home-page', { solicitudId: this.tomados[index].id });
    adjuntosModal.onDidDismiss(data => {
      console.log(data);
    });
    adjuntosModal.present();
  }*/

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

  sendToPdf() {
    for (let i = 0; i < this.pedidos.length; i++) {
      if (this.pedidos[i].seleccionado) {
        this.createPdf(i);
        this.downloadPdf(i, false);
      }
    }
  }

  toPDF(slidingItem: ItemSliding, index) {
    console.log('toPDF ListPage');
    this.createPdf(index);
    this.downloadPdf(index, true);
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

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Procesando...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

}
