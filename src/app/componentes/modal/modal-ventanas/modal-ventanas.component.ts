import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Respuesta } from 'src/app/modelos/resul-procesos/resul-procesos.modelos';
import { Menu, Ventana } from 'src/app/modelos/ventanas/ventanas.modelos';
import { IntranetVentanasService } from 'src/app/services/intranet-ventanas.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-modal-ventanas',
  templateUrl: './modal-ventanas.component.html',
  styleUrls: ['./modal-ventanas.component.css']
})
export class ModalVentanasComponent implements OnInit {
  @Input() ventana: Ventana;
  @Input() actualizar: boolean;
  rVentana: Ventana = new Ventana();
  respuesta: Respuesta = new Respuesta();
  menus: Menu[] = [];
  constructor(public activeModal: NgbActiveModal,
    private wsVentana: IntranetVentanasService) {
  }


  ngOnInit(): void {
    if (this.actualizar) {
      this.cargarMenu();
      this.cargarVentana();
    } else {
      this.cargarMenu();
    }
  }
  cargarVentana() {
    this.rVentana.IMVEN_CODIGO = this.ventana.IMVEN_CODIGO;
    this.rVentana.IMMEN_CODIGO = this.ventana.IMMEN_CODIGO;
    this.rVentana.IMVEN_NOMBRE = this.ventana.IMVEN_NOMBRE;
    this.rVentana.IMVEN_ESTADO = this.ventana.IMVEN_ESTADO;
    this.rVentana.IMVEN_FECHA = this.ventana.IMVEN_FECHA;
    this.rVentana.IMVEN_USUARIO = this.ventana.IMVEN_USUARIO;
  }

  cargarMenu() {
    this.wsVentana.getMenu().subscribe(
      (result) => {
        this.menus = result;
      }
    );
  }

  //Método que se suscribe al servicio para insertar archivo
  crearVentana(): void {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: true,
      confirmButtonColor: "#052d6c"
    })

    this.rVentana.IMVEN_CODIGO = "PP5";
    this.rVentana.IMVEN_USUARIO = localStorage.getItem("usuario");
    //Deshabilitar los botones para evitar clicks innecesarios
    this.mostrarBarraProgresoInsertar();
    this.wsVentana.createVentana(this.rVentana)
      .subscribe(
        result => {
          this.respuesta = result
          this.activeModal.close();
          if (this.respuesta.MENSAJE == "TRUE") {
            swalWithBootstrapButtons.fire(
              'Ventana Creado',
              `Ventana creado con éxito, refresque la tabla`,
              'success'
            )
          } else {
            swalWithBootstrapButtons.fire(
              'Error',
              `Ventana no ha sido creado`,
              'error'
            )
          }
        }, err => {
          this.activeModal.close();
          swalWithBootstrapButtons.fire(
            'Error',
            `Ventana no ha sido creado`,
            'error'
          )
        }
      );
  }

  //Método que se suscribe al servicio para la actualización
  actualizarVentana() {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: true,
      confirmButtonColor: "#052d6c"
    })
    //Ocultar Botones
    this.rVentana.IMVEN_USUARIO = localStorage.getItem("usuario");
    this.mostrarBarraProgresoActualizar();
    this.wsVentana.updateVentana(this.rVentana)
      .subscribe(
        result => {
          this.respuesta = result
          this.activeModal.close();
          if (this.respuesta.MENSAJE == "TRUE") {
            swalWithBootstrapButtons.fire(
              'Ventana Actualizada',
              `Ventana actualizada con éxito, refresque la tabla`,
              'success'
            )
          } else {
            swalWithBootstrapButtons.fire(
              'Error',
              `Ventana no ha sido actualizado`,
              'error'
            )
          }
        }, err => {
          this.activeModal.close();
          swalWithBootstrapButtons.fire(
            'Error!',
            `Ventana no ha sido actualizado`,
            'error'
          )
        }
      );
  }

  // Método para validar campos para ingreso
  validarCampos() {
    if (this.rVentana.IMVEN_NOMBRE == "" || this.rVentana.IMVEN_NOMBRE == null) { this.mostrarAlertaBotstrap("Ingrese el nombre de la ventana"); }
    else if (this.rVentana.IMMEN_CODIGO == "" || this.rVentana.IMMEN_CODIGO == null) { this.mostrarAlertaBotstrap("Seleccione el menu al que pertenece la ventana"); }
    else if (this.rVentana.IMVEN_ESTADO == "" || this.rVentana.IMVEN_ESTADO == null) { this.mostrarAlertaBotstrap("Seleccione si el archivo esta activo"); }
    else {
      this.crearVentana();
    }
  }

  //Método para validar campos para actualizar
  validarCamposActualizar() {
    if (this.rVentana.IMVEN_NOMBRE == "" || this.rVentana.IMVEN_NOMBRE == null) { this.mostrarAlertaBotstrap("Ingrese el nombre de la ventana"); }
    else if (this.rVentana.IMMEN_CODIGO == "" || this.rVentana.IMMEN_CODIGO == null) { this.mostrarAlertaBotstrap("Seleccione el menu al que pertenece la ventana"); }
    else if (this.rVentana.IMVEN_ESTADO == "" || this.rVentana.IMVEN_ESTADO == null) { this.mostrarAlertaBotstrap("Seleccione si el archivo esta activo"); }
    else {
      this.actualizarVentana();
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
  ocultarBarraProgreso() {
    var x = document.getElementById("progress");
    x.style.display = "none";
  }

}
