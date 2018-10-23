import { Component } from '@angular/core';
import { IonicPage, LoadingController, Loading, NavController } from 'ionic-angular';
import * as moment from 'moment';
import { HelperProvider } from '../../providers/helper/helper';
import { SingletonProvider } from '../../providers/singleton/singleton';
import { WebserviceProvider } from '../../providers/webservice/webservice';

@IonicPage({
  name: 'home-page'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  loading: Loading;
  clientes: any[] = [];
  datos: any = [];
  productos: any[] = [];
  pedido = {
    fecha: moment().format('YYYY-MM-DD HH:mm:ss'),
    canal: 5,
    cliente_id: 0,
    productos: [],
    user_id: 0
  };

  constructor(public helper: HelperProvider, private loadingCtrl: LoadingController, public navCtrl: NavController, public singleton: SingletonProvider, public webservice: WebserviceProvider) {

  }

  /**
   *
   * @param idx Indice del elemento en this.datos.productos
   * @param event
   */
  addProductoToPedido(idx, event) {
    this.datos.productos[idx].seleccionado = event.checked;
    this.productos[idx].seleccionado = event.checked;
    if (event.checked) {
      let producto = {
        articulo_id: this.productos[idx].id,
        presentacion_id: this.productos[idx].presentacion_id,
        /** producto
         * Codigo, nombre y presentación del producto.
         * Codigo: COD-articulo_id-presentacion_articulo_id
         * Ej: COD-1-1 Caña de mosca #5 x unidad
         */
        producto: 'COD-' + this.productos[idx].id + '-' + this.productos[idx].presentacion_id + ' ' + this.productos[idx].nombre,
        cantidad: (parseInt(this.productos[idx].cantidad) || 1),
        precio_id: this.productos[idx].precio_id,
        precio: this.productos[idx].precio,
      };
      this.pedido.productos.push(producto);
      //this.datos.productos[idx].cantidad = producto.cantidad;
    } else {
      this.datos.productos[idx].cantidad = null;
      for (let i = 0; i < this.pedido.productos.length; i++) {
        if (this.pedido.productos[i].articulo_id == this.datos.productos[idx].id && this.pedido.productos[i].presentacion_id == this.datos.productos[idx].presentacion_id) {
          this.pedido.productos.splice(i,1);
          break;
        }
      }
      // alert(JSON.stringify(this.pedido.productos));
    }
  }

  /*checkProductoSeleccionado(producto_id, presentacion_id) {
    if (this.pedido.productos.length) {
      for(let idx = 0; idx < this.pedido.productos.length; idx++) {
        if (this.pedido.productos[idx].id === producto_id && this.pedido.productos[idx].presentacion_id === presentacion_id) {
          return true;
        }
      }
    }
    return false;
  }*/

  findClientes(ev: any) {
    // Set val to the value of the searchbar
    let val = ev.target.value;

    // If the value is an empty string don't filter the items
    if (val && val.trim() !== '') {
      this.clientes = this.datos.clientes.filter((cliente: any) => {
        return (cliente.apellido.toLowerCase().indexOf(val.toLowerCase()) > -1 || cliente.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    } else {
      // Reset items back to all of the items
      this.clientes = this.datos.clientes;
    }
  }

  findProductos(ev: any) {
    // Reset items back to all of the items
    // this.productos = this.datos.productos;

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() !== '') {
      this.productos = this.datos.productos.filter((producto: any) => {
        return ((producto.marca && producto.marca.toLowerCase().indexOf(val.toLowerCase()) > -1) || producto.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          producto.presentacion.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    } else {
      // Reset items back to all of the items
      this.productos = this.datos.productos;
    }

    for(let idx = 0; idx < this.pedido.productos.length; idx++) {
      for(let i = 0; i < this.productos.length; i++) {
        if (this.pedido.productos[idx].articulo_id === this.productos[i].id && this.pedido.productos[idx].presentacion_id === this.productos[i].presentacion_id) {
          this.productos[i].cantidad = this.pedido.productos[idx].cantidad;
        }
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.showLoading();
    this.webservice.download(this.singleton.user.id)
      .then((res: any) => {
        console.log(res);
        if (res.message) {
          console.log(res.message);
          this.helper.presentToast(res.message);
        } else {
          this.datos = res;
          for (let i = 0; i < this.datos.productos.length; i++) {
            this.datos.productos[i].cantidad = null;
            this.datos.productos[i].seleccionado = false;
          }
          this.clientes = this.datos.clientes;
          this.productos = this.datos.productos;
          this.pedido.user_id = this.singleton.user.id;
        }
      })
      .catch(err => {
        console.log(err);
        this.helper.presentToast(err);
      });
    this.loading.dismiss();
  }

  savePedido() {
    this.showLoading();
    this.pedido.user_id = this.singleton.user.id;
    this.webservice.post('/pedido/create', this.pedido)
      .then((res: any) => {
        // console.log('GCL - Imprimo objeto res del savePedido');
        // console.log(res);
        if (res.message) {
          // console.log(res.message);
          this.helper.presentToast(res.message);
          // TODO: Cambiar this.navCtrl.setRoot('home-page'); por this.navCtrl.setRoot('list-page', {'cliente_id': this.pedido.cliente_id});
          this.navCtrl.setRoot('home-page');
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
