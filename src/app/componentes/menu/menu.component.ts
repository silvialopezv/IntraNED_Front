import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Menu } from 'src/app/modelos/menu/menu.modelos';
import { IntranetMenuService } from 'src/app/services/intranet-menu.service';
import swal from 'sweetalert2';
import { ModalMenuComponent } from '../modal/modal-menu/modal-menu.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective | any;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  menu: Menu[] = [];

  constructor(private wsMenu: IntranetMenuService,
    private modalService: NgbModal) { }

    //Se dispara al llamar la página
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
        {width: "350px"},
        {width: "250px"},
        {width: "300px"},
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
       this.wsMenu.getMenu()
         .subscribe((result: any) => {
           this.menu = result;
           this.dtTrigger.next();
           console.log('estoy aqui');
         }, err => {
          console.log('estoy aca');
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
  openModalFormMenu() {
    this.modalService.open(ModalMenuComponent,
      {
        centered: true,
        size: 'md',
        backdrop: "static",
        keyboard: false
      }
    )
  }

  // // Método que abre el modal en modo actualizar
  openModalUpdateMenu(menu: Menu) {
    const modalRef = this.modalService.open(ModalMenuComponent,
      {
        centered: true,
        size: 'md',
        backdrop: "static",
        keyboard: false
      }
    )
    modalRef.componentInstance.actualizar = true;
    modalRef.componentInstance.menu = menu;
  }

  // // //Método que elimina el resultado seleccionado
  eliminarMenu(menu: Menu) {
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
      text: `¿Desea eliminar el menú ${menu.IMMEN_NOMBRE}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        //Acciones si confirma la eliminación
        this.wsMenu.deleteMenu(menu.IMMEN_CODIGO).subscribe(
          response => {
            this.menu = this.menu.filter(rMenu => rMenu !== menu)
            swalWithBootstrapButtons.fire(
              'Menú Eliminado',
              `Menú ${menu.IMMEN_NOMBRE} eliminado con éxito`,
              'success'
            )
            //Se refresca la tabla
            this.onGenerate();
          }, err => {
            //Acciones si ocurre un error
            swalWithBootstrapButtons.fire(
              'Menú no se ha eliminado correctamente',
              `Ocurrio un problema no se pudo eliminar el menú`,
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
