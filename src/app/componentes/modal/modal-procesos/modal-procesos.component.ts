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



import { THIS_EXPR, ThrowStmt } from '@angular/compiler/src/output/output_ast';
import { Component, Injectable, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { WebElementCondition } from 'selenium-webdriver';
import { Correo } from 'src/app/modelos/correo/correo.modelos';
import { ArchivoPrueba, Contratista, Departamento, Empleados, IntranetResolucionProceso, Proceso, ResolProceso, Respuesta } from 'src/app/modelos/resul-procesos/resul-procesos.modelos';
import { IntranetResulProcesosService } from 'src/app/services/intranet-resul-procesos.service';
import swal from 'sweetalert2';
declare var $: any;
import { Subject } from 'rxjs';
@Component({
  selector: 'app-modal-procesos',
  templateUrl: './modal-procesos.component.html',
  styleUrls: ['./modal-procesos.component.css'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class ModalProcesosComponent implements OnInit {
  @Input() proceso: ResolProceso;
  @Input() actualizar: boolean;
  resolucionSelect: IntranetResolucionProceso;
  listProceso: Proceso[] = [];
  resolucionProceso: IntranetResolucionProceso[] = [];
  departamento: Departamento[] = [];
  empleados: Empleados[] = [];
  contratistas: Contratista[] = [];
  procesosAux: Proceso[] = [];
  correo:Correo = new Correo(); 
  //resulOfertas: IntranetResulProceso[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  swalWithBootstrapButtons = swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: true,
    confirmButtonColor: "#052d6c"
  });

  rProceso: ResolProceso = new ResolProceso();
  archivo: ArchivoPrueba = new ArchivoPrueba();
  respuesta: Respuesta = new Respuesta();
  //Variables para la plantilla que genera el código
  codProceso: string;
  empresa: string = "EEASA";
  tipoProceso: string;



  constructor(public activeModal: NgbActiveModal,
    private wsIntranet: IntranetResulProcesosService) {
  }

  //Método que se dispara al inicar
  ngOnInit(): void {
    if (this.actualizar) {
      this.cargarSelect();
      this.cargarProceso();
    } else {
      this.cargarSelect();
      this.cargarNumeracion();
      //Asigna el año por defecto al año actual
      this.rProceso.INTRP_ANIO = new Date().getFullYear().toString();
    }

        //Definimos las opciones para el  datatable
        this.dtOptions = {
          pagingType: 'full_numbers',
          pageLength: 5,
          info: true,
          language: {
            "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
          },
          scrollX: false,
          scrollY: '400px',
          scrollCollapse: true,
          retrieve: true,
          destroy: true,
          order: [],
          responsive: true,
          columns: [
            { width: "50px" },
            { width: "100px" },
            { width: "170px" },
            { width: "160px" },
            { width: "80px" }],
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

    //Método que libera la suscripción
    ngOnDestroy(): void {
      // Do not forget to unsubscribe the event
      this.dtTrigger.unsubscribe();
    }
  
  //Método que se suscribe al servicio para insertar proceso
  crearProceso(): void {
    this.rProceso.INTRP_CODIGO = "PP5";
    //Muestra la barra de inserción
    this.crearCodigoLetra();
    this.mostrarBarraProgresoInsertar();
    this.wsIntranet.getComprobarproceso(this.rProceso.INTRP_CODIGOPROCESO).subscribe(
      result => {
        //Revisar if la condición se ejcuta al revés
        if (result.length == 0) {
          if(this.tipoProceso=='EEASA'){
            //Llamamos al servico de inserción
            this.wsIntranet.createResulProcesoCompleto(this.rProceso)
            .subscribe(
              result => {
                this.respuesta = result
                if (this.respuesta.MENSAJE == "TRUE") {
                  this.activeModal.close();
                  this.Alerta("Correcto", "Proceso creado correctamente", "success");
                } else {
              this.OcultarBarraProgresoInsertar();
                  this.Alerta("Error", "Proceso no se ha creado correctamente", "error");
                }
              }, err => {
                this.activeModal.close();
                this.Alerta("Error", "Problema con el servidor", "error");
              }
            );
          }else{
            this.wsIntranet.getComprobarprocesoNumero(String(this.rProceso.INTRP_NUMERO),String(this.rProceso.INTRP_ANIO)).subscribe(res=>{
            if(res.length==0){
              //Llamamos al servico de inserción
              this.wsIntranet.createResulProcesoCompleto(this.rProceso)
                .subscribe(
                  result => {
                    this.respuesta = result
                    if (this.respuesta.MENSAJE == "TRUE") {
                      this.activeModal.close();
                      this.Alerta("Correcto", "Proceso creado correctamente", "success");
                    } else {
                  this.OcultarBarraProgresoInsertar();
                      this.Alerta("Error", "Proceso no se ha creado correctamente", "error");
                    }
                  }, err => {
                    this.activeModal.close();
                    this.Alerta("Error", "Problema con el servidor", "error");
                  }
                );
            }else{
              console.log('Numero de Proceso ya registrado');
              this.OcultarBarraProgresoInsertar();
              let resultBoolean=false;
              for (let i=0; i<res.length;i++){
                let tpProceso="";
                
                this.listProceso.forEach(element => {
                  if (element.INTPR_CODIGO == res[i].INTPR_CODIGO) {
                    tpProceso=element.INTPR_TIPO;
                    console.log('entro aqui',tpProceso);
                  }
                });

                if(tpProceso=='CP'){
                  //verifico si es el mismo codigo de proceso
                  if(res[i].INTPR_CODIGO==this.rProceso.INTPR_CODIGO){
                    console.log('tipo de proceso iguales',res[i].INTPR_CODIGO,' ',this.rProceso.INTPR_CODIGO);
                    if(res[i].INTRP_LETRA==this.rProceso.INTRP_LETRA){
                      resultBoolean=false;
                      break;
                    }else{
                      resultBoolean=true;
                    }
                  }else{
                    console.log('tipo de proceso no iguales');
                    console.log('tipo de proceso iguales',res[i].INTRP_ANIO,' ',this.rProceso.INTRP_ANIO);
                    resultBoolean=false;
                    break;
                  }
                }else{
                  resultBoolean=true;
                }
              }



              if(resultBoolean){
                console.log('si se guarda');
                //Llamamos al servico de inserción
                this.wsIntranet.createResulProcesoCompleto(this.rProceso)
                .subscribe(
                  result => {
                    this.respuesta = result
                    if (this.respuesta.MENSAJE == "TRUE") {
                      this.activeModal.close();
                      this.Alerta("Correcto", "Proceso creado correctamente", "success");
                    } else {
                  this.OcultarBarraProgresoInsertar();
                      this.Alerta("Error", "Proceso no se ha creado correctamente", "error");
                    }
                  }, err => {
                    this.activeModal.close();
                    this.Alerta("Error", "Problema con el servidor", "error");
                  }
                );
              }else{
                this.Alerta("Error", "No puede utilizar este número de proceso", "error");
              }
            }
            });
          }
        } else {
          this.OcultarBarraProgresoInsertar();
          this.Alerta("Error", "Ya existe un proceso con este código", "error");
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
  actualizarProceso() {
    this.crearCodigoLetra();
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: true,
      confirmButtonColor: "#052d6c"
    })
    this.mostrarBarraProgresoActualizar();
    this.wsIntranet.updateResulProcesoCompleto(this.rProceso)
      .subscribe(
        result => {
          this.respuesta = result
          this.activeModal.close();
          if (this.respuesta.MENSAJE == "TRUE") {
            swalWithBootstrapButtons.fire(
              'Proceso Actualizado',
              `Proceso actualizado con éxito, refresque la tabla`,
              'success'
            )
          } else {

            swalWithBootstrapButtons.fire(
              'Error',
              `Proceso no se actualizo`,
              'error'
            )
          }

        }, err => {
          this.activeModal.close();
          swalWithBootstrapButtons.fire(
            'Error',
            `Proceso no se actualizo`,
            'error'
          )
        }
      );
  }

  //Método para cargar el proceso al modal para la actualización
  cargarProceso(): void {
    console.log('proceso',this.proceso);
    //Se asigna el valor de esta manera para evitar hacer cambios en el proceso que se obtiene del datatable mientras se actualiza
    this.rProceso.INTRP_CODIGO = this.proceso.INTRP_CODIGO;
    this.rProceso.INTPR_CODIGO = this.proceso.INTPR_CODIGO;
    this.rProceso.INTRP_NUMEROPROCESO = this.proceso.INTRP_NUMEROPROCESO;
    this.rProceso.INTDEP_CODIGO = this.proceso.INTDEP_CODIGO;
    this.rProceso.INTRP_TIPO_RESOLUCION = this.proceso.INTRP_TIPO_RESOLUCION;
    this.rProceso.INTRP_NUMOFICIO = this.proceso.INTRP_NUMOFICIO;
    this.rProceso.INTRP_FECHA_PUBLICACION = this.proceso.INTRP_FECHA_PUBLICACION;
    this.rProceso.INTRP_EMPRESA = this.proceso.INTRP_EMPRESA;
    this.rProceso.INTRP_OBSERVACION = this.proceso.INTRP_OBSERVACION;
    this.rProceso.INTRP_DETALLE = this.proceso.INTRP_DETALLE;
    this.rProceso.INTRP_FECHA_ADJ = this.proceso.INTRP_FECHA_ADJ;
    this.rProceso.MA_CONT_COD = this.proceso.MA_CONT_COD;
    this.rProceso.INTRES_CODIGO = this.proceso.INTRES_CODIGO;
    this.rProceso.INTRP_ANIO = this.proceso.INTRP_ANIO;
    this.rProceso.INTRP_DIRECCION = this.proceso.INTRP_DIRECCION;
    this.rProceso.DMPER_CODIGO = this.proceso.DMPER_CODIGO;
    this.rProceso.INTTP_CODIGO = this.proceso.INTTP_CODIGO;
    this.rProceso.INTEP_CODIGO = this.proceso.INTEP_CODIGO;
    this.rProceso.INTRP_VALOR_DESDE = this.proceso.INTRP_VALOR_DESDE;
    this.rProceso.INTRP_VALOR_HASTA = this.proceso.INTRP_VALOR_HASTA;
    this.rProceso.INTRP_VALOR_PRESUPUESTO = this.proceso.INTRP_VALOR_PRESUPUESTO;
    this.rProceso.INTRP_CODIGOPROCESO = this.proceso.INTRP_CODIGOPROCESO;

    this.rProceso.INTRP_NUMERO = this.proceso.INTRP_NUMERO;
    this.rProceso.INTRP_LETRA = this.proceso.INTRP_LETRA;
  }

  //Método para carga el select con ListProceso
  cargarListProceso() {
    this.wsIntranet.getProceso()
      .subscribe((result: any) => {
        this.listProceso = result;
        //console.log("lsiatdo",this.listProceso);
      });
  }

  //Método para carga el select con Resolucion Proceso
  cargarResolucion() {
    this.wsIntranet.getResolucionProceso()
      .subscribe((result: any) => {
        this.resolucionProceso = result;
      });
  }

  //Método que carga el select Departamentos
  cargarDepartamento() {
    this.wsIntranet.getDepartamento()
      .subscribe((result: any) => {
        this.departamento = result;
      });
  }

  //Método que carga el select Empleados
  cargarEmpleados() {
    this.wsIntranet.getEmpleados()
      .subscribe((result: any) => {
        this.empleados = result;
       // console.log(this.empleados);
      });
  }

  //Método que carga el select Contratista
  cargarContratista() {
    this.wsIntranet.getContratistas()
      .subscribe((result: any) => {
        console.log('contratistas',result);
        this.contratistas = result;
      });
  }

  //Método que carga llena todo los select del modal
  cargarSelect() {
    this.cargarResolucion();
    this.cargarDepartamento();
    this.cargarEmpleados();
    this.cargarContratista();
    this.cargarListProceso();
  }

  uploadFile(event) {
    //el tipo file se considera ya un tipo BLOB
    const file: File = event.target.files[0];
    var leer: FileReader = new FileReader();
    leer.readAsDataURL(file);
    leer.onload = () => {
      var datos = leer.result.toString().split(",");
      this.archivo.INTRP_ARCHIVO = datos[1];
      this.archivo.INTRP_NOM_ARCHIVO = file.name;
      this.rProceso.INTRP_ARCHIVO = datos[1];
      this.rProceso.INTRP_NOM_ARCHIVO = file.name;
    }
  }


  //Método para validar campos para ingreso
  validarCampos() {
    if (this.rProceso.INTRP_NUMEROPROCESO == "" || this.rProceso.INTRP_NUMEROPROCESO == null) { this.mostrarAlertaBotstrap("Ingrese el número de proceso"); }
    else if (this.rProceso.INTRP_FECHA_PUBLICACION == "" || this.rProceso.INTRP_FECHA_PUBLICACION == null) { this.mostrarAlertaBotstrap("Seleccione la fecha de publicación del proceso"); }
    else if (this.rProceso.INTRP_ANIO == "" || this.rProceso.INTRP_ANIO == null) { this.mostrarAlertaBotstrap("Ingrese el año"); }
    else if (this.rProceso.INTPR_CODIGO == "" || this.rProceso.INTPR_CODIGO == null) { this.mostrarAlertaBotstrap("Seleccione el tipo de proceso"); }
    else if (this.rProceso.INTRP_DETALLE == "" || this.rProceso.INTRP_DETALLE == null) { this.mostrarAlertaBotstrap("Ingrese el detalle"); }
    else {
      this.crearProceso();
    }
  }

  //Método para validar campos para actualizar
  validarCamposActualizar() {
    if (this.rProceso.INTRP_NUMEROPROCESO == "" || this.rProceso.INTRP_NUMEROPROCESO == null) { this.mostrarAlertaBotstrap("Ingrese el número de proceso"); }
    else if (this.rProceso.INTRP_FECHA_PUBLICACION == "" || this.rProceso.INTRP_FECHA_PUBLICACION == null) { this.mostrarAlertaBotstrap("Seleccione la fecha de publicación del proceso"); }
    else if (this.rProceso.INTRP_ANIO == "" || this.rProceso.INTRP_ANIO == null) { this.mostrarAlertaBotstrap("Ingrese el año"); }
    else if (this.rProceso.INTPR_CODIGO == "" || this.rProceso.INTPR_CODIGO == null) { this.mostrarAlertaBotstrap("Seleccione el tipo de proceso"); }
    else if (this.rProceso.INTRP_DETALLE == "" || this.rProceso.INTRP_DETALLE == null) { this.mostrarAlertaBotstrap("Ingrese el detalle"); }
    else {
      this.actualizarProceso();
    }
  }

  //Método que hace visible la alerta de advertencia de filtro(Angular Material)
  mostrarAlertaBotstrap(mensaje: string) {
    var x = document.getElementById("myAlert2");
    x.style.display = "block";
    $("#message").text(mensaje);
  }

  //Carga la abreviatura de del tipo de proceso para generar el codigo
  cargarAbreviaturaProceso(proceso) {

    this.listProceso.forEach(element => {
      if (element.INTPR_CODIGO == proceso) {
        this.codProceso = element.INTPRO_ABREV;
        this.tipoProceso=element.INTPR_TIPO;
        this.actualizarCodigoProceso();
      }
    });
  }

  //Actualiza el codigo de los procesos en caso de inserción
  actualizarCodigoProceso() {
    if (!this.actualizar) {
      if (this.codProceso != null && this.rProceso.INTRP_NUMEROPROCESO != null && this.rProceso.INTRP_NUMEROPROCESO != "" && this.rProceso.INTRP_ANIO != null) {
        this.rProceso.INTRP_CODIGOPROCESO = this.codProceso + "-" + this.empresa + "-" + this.rProceso.INTRP_NUMEROPROCESO + "-" + this.rProceso.INTRP_ANIO;
      }
    }
  }

  //Método que muestra la barra de progreso
  mostrarBarraProgresoInsertar() {
    var x = document.getElementById("progress");
    x.style.display = "block";
    $("#btnInsertar").prop('disabled', true);
    $("#btnCancelar").prop('disabled', true);
  }

  OcultarBarraProgresoInsertar() {
    var x = document.getElementById("progress");
    x.style.display = "none";
    $("#btnInsertar").prop('disabled', false);
    $("#btnCancelar").prop('disabled', false);
  }

  //Método que muestra la barra de progreso
  mostrarBarraProgresoActualizar() {
    var x = document.getElementById("progress");
    x.style.display = "block";
    $("#btnActualizar").prop('disabled', true);
    $("#btnCancelar").prop('disabled', true);
  }

  OcultarBarraProgresoActualizar() {
    var x = document.getElementById("progress");
    x.style.display = "none";
    $("#btnActualizar").prop('disabled', false);
    $("#btnCancelar").prop('disabled', false);
  }

  cargarNumeracion(){
    this.rProceso.INTRP_ANIO = new Date().getFullYear().toString();
    let maxnumero=0;
    this.wsIntranet.getobtenerMaxNumProceso(this.rProceso.INTRP_ANIO).subscribe(res=>{
      maxnumero = Number(res[0]['MNUMERO']) + 1;
      this.rProceso.INTRP_NUMEROPROCESO=String(maxnumero);
    console.log('este es el numero maximo',res[0]['MNUMERO']);
    });

  }
  crearCodigoLetra(){
    let a = this.rProceso.INTRP_NUMEROPROCESO
    let b = a.match(/\d+/g);
    let c =a.match(/[a-z]+/gi)
    //console.log('solo numeros',b[0])
    this.rProceso.INTRP_NUMERO= Number(b);
    this.rProceso.INTRP_LETRA= "";
    if(c!=undefined){
    //console.log('solo letras',c[0])
    this.rProceso.INTRP_LETRA=String(c);
   }
  }

  comprobar(){
    //this.crearCodigoLetra();
    //console.log(this.rProceso.INTRP_NUMERO);
    this.correo.destino='jtisalema@eeasa.com.ec';
    this.correo.asunto='Creación Proceso Portal Compras Publicas 3y';
    this.correo.mensaje='Se ha creado el proceso con códigoTCP-EEASA-901-2022 para descripción del proceso Responsable del Proceso nombre del empleado Jonathan';
    console.log(this.correo);
    console.log(this.wsIntranet.postEnviarCorreo(this.correo).subscribe(res=>{
     console.log(res); 
    }));
    //let a = this.rProceso.INTRP_NUMEROPROCESO
    //let b = a.match(/\d+/g);
    //let c =a.match(/[a-z]+/gi)
    //console.log('solo numeros',b[0])
    //if(c!=undefined){
    //console.log('solo letras',c[0])
   //}

  }

    //Método que oculta el spinner de carga
    ocultarSpinner() {
      var x = document.getElementById("spinnerLoading");
      if (x !== null) {
        x.style.display = "none";
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
