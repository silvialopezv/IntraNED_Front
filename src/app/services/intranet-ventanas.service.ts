import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Menu, Ventana } from '../modelos/ventanas/ventanas.modelos';

@Injectable({
  providedIn: 'root'
})
export class IntranetVentanasService {
  private url: string = 'http://localhost:7001/WSIntranetAD/rest/ventanas/';
  //private url: string = "https://app.eeasa.com.ec/WSIntranetAD/rest/ventanas/";

  private urlRequest: string = '';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  constructor(private httpClient:HttpClient) { }

  //Servicio que obtiene todas las ventanas
  getVentanas(): Observable<Ventana[]> {
    this.urlRequest = this.url + 'obtenerVentanas';
    return this.httpClient.get<Ventana[]>(this.urlRequest);
  }

  //Servicio que obtienen todos los menues
  getMenu(): Observable<Menu[]> {
    this.urlRequest = this.url + 'obtenerMenu';
    return this.httpClient.get<Menu[]>(this.urlRequest);
  }

  //Servicio que crea un nuevo registro de la tabla Ventana
  createVentana(ventana: any): Observable<any> {
    this.urlRequest = this.url + 'saveVentana';
    let rVentana = JSON.stringify([ventana])
    return this.httpClient.post<any>(this.urlRequest, rVentana, { headers: this.httpHeaders });
  }

  // Servicio que actualiza un registro de la tabla Ventana
  updateVentana(ventana: any): Observable<any> {
    this.urlRequest = this.url + 'updateVentana';
    let rVentana = JSON.stringify([ventana])
    return this.httpClient.put<any>(this.urlRequest, rVentana, { headers: this.httpHeaders });
  }

  //Servicio que elimina un regsitro de la tabla Ventana
  deleteVentana(id: string): Observable<Ventana> {
    this.urlRequest = this.url + 'deleteVentana';
    return this.httpClient.delete<Ventana>(`${this.urlRequest}/${id}`);
  }
}
