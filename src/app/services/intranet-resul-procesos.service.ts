import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Correo } from '../modelos/correo/correo.modelos';
import { Contratista, Departamento, Empleados, IntranetResolucionProceso, IntranetResulProceso, Proceso, ResolProceso, UsuarioDatos } from '../modelos/resul-procesos/resul-procesos.modelos';

@Injectable({
  providedIn: 'root'
})
export class IntranetResulProcesosService {
   private url: string = 'http://localhost:7001/WSIntranetAD/rest/int_resul/'
  // private urlUsuarioCookie: string = 'http://localhost:7001/WSIntranet/rest/intranet/'
  //private url: string = "https://app.eeasa.com.ec/WSIntranetAD/rest/int_resul/";
  private urlUsuarioCookie: string = 'https://app.eeasa.com.ec/WSIntranet/rest/intranet/'
  private urlRequest: string = '';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private httpClient: HttpClient) { }

  //Servicio que obtiene los procesos filtrados por año y tipo de proceso
  getResulProceso(anio: string, tipoProceso: string): Observable<IntranetResulProceso[]> {
    let params = new HttpParams();
    params = params.append('anio', anio);
    params = params.append('tipoProceso', tipoProceso);
    this.urlRequest = this.url + 'obtenerResulProceso';
    return this.httpClient.get<IntranetResulProceso[]>(this.urlRequest, { params: params });
  }

  //Servicio que comprueba si un proceso con el código enviado ya existe
  getComprobarproceso(numeroProceso: string): Observable<IntranetResulProceso[]> {
    let params = new HttpParams();
    params = params.append('numeroProceso', numeroProceso);
    this.urlRequest = this.url + 'comprobarNumeroProceso';
    return this.httpClient.get<IntranetResulProceso[]>(this.urlRequest, { params: params });
  }

    //Servicio que comprueba si un proceso con el código enviado ya existe con intrp_numero
    getComprobarprocesoNumero(numeroProceso: string, anio: string): Observable<IntranetResulProceso[]> {
      let params = new HttpParams();
      params = params.append('numeroProceso', numeroProceso);
      params = params.append('anio', anio);
      console.log(params);
      this.urlRequest = this.url + 'comprobarNumeroProcesoNumero';
      return this.httpClient.get<IntranetResulProceso[]>(this.urlRequest, { params: params });
    }

    //Servicio que comprueba si un proceso con el numero enviado ya existe intrp_numero
    getobtenerMaxNumProceso(anio :string){
     // let params = new HttpParams();
     // params = params.append('numeroProceso', anio);
      this.urlRequest = this.url + 'obtenerMaxNumProceso/' + anio;
      return this.httpClient.get(this.urlRequest);
    }   

  //Servicio que comprueba si un proceso posee archivos referenciados en la tabla de trámite
  getComprobarArchivoProceso(numeroProceso: string): Observable<IntranetResulProceso[]> {
    let params = new HttpParams();
    params = params.append('numeroProceso', numeroProceso);
    this.urlRequest = this.url + 'comprobarArchivosProceso';
    return this.httpClient.get<IntranetResulProceso[]>(this.urlRequest, { params: params });
  }

  //Servicio que obtiene todos los registros 
  getResulProcesoSinFiltro(): Observable<IntranetResulProceso[]> {
    this.urlRequest = this.url + 'obtenerResulProcesoSinFiltro';
    return this.httpClient.get<IntranetResulProceso[]>(this.urlRequest);
  }

  //Servicio que obtiene los tipos de proceso
  getProceso(): Observable<Proceso[]> {
    this.urlRequest = this.url + 'obtenerProceso';
    return this.httpClient.get<Proceso[]>(this.urlRequest);
  }

  getResolucionProceso(): Observable<IntranetResolucionProceso[]> {
    this.urlRequest = this.url + 'obtenerResolucionProceso';
    return this.httpClient.get<IntranetResolucionProceso[]>(this.urlRequest);
  }

  // Servicio que obtiene los departamentos
  getDepartamento(): Observable<Departamento[]> {
    this.urlRequest = this.url + 'obtenerDepartamentoProceso';
    return this.httpClient.get<Departamento[]>(this.urlRequest);
  }

  // Servicio que obtiene la lista de empleados
  getEmpleados(): Observable<Empleados[]> {
    this.urlRequest = this.url + 'obtenerEmpleados';
    return this.httpClient.get<Empleados[]>(this.urlRequest);
  }

  // Servicio que obtiene los contratistas
  getContratistas(): Observable<Contratista[]> {
    this.urlRequest = this.url + 'obtenerContratista';
    return this.httpClient.get<Contratista[]>(this.urlRequest);
  }

  //Servicio que obtiene la resolución de un proceso
  getResProceso(id: any): Observable<ResolProceso> {
    this.urlRequest = this.url + 'obtenerResulProceso';
    return this.httpClient.get<ResolProceso>(`${this.urlRequest}/${id}`)
  }

  //Servicio que crea un nuevo registro
  createResulProceso(resulProceso: any): Observable<any> {
    this.urlRequest = this.url + 'saveProceso';
    let rProceso = JSON.stringify([resulProceso])
    return this.httpClient.post<any>(this.urlRequest, rProceso, { headers: this.httpHeaders });
  }

  //Servicio que elimina un registro
  deleteResulProceso(id: string): Observable<IntranetResulProceso> {
    this.urlRequest = this.url + 'deleteResulProceso';
    return this.httpClient.delete<IntranetResulProceso>(`${this.urlRequest}/${id}`);
  }

  //Servicio que actualiza un registro sin archivo
  updateResulProceso(resulProceso: any): Observable<any> {
    this.urlRequest = this.url + 'updateProceso';
    let rProceso = JSON.stringify([resulProceso])

    return this.httpClient.put<any>(this.urlRequest, rProceso, { headers: this.httpHeaders });
  }

  //Servicio que crea un nuevo registro con archivo
  createResulProcesoCompleto(resulProceso: any): Observable<any> {
    this.urlRequest = this.url + 'saveProcesoArchivoCompleto';
    let rProceso = JSON.stringify([resulProceso])
    return this.httpClient.post<any>(this.urlRequest, rProceso, { headers: this.httpHeaders });
  }

  //Servicio que actualiza un registro con archivo
  updateResulProcesoCompleto(resulProceso: any): Observable<any> {
    this.urlRequest = this.url + 'updateProcesoArchivoCompleto';
    let rProceso = JSON.stringify([resulProceso])
    return this.httpClient.put<any>(this.urlRequest, rProceso, { headers: this.httpHeaders });
  }

  //Servicio que obtiene la información del usuario obtenido através de la cookie
  getInformacionUsuario(usuario: string | null): Observable<UsuarioDatos> {
    this.urlRequest = this.urlUsuarioCookie + 'getUsuarioInformacion?inDsgus_cuenta='+usuario;
    return this.httpClient.get<UsuarioDatos>(this.urlRequest);
  }

  //Servicio que obtiene la resolución de un proceso
  getEnviarMail(): Observable<any> {
    this.urlRequest = this.url + 'enviarMail';
    return this.httpClient.get(this.urlRequest);
  }

    //Servicio para enviar el correo al empleado con el que se creo  el proceso
    postEnviarCorreo(correo: Correo) : Observable<any>{
      this.urlRequest = this.url + 'enviarCorreo';
      let ecorreo = JSON.stringify([correo])
      console.log(ecorreo);
      return this.httpClient.post(this.urlRequest, ecorreo, { headers: this.httpHeaders });
    }
}
