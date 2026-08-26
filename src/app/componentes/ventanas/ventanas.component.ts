import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Ventana } from 'src/app/modelos/ventanas/ventanas.modelos';
import { IntranetVentanasService } from 'src/app/services/intranet-ventanas.service';
import { ModalVentanasComponent } from '../modal/modal-ventanas/modal-ventanas.component';
import swal from 'sweetalert2';

@Component({
  selector: 'app-ventanas',
  templateUrl: './ventanas.component.html',
  styleUrls: ['./ventanas.component.css']
})
export class VentanasComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective | any;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  ventanas: Ventana[] = [];

  constructor(private wsVentana: IntranetVentanasService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
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
        {width: "100px"},
        {width: "100px"},
        {width: "100px"},
        {width: "250px"},
        {width: "300px"},
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
    this.mostrarSpinner();
    this.ocultarTabla();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    // Destroy the table first
       dtInstance.destroy();
       // Call the dtTrigger to rerender again
       this.wsVentana.getVentanas()
         .subscribe((result: any) => {
           this.ventanas = result;
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

  // Métodod que abre el modal en modo insertar
  openModalFormVentana() {
    this.modalService.open(ModalVentanasComponent,
      {
        centered: true,
        size: 'md',
        backdrop: "static",
        keyboard: false
      }
    )
  }

  // // Método que abre el modal en modo actualizar
  openModalUpdateVentana(ventana: Ventana) {
    const modalRef = this.modalService.open(ModalVentanasComponent,
      {
        centered: true,
        size: 'md',
        backdrop: "static",
        keyboard: false
      }
    )
    modalRef.componentInstance.actualizar = true;
    modalRef.componentInstance.ventana = ventana;
  }

  // //Método que elimina el resultado seleccionado
  eliminarVentana(ventana: Ventana) {
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
      text: `¿Desea eliminar la ventana ${ventana.IMVEN_NOMBRE}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        //Acciones si confirma la eliminación
        this.wsVentana.deleteVentana(ventana.IMVEN_CODIGO).subscribe(
          response => {
            this.ventanas = this.ventanas.filter(rVentana => rVentana !== ventana)
            swalWithBootstrapButtons.fire(
              'Ventana Eliminada',
              `Ventana ${ventana.IMVEN_NOMBRE} eliminada con éxito`,
              'success'
            )
            //Se refresca la tabla
            this.onGenerate();
          }, err => {
            //Acciones si ocurre un error
            swalWithBootstrapButtons.fire(
              'Ventana no se ha eliminado correctamente',
              `Ocurrio un problema no se pudo eliminar la ventana`,
              'error'
            )
          }
        )
      }
    })
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
