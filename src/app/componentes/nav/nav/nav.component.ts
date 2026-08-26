import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {  UsuarioDatos } from 'src/app/modelos/resul-procesos/resul-procesos.modelos';
import { IntranetResulProcesosService } from 'src/app/services/intranet-resul-procesos.service';



@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  domain: any;
  user: any;
  cont: number = 1;
  usuarioObtenido: UsuarioDatos = new UsuarioDatos();

  //Estado del tema (claro / oscuro)
  darkMode: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver, private wsIntranet: IntranetResulProcesosService) { }

  ngOnInit(): void {
    //Cargar preferencia de tema guardada
    this.darkMode = localStorage.getItem('tema') === 'oscuro';
    this.aplicarTema();

    document.cookie = "user_eeasa=slopez; path=/;domain=" + document.domain.toString();

    //Regex que permite tomar el valor de la cookie user_eeasa
    var cookieuser_eaasa = document.cookie.replace(/(?:(?:^|.*;\s*)user_eeasa\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    this.user = cookieuser_eaasa;
    localStorage.setItem("usuario", this.user.toString());

    //Se comprueba si el cookie tenia un usuario
    if (localStorage.getItem('usuario') == '') {
      document.location.href = 'https://app.eeasa.com.ec/intranet#/';
    } else {
      // Se hará una llamada al servicio para obtener la información del usuario.
      this.wsIntranet.getInformacionUsuario(localStorage.getItem('usuario')).subscribe(
        (result: any) => { 
        this.usuarioObtenido = result;
        //Se verfica si el usuario es administrador, acceso a archivos, acceso a procesos
        if(!(this.usuarioObtenido.intranet_admin != "NO" || this.usuarioObtenido.intranet_archivos != "NO" || this.usuarioObtenido.intranet_procesos != "NO")){
          document.location.href = 'https://app.eeasa.com.ec/intranet#/';
        }
      });    
    }
  }

  ngAfterViewInit(){

  }

  //Devuelve las iniciales del usuario para el avatar de la cabecera
  get iniciales(): string {
    const nombre = (this.usuarioObtenido && this.usuarioObtenido.nombre_completo)
      ? this.usuarioObtenido.nombre_completo.trim() : '';
    if (!nombre) { return ''; }
    const partes = nombre.split(/\s+/).filter(p => p.length > 0);
    const primera = partes[0] ? partes[0].charAt(0) : '';
    const segunda = partes.length > 1 ? partes[1].charAt(0) : '';
    return (primera + segunda).toUpperCase();
  }

  ngOnReload() {
    if (this.cont != 1) {
      window.location.reload();
    }
    this.cont++;
  }

  //Alterna entre modo claro y oscuro y guarda la preferencia
  toggleTema() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('tema', this.darkMode ? 'oscuro' : 'claro');
    this.aplicarTema();
  }

  //Aplica (o quita) la clase de tema oscuro al body
  private aplicarTema() {
    if (this.darkMode) {
      document.body.classList.add('theme-dark');
    } else {
      document.body.classList.remove('theme-dark');
    }
  }

  //Cierra la sesión expira la cookie y borra la sesión de usuario
  cerrarSesion() {
    localStorage.removeItem("usuario");
    document.cookie = "user_eeasa=;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.reload();
  }

}
