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
import { Archivo, Ventana } from 'src/app/modelos/archivos/archivos.modelos';
import { Respuesta } from 'src/app/modelos/resul-procesos/resul-procesos.modelos';
import { IntranetArchivosService } from 'src/app/services/intranet-archivos.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-modal-archivos',
  templateUrl: './modal-archivos.component.html',
  styleUrls: ['./modal-archivos.component.css'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ]
})

export class ModalArchivosComponent implements OnInit {
  @Input() archivo: Archivo;
  @Input() actualizar: boolean
  ventanas: Ventana[] = [];

  rArchivo: Archivo = new Archivo();
  respuesta: Respuesta = new Respuesta();


  constructor(public activeModal: NgbActiveModal,
    private wsArchivo: IntranetArchivosService) { }

  //Método que se dispara al inicar
  ngOnInit(): void {
    if (this.actualizar) {
      this.cargarSelect();
      this.cargarArchivo();
    } else {
      this.cargarSelect();
    }
  }

  //Método que se suscribe al servicio para insertar archivo
  crearArchivo(): void {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: true,
      confirmButtonColor: "#052d6c"
    })

    this.rArchivo.IMARC_CODIGO = "PP5";
    this.rArchivo.IMARC_USUARIO = localStorage.getItem("usuario");
    //Deshabilitar los botones para evitar clicks innecesarios
    this.mostrarBarraProgresoInsertar();
    this.wsArchivo.createArchivo(this.rArchivo)
      .subscribe(
        result => {
          this.respuesta = result
          this.activeModal.close();
          if (this.respuesta.MENSAJE == "TRUE") {
            swalWithBootstrapButtons.fire(
              'Archivo Creado',
              `Archivo creado con éxito, refresque la tabla`,
              'success'
            )
          } else {
            swalWithBootstrapButtons.fire(
              'Error',
              `Archivo no ha sido creado`,
              'error'
            )
          }
        }, err => {
          this.activeModal.close();
          swalWithBootstrapButtons.fire(
            'Error!',
            `Archivo no ha sido creado`,
            'error'
          )
        }
      );
  }

  //Método que se suscribe al servicio para la actualización
  actualizarArchivo() {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: true,
      confirmButtonColor: "#052d6c"
    })
    //Ocultar Botones
    this.mostrarBarraProgresoActualizar();
    this.wsArchivo.updateArchivo(this.rArchivo)
      .subscribe(
        result => {
          this.respuesta = result
          this.activeModal.close();
          if (this.respuesta.MENSAJE == "TRUE") {
            swalWithBootstrapButtons.fire(
              'Archivo Actualizado',
              `Archivo actualizado con éxito, refresque la tabla`,
              'success'
            )
          } else {
            swalWithBootstrapButtons.fire(
              'Error',
              `Archivo no ha sido actualizado`,
              'error'
            )
          }
        }, err => {
          this.activeModal.close();
          swalWithBootstrapButtons.fire(
            'Error!',
            `Archivo no ha sido actualizado`,
            'error'
          )
        }
      );
  }

  //Método para cargar el proceso al modal para la actualización
  cargarArchivo(): void {
    //Se asigna el valor de esta manera para evitar hacer cambios en el proceso que se obtiene del datatable mientras se actualiza
    this.rArchivo.IMARC_CODIGO = this.archivo.IMARC_CODIGO;
    this.rArchivo.IMVEN_CODIGO = this.archivo.IMVEN_CODIGO;
    this.rArchivo.IMARC_OBSERVACION = this.archivo.IMARC_OBSERVACION;
    this.rArchivo.IMARC_ESTADO = this.archivo.IMARC_ESTADO;
    this.rArchivo.IMARC_USUARIO = localStorage.getItem("usuario");
    this.rArchivo.IMARC_FECHA = this.archivo.IMARC_FECHA;
    this.rArchivo.IMARC_VIGENTE = this.archivo.IMARC_VIGENTE;

  }

  //Método para carga el select con ventanas
  cargarVentanas() {
    this.wsArchivo.getVentanas()
      .subscribe((result: any) => {
        this.ventanas = result;
      });
  }

  // //Método que carga llena todo los select del modal
  cargarSelect() {
    this.cargarVentanas();
  }

  uploadFile(event) {
    //el tipo file se considera ya un tipo BLOB
    const file: File = event.target.files[0];
    var leer: FileReader = new FileReader();
    leer.readAsDataURL(file);
    leer.onload = () => {
      var datos = leer.result.toString().split(",");
      this.rArchivo.IMARC_ARCHIVO = datos[1];
      this.rArchivo.IMARC_DESCRIPCION = file.name;
      // this.rProceso.INTRP_ARCHIVO = datos[1];
      // this.rProceso.INTRP_NOM_ARCHIVO = file.name;
    }
  }


  // Método para validar campos para ingreso
  validarCampos() {
    if (this.rArchivo.IMVEN_CODIGO == "" || this.rArchivo.IMVEN_CODIGO == null) { this.mostrarAlertaBotstrap("Seleccione la categoria del archivo"); }
    else if (this.rArchivo.IMARC_OBSERVACION == "" || this.rArchivo.IMARC_OBSERVACION == null) { this.mostrarAlertaBotstrap("Ingrese la descripción del archivo"); }
    else if (this.rArchivo.IMARC_ESTADO == "" || this.rArchivo.IMARC_ESTADO == null) { this.mostrarAlertaBotstrap("Seleccione si el archivo esta activo"); }
    else if (this.rArchivo.IMARC_VIGENTE == "" || this.rArchivo.IMARC_VIGENTE == null) { this.mostrarAlertaBotstrap("Seleccione si el archivo esta vigente"); }
    else {
      this.crearArchivo();
    }
  }

  //Método para validar campos para actualizar
  validarCamposActualizar() {
    if (this.rArchivo.IMVEN_CODIGO == "" || this.rArchivo.IMVEN_CODIGO == null) { this.mostrarAlertaBotstrap("Seleccione la categoria del archivo"); }
    else if (this.rArchivo.IMARC_OBSERVACION == "" || this.rArchivo.IMARC_OBSERVACION == null) { this.mostrarAlertaBotstrap("Ingrese la descripción del archivo"); }
    else if (this.rArchivo.IMARC_ESTADO == "" || this.rArchivo.IMARC_ESTADO == null) { this.mostrarAlertaBotstrap("Seleccione si el archivo esta activo"); }
    else if (this.rArchivo.IMARC_VIGENTE == "" || this.rArchivo.IMARC_VIGENTE == null) { this.mostrarAlertaBotstrap("Seleccione si el archivo esta vigente"); }
    else {
      this.actualizarArchivo();
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
