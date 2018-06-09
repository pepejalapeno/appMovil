import { Component } from '@angular/core';
import {
  NavController,
  AlertController,
  LoadingController,
  Loading,
  Platform,
  ToastController
} from 'ionic-angular';

import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //lat: number = 19.533244;
  //lng: number = -99.159426;
  loading: Loading; //Objeto de Carga
  lat: number = 19.257927;
  lng: number = -99.173566;

  constructor(public navCtrl: NavController, 
    private alertCtrl: AlertController,
    private diagnostic: Diagnostic,
    private geolocation: Geolocation,
    private loadingCtrl: LoadingController,
    private platform: Platform,
    private toastCtrl: ToastController) {
  }

  private showLoading(){
    this.loading = this.loadingCtrl.create({
      content: 'Por favor espera...',
      dismissOnPageChange: true
    });
    this.loading.present()
  }

  private mostrarToast(texto:string){
    this.toastCtrl.create({
      message:texto,
      duration:3000
    }).present();
  }

  private displayMessage(err:string, title:string){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: err,
      buttons:[
        "Ok"
      ]
    });
    alert.present();
  }

  async buscarUbicacion(){
    //Es smartphone?
    if(!this.platform.is("cordova")){
      this.mostrarToast("No es un Smartphone")
      return;
    }
    //Mostrar Mensaje
    this.showLoading()
    try{
      let isAvailable = await this.diagnostic.isLocationEnabled()
      if(!isAvailable){
        this.loading.dismissAll()
        this.displayMessage('Activa tu GPS', 'Advertencia');
        return
      }else{
        let resp = await this.geolocation.getCurrentPosition()
        this.lat= resp.coords.latitude
        this.lng= resp.coords.longitude
        console.log(this.lat)
        console.log(this.lng)
        this.loading.dismissAll()
        return
      }
    }catch(err){
      this.loading.dismissAll()
      this.displayMessage('Ocurrió un error', 'Error interno del Sistema')
      return
    }
    
    //Verficamos si está activado el GPS
    /*this.diagnostic.isLocationEnabled().then(
      (isAvailable)=>{
        if(!isAvailable){
          this.loading.dismissAll()
          this.displayMessage('Activa tu GPS', 'Advertencia');
        }else{
          this.geolocation.getCurrentPosition().then(
            (resp)=>{
              this.lat= resp.coords.latitude
              this.lng= resp.coords.longitude
              console.log(this.lat)
              console.log(this.lng)
            }
          ).catch((error)=>{
            this.loading.dismissAll()
            this.displayMessage('Ocurrió un error', 'Error interno del Sistema')
          });
        }
      }
    ).catch((error)=>{
      this.loading.dismissAll()
      this.displayMessage('Ocurrió un error', 'Error interno del Sistema')
    });*/
  }

}
