import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Comunicado } from 'src/app/modelos/comunicados/comunicados.modelo';
import { IntranetComunicadosService } from 'src/app/services/intranet-comunicados.service';
import { ModalComunicadosComponent } from '../modal/modal-comunicados/modal-comunicados.component';
import swal from 'sweetalert2';
import { Respuesta } from 'src/app/modelos/resul-procesos/resul-procesos.modelos';

@Component({
  selector: 'app-comunicados',
  templateUrl: './comunicados.component.html',
  styleUrls: ['./comunicados.component.css']
})
export class ComunicadosComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective | any;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  comunicados: Comunicado[] = [];
  respuesta: Respuesta = new Respuesta();
  // ventanas: Ventana[] = [];
  // ventanaFiltro: Ventana = new Ventana();


  constructor(private wsComunicados: IntranetComunicadosService,
    private modalService: NgbModal) { }

    //Se dispara al llamar la página
  ngOnInit(): void {
    // this.cargarOpcionesFiltro();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      info: true,
      language: {
        "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      scrollX: true,
      scrollY: '500px',
      scrollCollapse: true,
      retrieve: true,
      destroy: true,
      columns:[
        {width: "100px"},
        {width: "70px"},
        {width: "350px"},
        {width: "350px"},
        {width: "400px"},
        {width: "100px"},
        {width: "100px"},
        {width: "100px"},
        {width: "100px"}],
      drawCallback: () => {
        this.ocultarSpinner();
        this.mostrarTabla();
      }
    };
  }

  //Método que se dispara al terminar de generar la página
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  //Método para generar la tabla recibiendo los parametros dentro de la API data table
  onGenerate() {
    this.ocultarAlertaBootstrap();
    this.mostrarSpinner();
    this.ocultarTabla();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.wsComunicados.getComunicados()
        .subscribe((result: any) => {
          this.comunicados = result;
          this.dtTrigger.next();
        }, err => {
          //Redirigir a la pagina de error
        });
    });
  }

  //Método que libera la suscripción
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  // // Métodod que abre el modal en modo insertar
  openModalFormProceso() {
    this.modalService.open(ModalComunicadosComponent,
      {
        centered: true,
        size: 'lg',
        backdrop: "static",
        keyboard: false
      }
    )
  }

  // Método que abre el modal en modo actualizar
  openModalUpdateProceso(comunicado) {
    const modalRef = this.modalService.open(ModalComunicadosComponent,
      {
        centered: true,
        size: 'lg',
        backdrop: "static",
        keyboard: false
      }
    )
    modalRef.componentInstance.actualizar = true;
    modalRef.componentInstance.comunicado = comunicado;
  }

  //Método que elimina el resultado seleccionado
  eliminarArchivo(comunicado) {
    //Preparación del Sweet Alert
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: true,
      confirmButtonColor: "#052d6c",
      cancelButtonColor: "#AD1212",
      focusDeny: true,
      focusConfirm: false
    })

    // Ejecución del Sweet Alert
    swalWithBootstrapButtons.fire({
      title: '¿Está seguro?',
      text: `Desea eliminar el comunicado ${comunicado.IMCOM_TITULO}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        //Acciones si confirma la eliminación
        this.wsComunicados.deleteComunicado(comunicado.IMCOM_CODIGO).subscribe(
          response => {
            this.respuesta = response;
            if (this.respuesta.MENSAJE == "TRUE") {
              this.comunicados = this.comunicados.filter(rComunicado => rComunicado !== comunicado)
              swalWithBootstrapButtons.fire(
                'Comunicado Eliminado',
                `Comunicado ${comunicado.IMCOM_TITULO} eliminado con éxito`,
                'success'
              )
              //Se refresca la tabla
              this.onGenerate();
            } else {
              swalWithBootstrapButtons.fire(
                'Comunicado no Eliminado',
                `Ocurrio un problema no se pudo eliminar el comunicado`,
                'error'
              )
            }
          }, err => {
            //Acciones si ocurre un error
            swalWithBootstrapButtons.fire(
              'Comunicado no Eliminado',
              `Ocurrio un problema no se pudo eliminar el comunicado`,
              'error'
            )
          }
        )
      }
    })
  }


  //Método que hace visible la alerta de advertencia de filtro(Bootstrap)
  ocultarAlertaBootstrap() {
    var x = document.getElementById("myAlert");
    if (x !== null) {
      x.style.display = "none";
    }

  }

  //Método que oculta la alerta de advertencia de filtro
  mostrarAlertaBootstrap() {
    var x = document.getElementById("myAlert");
    if (x !== null) {
      x.style.display = "block";
    }
  }

  //Método que oculta el spinner de carga
  ocultarSpinner() {
    var x = document.getElementById("spinnerLoading");
    if (x !== null) {
      x.style.display = "none";
    }
  }

  //Método que muestra el spinner de carga
  mostrarSpinner() {
    var x = document.getElementById("spinnerLoading");
    if (x !== null) {
      x.style.display = "block";
    }
  }

  //Método que oculta la tabla
  ocultarTabla() {
    var x = document.getElementById("tabla");
    if (x !== null) {
      x.style.visibility = "hidden";
    }
  }

  //Método que muestra la tabla
  mostrarTabla() {
    var x = document.getElementById("tabla");
    if (x !== null) {
      x.style.visibility = "visible";
    }

  }

}
