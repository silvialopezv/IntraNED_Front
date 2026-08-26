import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Menu } from '../modelos/menu/menu.modelos';

@Injectable({
  providedIn: 'root'
})
export class IntranetMenuService {
   private url: string = 'http://localhost:7001/WSIntranetAD/rest/menu/';
  //private url: string = "https://app.eeasa.com.ec/WSIntranetAD/rest/menu/";

  private urlRequest: string = '';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  
  constructor(private httpClient:HttpClient) { }

  //Servicio que obtiene los menues
  getMenu(): Observable<Menu[]> {
    this.urlRequest = this.url + 'obtenerMenu';
    return this.httpClient.get<Menu[]>(this.urlRequest);
  }

  //Servicio que crea un nuevo resgitro en la tabla Menu
  createMenu(menu: any): Observable<any> {
    this.urlRequest = this.url + 'saveMenu';
    let rMenu = JSON.stringify([menu])
    return this.httpClient.post<any>(this.urlRequest, rMenu, { headers: this.httpHeaders });
  }

  //Servico que comprueba si ya existe un menú con el mismo código
  getComprobarMenu(numeroMenu: string): Observable<Menu[]> {
    let params = new HttpParams();
    params = params.append('codigo', numeroMenu);
    this.urlRequest = this.url + 'comprobarMenu';
    return this.httpClient.get<Menu[]>(this.urlRequest, { params: params });
  }

  //Servicio que actualiza un registro de la tabla Menu
  updateMenu(menu: any): Observable<any> {
    this.urlRequest = this.url + 'updateMenu';
    let rMenu = JSON.stringify([menu])
    return this.httpClient.put<any>(this.urlRequest, rMenu, { headers: this.httpHeaders });
  }

  //Servicio que elimina un registro 
  deleteMenu(id: string): Observable<Menu> {
    this.urlRequest = this.url + 'deleteMenu';
    return this.httpClient.delete<Menu>(`${this.urlRequest}/${id}`);
  }
}
