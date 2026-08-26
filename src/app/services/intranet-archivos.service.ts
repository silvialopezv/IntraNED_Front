import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Archivo, Ventana } from '../modelos/archivos/archivos.modelos';

@Injectable({
  providedIn: 'root'
})
export class IntranetArchivosService {
   private url: string = 'http://localhost:7001/WSIntranetAD/rest/archivos/';
  //private url: string = "https://app.eeasa.com.ec/WSIntranetAD/rest/archivos/";
  private urlRequest: string;
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private httpClient: HttpClient) { }

  //Servicio que recupera la lista de todos los archivos
  getArchivos(ventana:string):Observable<Archivo[]>{
    this.urlRequest = this.url + 'obtenerArchivos?ventana='+ventana;
    return this.httpClient.get<Archivo[]>(this.urlRequest);
  }

  //Servicio que obtiene la lista de ventanas
  getVentanas():Observable<Ventana[]>{
    this.urlRequest = this.url + 'obtenerVentanas';
    return this.httpClient.get<Ventana[]>(this.urlRequest);
  }

  //Servicio que crea un nuevo registro en la tabla archivo
  createArchivo(archivo: any): Observable<any> {
    this.urlRequest = this.url + 'saveArchivo';
    let rArchivo = JSON.stringify([archivo])
    return this.httpClient.post<any>(this.urlRequest, rArchivo, { headers: this.httpHeaders });
  }

  //Servicio que actualiza un registro de la tabla archivo
  updateArchivo(archivo: any): Observable<any> {
    this.urlRequest = this.url + 'updateArchivo';
    let rArchivo = JSON.stringify([archivo])
    return this.httpClient.put<any>(this.urlRequest, rArchivo, { headers: this.httpHeaders });
  }

  //Servicio que elimina un resgitro de la tabla archivo
  deleteArchivo(id: string): Observable<Archivo> {
    this.urlRequest = this.url + 'deleteArchivo';
    return this.httpClient.delete<Archivo>(`${this.urlRequest}/${id}`);
  }
}
