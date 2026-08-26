import { ShorthandPropertyAssignment } from "typescript";

//Modelos de datos para el módulo de Resolución de procesos
export class IntranetResulProceso {
  INTRP_CODIGO!: string;
  INTPR_CODIGO!: string;
  INTRP_NUMEROPROCESO!: string;
  INTDEP_CODIGO!: string;
  INTRP_TIPO_RESOLUCION!: string;
  INTRP_NUMOFICIO!: string;
  INTRP_FECHA_PUBLICACION!: string;
  INTRP_EMPRESA!: string;
  INTRP_NUMCONTRATO!: string;
  INTRP_OBSERVACION!: string;
  INTRP_DETALLE!: string;
  INTRP_NUMTRAMITE!: string;
  INTRP_FECHA_ADJ!: string;
  INTRP_FECHA_CONTRATO!: string;
  MA_CONT_COD!: string;
  INTRES_CODIGO!: number;
  INTRP_ANIO!: number;
  INTRP_DIRECCION!: string;
  INTRP_VALORCONT!: number;
  DMPER_CODIGO!: string;
  INTTP_CODIGO!: number;
  INTEP_CODIGO!: number;
  INTRP_VALOR_DESDE!: number;
  INTRP_VALOR_HASTA!: number;
  INTRP_VALOR_PRESUPUESTO!: number;
  INTRP_CODIGOPROCESO : string;
  RES_DETALLE!: number;
  INTRP_NUMERO!: number;
  INTRP_LETRA!: string;
}

export class IntranetResolucionProceso {
  INTRES_CODIGO!: string;
  INTRES_DETALLE!: string;
}

export class Departamento {
  INTDEP_CODIGO!: string;
  INTDEP_DESCRIPCION!: string;
}

export class Empleados {
  DMPER_CODIGO!: string;
  NOMBRE!: string;
}

export class Contratista {
  MA_CONT_COD!: string;
  MA_CONT_RAZON_SOCIAL!: string;
}

export class ResolProceso {
  INTRP_CODIGO: string;
  INTPR_CODIGO: string;
  INTRP_NUMEROPROCESO: string;
  INTDEP_CODIGO: string;
  INTRP_TIPO_RESOLUCION: string;
  INTRP_NUMOFICIO: string;
  INTRP_FECHA_PUBLICACION: string;
  INTRP_EMPRESA: string;
  INTRP_NUMCONTRATO: string;
  INTRP_OBSERVACION: string;
  INTRP_DETALLE: string ;
  INTRP_NUMTRAMITE: string;
  INTRP_FECHA_ADJ: string;
  INTRP_FECHA_CONTRATO: string;
  MA_CONT_COD: string;
  INTRES_CODIGO: string;
  INTRP_ANIO: string;
  INTRP_DIRECCION: string;
  INTRP_VALORCONT: string;
  DMPER_CODIGO: string;
  INTTP_CODIGO: string;
  INTEP_CODIGO: string;
  INTRP_VALOR_DESDE: string;
  INTRP_VALOR_HASTA: string;
  INTRP_VALOR_PRESUPUESTO: string;
  INTRP_ARCHIVO: string;
  INTRP_NOM_ARCHIVO: string;
  INTRP_CODIGOPROCESO : string;
  INTRP_NUMERO: number;
  INTRP_LETRA: string;
}


export class Proceso {
  INTPR_CODIGO!: string;
  INTPRO_DESCRIPCION!: string;
  INTPRO_ABREV!: string;
  INTPR_TIPO!: string;
  INTPR_ESTADO!: string;
}


export class ArchivoPrueba {
  INTRP_ARCHIVO!: string;
  INTRP_NOM_ARCHIVO!: string;
}

export class UsuarioDatos {
  
  anio_actual!:string;
  dia_actual!:string;
  dmeor_direccion!:string;
  dmper_codigo!:string;
  dmper_num_rol!:string;
  intranet_admin!:string;
  intranet_archivos!:string;
  intranet_comunicados!:string;
  intranet_procesos!:string;
  mes_actual!:string;
  nombre_completo!:string;
  seusu_estado!:string;
  seusu_usuario!:string;
}

export class Respuesta{
  MENSAJE: string;
}