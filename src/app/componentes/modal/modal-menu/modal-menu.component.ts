import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Menu } from 'src/app/modelos/menu/menu.modelos';
import { Respuesta } from 'src/app/modelos/resul-procesos/resul-procesos.modelos';
import { IntranetMenuService } from 'src/app/services/intranet-menu.service';
import swal from 'sweetalert2';
@Component({
  selector: 'app-modal-menu',
  templateUrl: './modal-menu.component.html',
  styleUrls: ['./modal-menu.component.css']
})
export class ModalMenuComponent implements OnInit {

  @Input() menu: Menu;
  @Input() actualizar: boolean;
  rMenu: Menu = new Menu();
  respuesta: Respuesta = new Respuesta();
  swalWithBootstrapButtons = swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: true,
    confirmButtonColor: "#052d6c"
  });
  constructor(public activeModal: NgbActiveModal,
    private wsMenu: IntranetMenuService) {
  }


  ngOnInit(): void {
    if (this.actualizar) {
      this.cargarMenu();
    }
  }
  cargarMenu() {
    this.rMenu.IMMEN_CODIGO = this.menu.IMMEN_CODIGO;
    this.rMenu.IMMEN_NOMBRE = this.menu.IMMEN_NOMBRE;
    this.rMenu.IMMEN_ESTADO = this.menu.IMMEN_ESTADO;
    this.rMenu.IMMEN_USUARIO = this.menu.IMMEN_USUARIO;
    this.rMenu.IMMEN_FECHA = this.menu.IMMEN_FECHA;
  }


    //Método que se suscribe al servicio para insertar proceso
    crearMenu(): void {
      //Muestra la barra de inserción
      this.rMenu.IMMEN_USUARIO = localStorage.getItem("usuario");
      this.mostrarBarraProgresoInsertar();
      this.wsMenu.getComprobarMenu(this.rMenu.IMMEN_CODIGO).subscribe(
        result => {
          //Revisar if la condición se ejcuta al revés
          if (result.length == 0) {
            //Llamamos al servico de inserción
            this.wsMenu.createMenu(this.rMenu)
              .subscribe(
                result => {
                  this.respuesta = result
                  if (this.respuesta.MENSAJE == "TRUE") {
                    this.activeModal.close();
                    this.Alerta("Correcto", "Menú creado correctamente", "success");
                  } else {
                    this.ocultarBarraProgresoInsertar();
                    this.Alerta("Error", "Menú no se ha creado correctamente", "error");
                  }
                }, err => {
                  this.activeModal.close();
                  this.Alerta("Error", "Problema con el servidor", "error");
                }
              );
          } else {
            this.ocultarBarraProgresoInsertar();
            this.Alerta("Error", "Ya existe un menú con este código", "error");
          }
        }
      );
  
    }
  
    Alerta(titulo: string, mensaje: string, icono) {
      this.swalWithBootstrapButtons.fire(
        titulo,
        mensaje,
        icono
      );
    }

  //Método que se suscribe al servicio para la actualización
  actualizarMenu() {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: true,
      confirmButtonColor: "#052d6c"
    })
    //Ocultar Botones
    this.rMenu.IMMEN_USUARIO = localStorage.getItem("usuario");
    this.mostrarBarraProgresoActualizar();
    this.wsMenu.updateMenu(this.rMenu)
      .subscribe(
        result => {
          this.respuesta = result
          this.activeModal.close();
          if (this.respuesta.MENSAJE == "TRUE") {
            swalWithBootstrapButtons.fire(
              'Menú Actualizado',
              `Menú actualizado con éxito, refresque la tabla`,
              'success'
            )
          } else {
            swalWithBootstrapButtons.fire(
              'Error',
              `Menú no ha sido actualizado`,
              'error'
            )
          }
        }, err => {
          this.activeModal.close();
          swalWithBootstrapButtons.fire(
            'Error!',
            `Menú no ha sido actualizado`,
            'error'
          )
        }
      );
  }

  // Método para validar campos para ingreso
  validarCampos() {
    if (this.rMenu.IMMEN_CODIGO == "" || this.rMenu.IMMEN_CODIGO == null) { this.mostrarAlertaBotstrap("Ingrese el código del menú"); }
    else if (this.rMenu.IMMEN_NOMBRE == "" || this.rMenu.IMMEN_NOMBRE == null) { this.mostrarAlertaBotstrap("Ingrese el nombre del menú"); }
    else if (this.rMenu.IMMEN_ESTADO == "" || this.rMenu.IMMEN_ESTADO == null) { this.mostrarAlertaBotstrap("Seleccione el estado del menú"); }
    else {
      this.crearMenu();
    }
  }

  //Método para validar campos para actualizar
  validarCamposActualizar() {
    if (this.rMenu.IMMEN_CODIGO == "" || this.rMenu.IMMEN_CODIGO == null) { this.mostrarAlertaBotstrap("Ingrese el código del menú"); }
    else if (this.rMenu.IMMEN_NOMBRE == "" || this.rMenu.IMMEN_NOMBRE == null) { this.mostrarAlertaBotstrap("Ingrese el nombre del menú"); }
    else if (this.rMenu.IMMEN_ESTADO == "" || this.rMenu.IMMEN_ESTADO == null) { this.mostrarAlertaBotstrap("Seleccione el estado del menú"); }
    else {
      this.actualizarMenu();
    }
  }

  //Método que hace visible la alerta de advertencia de filtro(Angular Material)
  mostrarAlertaBotstrap(mensaje: string) {
    var x = document.getElementById("myAlert2");
    x.style.display = "block";
    $("#message").text(mensaje);
  }

  //Método que muestra la barra de progreso
  mostrarBarraProgresoInsertar() {
    var x = document.getElementById("progress");
    x.style.display = "block";
    $("#btnInsertar").prop('disabled', true);
    $("#btnCancelar").prop('disabled', true);
  }

  //Método que muestra la barra de progreso
  mostrarBarraProgresoActualizar() {
    var x = document.getElementById("progress");
    x.style.display = "block";
    $("#btnActualizar").prop('disabled', true);
    $("#btnCancelar").prop('disabled', true);
  }

  //Método que oculta la barra de progreso
  ocultarBarraProgresoInsertar() {
    var x = document.getElementById("progress");
    x.style.display = "none";
  }

}
