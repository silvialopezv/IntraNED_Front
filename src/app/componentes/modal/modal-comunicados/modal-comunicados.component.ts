// Formato para el Datepicker
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {

  readonly DELIMITER = '/';

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10)
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
  }
}

// Formato para el Datepicker
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  readonly DELIMITER = "/";

  parse(value: string): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date
      ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year
      : "";
  }
}



import { Component, Injectable, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Comunicado } from 'src/app/modelos/comunicados/comunicados.modelo';
import { Respuesta } from 'src/app/modelos/resul-procesos/resul-procesos.modelos';
import { IntranetComunicadosService } from 'src/app/services/intranet-comunicados.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-modal-comunicados',
  templateUrl: './modal-comunicados.component.html',
  styleUrls: ['./modal-comunicados.component.css'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ]
})
export class ModalComunicadosComponent implements OnInit {

  @Input() comunicado: Comunicado;
  @Input() actualizar: boolean

  rComunicado: Comunicado = new Comunicado();
  respuesta: Respuesta = new Respuesta();


  constructor(public activeModal: NgbActiveModal,
    private wsComunicado:IntranetComunicadosService) { }

  //Método que se dispara al inicar
  ngOnInit(): void {
    if (this.actualizar) {
    this.cargarComunicado();
    }
  }

  //Método que se suscribe al servicio para insertar archivo
  crearComunicado(): void {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: true,
      confirmButtonColor: "#052d6c"
    })

    this.rComunicado.IMCOM_CODIGO = "PP5";
    this.rComunicado.IMCOM_USUARIO = localStorage.getItem("usuario");
    // this.wsIntranet.createResulProceso
    this.wsComunicado.createComunicado(this.rComunicado)
      .subscribe(
        result => {
          this.respuesta = result
          this.activeModal.close();
          if (this.respuesta.MENSAJE == "TRUE") {
            swalWithBootstrapButtons.fire(
              'Comunicado Creado',
              `Comunicado creado con éxito, refresque la tabla`,
              'success'
            )
          } else {
            swalWithBootstrapButtons.fire(
              'Error',
              `Comunicado no ha sido creado`,
              'error'
            )
          }
        }, err => {
          this.activeModal.close();
          swalWithBootstrapButtons.fire(
            'Error!',
            `Comunicado no ha sido creado`,
            'error'
          )
        }
      );
  }

  //Método que se suscribe al servicio para la actualización
  actualizarComunicado() {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: true,
      confirmButtonColor: "#052d6c"
    })
    this.wsComunicado.updateComunicado(this.rComunicado)
      .subscribe(
        result => {
          this.respuesta = result
          this.activeModal.close();
          if (this.respuesta.MENSAJE == "TRUE") {
            swalWithBootstrapButtons.fire(
              'Comunicado Actualizado',
              `Comunicado actualizado con éxito, refresque la tabla`,
              'success'
            )
          } else {
            swalWithBootstrapButtons.fire(
              'Error',
              `Comunicado no ha sido actualizado`,
              'error'
            )
          }
        }, err => {
          this.activeModal.close();
          swalWithBootstrapButtons.fire(
            'Error!',
            `Comunicado no ha sido actualizado`,
            'error'
          )
        }
      );
  }

  //Método para cargar el proceso al modal para la actualización
  cargarComunicado(): void {
    //Se asigna el valor de esta manera para evitar hacer cambios en el proceso que se obtiene del datatable mientras se actualiza
    this.rComunicado.IMCOM_CODIGO = this.comunicado.IMCOM_CODIGO;
    this.rComunicado.IMCOM_TITULO = this.comunicado.IMCOM_TITULO;
    this.rComunicado.IMCOM_DESCRIPCION = this.comunicado.IMCOM_DESCRIPCION;
    this.rComunicado.IMCOM_RESUMEN = this.comunicado.IMCOM_RESUMEN;
    this.rComunicado.IMCOM_ESTADO = this.comunicado.IMCOM_ESTADO;
    this.rComunicado.IMCOM_USUARIO = localStorage.getItem("usuario");
    this.rComunicado.IMCOM_FECHA = this.comunicado.IMCOM_FECHA;
    this.rComunicado.IMCOM_VIGENTE = this.comunicado.IMCOM_VIGENTE;  
  }

  //Método para validar campos para ingreso
  validarCampos() {
    if (this.rComunicado.IMCOM_TITULO == "" || this.rComunicado.IMCOM_TITULO == null) { this.mostrarAlertaBotstrap("Ingrese título del comunicado"); }
    else if (this.rComunicado.IMCOM_DESCRIPCION == "" || this.rComunicado.IMCOM_DESCRIPCION == null) { this.mostrarAlertaBotstrap("Ingrese descripción del comunicado"); }
    else if (this.rComunicado.IMCOM_RESUMEN == "" || this.rComunicado.IMCOM_RESUMEN == null) { this.mostrarAlertaBotstrap("Ingrese el resumen del comunicado"); }
    else if (this.rComunicado.IMCOM_VIGENTE == "" || this.rComunicado.IMCOM_VIGENTE == null) { this.mostrarAlertaBotstrap("Seleccione si el comunicado esta vigente"); }
    else {
      this.crearComunicado();
    }
  }

  //Método para validar campos para actualizar
  validarCamposActualizar() {
    if (this.rComunicado.IMCOM_TITULO == "" || this.rComunicado.IMCOM_TITULO == null) { this.mostrarAlertaBotstrap("Ingrese título del comunicado"); }
    else if (this.rComunicado.IMCOM_DESCRIPCION == "" || this.rComunicado.IMCOM_DESCRIPCION == null) { this.mostrarAlertaBotstrap("Ingrese descripción del comunicado"); }
    else if (this.rComunicado.IMCOM_RESUMEN == "" || this.rComunicado.IMCOM_RESUMEN == null) { this.mostrarAlertaBotstrap("Ingrese el resumen del comunicado"); }
    else if (this.rComunicado.IMCOM_VIGENTE == "" || this.rComunicado.IMCOM_VIGENTE == null) { this.mostrarAlertaBotstrap("Seleccione si el comunicado esta vigente"); }
    else {
      this.actualizarComunicado();
    }
  }

  //Método que hace visible la alerta de advertencia de filtro(Angular Material)
  mostrarAlertaBotstrap(mensaje: string) {
    var x = document.getElementById("myAlert2");
    x.style.display = "block";
    $("#message").text(mensaje);
  }

}
