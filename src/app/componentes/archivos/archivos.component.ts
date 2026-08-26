import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ModalArchivosComponent } from '../modal/modal-archivos/modal-archivos.component';
import swal from 'sweetalert2';
import { Archivo, Ventana } from 'src/app/modelos/archivos/archivos.modelos';
import { IntranetArchivosService } from 'src/app/services/intranet-archivos.service';

@Component({
  selector: 'app-archivos',
  templateUrl: './archivos.component.html',
  styleUrls: ['./archivos.component.css']
})
export class ArchivosComponent implements OnInit,OnDestroy, AfterViewInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective | any;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  archivos: Archivo[] = [];
  ventanas: Ventana[] = [];
  ventanaFiltro: Ventana = new Ventana();


  constructor(private wsArchivo: IntranetArchivosService,
    private modalService: NgbModal) { }

  //Se dispara al llamar la página
  ngOnInit(): void {
    this.cargarOpcionesFiltro();
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
        {width: "350"},
        {width: "350"},
        {width: "100px"},
        {width: "150px"},
        {width: "150px"},
        {width: "150px"},
        {width: "150px"}],
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
    if (this.filtroValidacion()) {
      this.ocultarAlertaBootstrap();
      this.mostrarSpinner();
      this.ocultarTabla();
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        // Call the dtTrigger to rerender again
        this.wsArchivo.getArchivos(this.ventanaFiltro.IMVEN_CODIGO)
          .subscribe((result: any) => {
            this.archivos = result;
            this.dtTrigger.next();
            $("#ventanaFiltro").val(this.ventanaFiltro.IMVEN_NOMBRE);
          }, err => {
            //Redirigir a la pagina de error
            $("#ventanaFiltro").val("");
          });
      });
    } else {   
      this.mostrarAlertaBootstrap();
    }
  }

  //Método que libera la suscripción
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  //Método que carga los tipos de ventana al select
  cargarOpcionesFiltro() {
    this.wsArchivo.getVentanas()
      .subscribe((result: any) => {
        this.ventanas = result;
      }, err => {
        // Preparación del Sweet Alert
        const swalWithBootstrapButtons = swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
          },
          buttonsStyling: true,
          confirmButtonColor: "#052d6c"
        });
        //Acciones si ocurre un error
        swalWithBootstrapButtons.fire(
          'Error en el servidor',
          `Sucedio un problema al conectar con el servidor contacte al administrador`,
          'error'
        )
      });
  }

  // Métodod que abre el modal en modo insertar
  openModalFormProceso() {
    this.modalService.open(ModalArchivosComponent,
      {
        centered: true,
        size: 'md',
        backdrop: "static",
        keyboard: false
      }
    )
  }

  // Método que abre el modal en modo actualizar
  openModalUpdateProceso(archivo) {
    const modalRef = this.modalService.open(ModalArchivosComponent,
      {
        centered: true,
        size: 'md',
        backdrop: "static",
        keyboard: false
      }
    )
    modalRef.componentInstance.actualizar = true;
    modalRef.componentInstance.archivo = archivo;
  }

  //Método que elimina el resultado seleccionado
  eliminarArchivo(archivo) {
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
      text: `Desea eliminar el archivo ${archivo.IMARC_OBSERVACION}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        //Acciones si confirma la eliminación
        this.wsArchivo.deleteArchivo(archivo.IMARC_CODIGO).subscribe(
          response => {
            this.archivos = this.archivos.filter(rArchivo => rArchivo !== archivo)
            swalWithBootstrapButtons.fire(
              'Archivo Eliminado',
              `Archivo ${archivo.IMARC_OBSERVACION} eliminado con éxito`,
              'success'
            )
            //Se refresca la tabla
            this.onGenerate();
          }, err => {
            //Acciones si ocurre un error
            swalWithBootstrapButtons.fire(
              'Archivo no Eliminado',
              `Ocurrio un problema no se pudo eliminar el archivo`,
              'error'
            )
          }
        )
      }
    })
  }

  // //Controles para filtro
  filtroValidacion(): Boolean {
    if (this.ventanaFiltro.IMVEN_CODIGO != undefined) {
      return true;
    } else {
      return false;
    }
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