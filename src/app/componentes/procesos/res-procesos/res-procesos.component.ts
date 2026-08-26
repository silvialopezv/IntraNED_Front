import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ModalProcesosComponent } from 'src/app/componentes/modal/modal-procesos/modal-procesos.component';
import { IntranetResulProceso, Proceso, ResolProceso } from 'src/app/modelos/resul-procesos/resul-procesos.modelos';
import { IntranetResulProcesosService } from 'src/app/services/intranet-resul-procesos.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';

@Component({
  selector: 'app-res-procesos',
  templateUrl: './res-procesos.component.html',
  styleUrls: ['./res-procesos.component.css']
})
export class ResProcesosComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective | any;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  resulProceso: IntranetResulProceso[] = [];
  listProceso: Proceso[] = [];

  //Variables que almacenan los datos del filtro
  tipoProceso: Proceso = new Proceso();
  anioParam: string = new Date().getFullYear().toString();

  constructor(private wsIntranet: IntranetResulProcesosService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.cargarOpcionesFiltro();
    //Definimos las opciones para el  datatable
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
      order: [],
      responsive: true,
      columns: [
        { width: "100px" },
        { width: "100px" },
        { width: "150px" },
        { width: "550px" },
        { width: "100px" },
        { width: "100px" },
        { width: "150px" },
        { width: "150px" },
        { width: "150px" }],
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
        this.wsIntranet.getResulProceso(this.anioParam, this.tipoProceso.INTPR_CODIGO)
          .subscribe((result: any) => {
            //console.log(result);
            this.resulProceso = result;
            this.dtTrigger.next();
            //Colocamos los valores de filtro en los campos de información de filtro
            $("#anioParam").val(this.anioParam);
            $("#tipoProceso").val(this.tipoProceso.INTPRO_DESCRIPCION);
          }, err => {
            //Limpiamos los campos de información de filtro
            $("#anioParam").val("");
            $("#tipoProceso").val("");
          });
      });
    } else {
      //Mostrar alerta de petición de campos para filtro 
      this.mostrarAlertaBootstrap();
    }
  }

  //Método para generar la tabla recibiendo los parametros dentro de la API data table
  onGenerateSinFiltro() {
    this.ocultarAlertaBootstrap();
    this.mostrarSpinner();
    this.ocultarTabla();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.wsIntranet.getResulProcesoSinFiltro()
        .subscribe((result: any) => {
          //console.log(result);
          this.resulProceso = result;
          this.dtTrigger.next();
          //Colocamos el valor "Sin filtro" en los campos de filtro
          $("#anioParam").val("Sin filtro");
          $("#tipoProceso").val("Sin filtro");
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

  //Método que carga los tipos de procesos a al select
  cargarOpcionesFiltro() {
    this.wsIntranet.getProceso()
      .subscribe((result: any) => {
        this.listProceso = result;
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
    this.modalService.open(ModalProcesosComponent,
      {
        centered: true,
        size: 'lg',
        backdrop: "static",
        keyboard: false
      }
    )
  }

  // Método que abre el modal en modo actualizar
  openModalUpdateProceso(proceso: ResolProceso) {
    console.log(proceso);
    const modalRef = this.modalService.open(ModalProcesosComponent,
      {
        centered: true,
        size: 'lg',
        backdrop: "static",
        keyboard: false
      }
    )
    modalRef.componentInstance.actualizar = true;
    modalRef.componentInstance.proceso = proceso;
  }

  //Método que elimina el resultado seleccionado
  eliminarResultProceso(proceso: IntranetResulProceso) {
    // Preparación del Sweet Alert
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
      text: `Desea eliminar el proceso ${proceso.INTRP_NUMEROPROCESO}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        //Se comprueba si el proceso ya contiene archivoos asignados en la tabla de trámite
        this.wsIntranet.getComprobarArchivoProceso(proceso.INTRP_CODIGO).subscribe(result => {
          //Se comprueba si la longitud de los archivos asociados para verificación
          if (result.length == 0) {
            //Acciones si confirma la eliminación
            this.wsIntranet.deleteResulProceso(proceso.INTRP_CODIGO).subscribe(
              response => {
                this.resulProceso = this.resulProceso.filter(rProceso => rProceso !== proceso)
                swalWithBootstrapButtons.fire(
                  'Proceso Eliminado',
                  `Proceso ${proceso.INTRP_NUMEROPROCESO} eliminado con éxito`,
                  'success'
                )
                //Se refresca la tabla
                this.onGenerate();
              }, err => {
                //Acciones si ocurre un error
                swalWithBootstrapButtons.fire(
                  'Proceso no se ha eliminado correctamente',
                  `Ocurrio un problema no se pudo eliminar el proceso`,
                  'error'
                )
              }
            )
          }else{
            swalWithBootstrapButtons.fire(
              'Proceso no se ha eliminado correctamente',
              `Ya existen archivos asociados a este proceso`,
              'error'
            )
          }
        })
      }
    })
  }

  //Controles para filtro
  filtroValidacion(): Boolean {
    //Se valida que los filtros para búsqueda no viajen con cadenas vacías y el año cumpla con la extensión de 4 dígitos
    if (this.anioParam !== "" && this.tipoProceso.INTPR_CODIGO != undefined) {
      if (this.anioParam.toString().length == 4) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  ///Método que oculta la alerta de advertencia de filtro
  ocultarAlertaBootstrap() {
    var x = document.getElementById("myAlert");
    if (x !== null) {
      x.style.display = "none";
    }
  }

  //Método que muestra la alerta de advertencia de filtro
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

