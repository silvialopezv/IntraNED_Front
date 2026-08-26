import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comunicado } from '../modelos/comunicados/comunicados.modelo';

@Injectable({
  providedIn: 'root'
})
export class IntranetComunicadosService {
   private url: string = 'http://localhost:7001/WSIntranetAD/rest/comunicados/';
  //private url: string = "https://app.eeasa.com.ec/WSIntranetAD/rest/comunicados/";

  private urlRequest: string = '';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  constructor(private httpClient:HttpClient) { }

  //Servicio que obtiene todos los comunicados
  getComunicados(): Observable<Comunicado[]> {
    this.urlRequest = this.url + 'obtenerComunicados';
    return this.httpClient.get<Comunicado[]>(this.urlRequest);
  }
  
  //servicio que crea un nuevo registro en la tabla Comunicado
  createComunicado(comunicado: any): Observable<any> {
    this.urlRequest = this.url + 'saveComunicado';
    let rComunicado = JSON.stringify([comunicado])
    return this.httpClient.post<any>(this.urlRequest, rComunicado, { headers: this.httpHeaders });
  }

  //Servicio que actualiza un registro de la tabla Comunicado
  updateComunicado(comunicado: any): Observable<any> {
    this.urlRequest = this.url + 'updateComunicado';
    let rComunicado = JSON.stringify([comunicado])

    return this.httpClient.put<any>(this.urlRequest, rComunicado, { headers: this.httpHeaders });
  }

  //Servicio que elimina un registro de la tabla Comunicado
  deleteComunicado(id: string): Observable<any> {
    this.urlRequest = this.url + 'deleteComunicado';
    return this.httpClient.delete<any>(`${this.urlRequest}/${id}`);
  }
}
