import { Component, OnInit } from '@angular/core';

//Estructura de una fila del informe de necesidad (solo front, datos de prueba)
export interface ProcesoNecesidad {
  registro: number;
  numeroProceso: string;
  codigo: string;
  detalle: string;
  area: string;
  estado: 'En Proceso' | 'Adjudicado' | 'Publicado' | 'Desierto' | 'Finalizado';
  valor: number;
  fecha: string;
}

@Component({
  selector: 'app-informe-necesidad-procesos',
  templateUrl: './informe-necesidad-procesos.component.html',
  styleUrls: ['./informe-necesidad-procesos.component.css']
})
export class InformeNecesidadProcesosComponent implements OnInit {

  //Filtros de la cabecera (aún sin lógica de backend)
  anioParam: string = new Date().getFullYear().toString();
  tipoProceso: string = '';
  listProceso: string[] = [
    'Ínfima Cuantía',
    'Subasta Inversa Electrónica',
    'Menor Cuantía',
    'Cotización',
    'Licitación'
  ];

  //Texto del buscador de la tabla
  filtro: string = '';

  //Datos de prueba (mock) — se reemplazarán por el backend más adelante
  procesos: ProcesoNecesidad[] = [
    { registro: 1, numeroProceso: 'PRO-2026-001', codigo: 'INF-0001', detalle: 'Adquisición de transformadores trifásicos para subestación norte', area: 'Subtransmisión', estado: 'En Proceso', valor: 45820.50, fecha: '2026-02-12' },
    { registro: 2, numeroProceso: 'PRO-2026-002', codigo: 'INF-0002', detalle: 'Compra de medidores inteligentes para sector residencial', area: 'Comercialización', estado: 'Adjudicado', valor: 128400.00, fecha: '2026-03-04' },
    { registro: 3, numeroProceso: 'PRO-2026-003', codigo: 'INF-0003', detalle: 'Servicio de mantenimiento de redes de media tensión', area: 'Distribución', estado: 'Publicado', valor: 32750.75, fecha: '2026-03-18' },
    { registro: 4, numeroProceso: 'PRO-2026-004', codigo: 'INF-0004', detalle: 'Adquisición de vehículos técnicos para cuadrillas', area: 'Logística', estado: 'En Proceso', valor: 96500.00, fecha: '2026-04-02' },
    { registro: 5, numeroProceso: 'PRO-2026-005', codigo: 'INF-0005', detalle: 'Provisión de equipos de protección personal (EPP)', area: 'Seguridad Industrial', estado: 'Finalizado', valor: 18990.20, fecha: '2026-04-15' },
    { registro: 6, numeroProceso: 'PRO-2026-006', codigo: 'INF-0006', detalle: 'Suministro de postes de hormigón armado', area: 'Distribución', estado: 'Desierto', valor: 54300.00, fecha: '2026-05-09' },
    { registro: 7, numeroProceso: 'PRO-2026-007', codigo: 'INF-0007', detalle: 'Contratación de estudio de factibilidad eléctrica rural', area: 'Planificación', estado: 'Adjudicado', valor: 27650.00, fecha: '2026-05-27' },
    { registro: 8, numeroProceso: 'PRO-2026-008', codigo: 'INF-0008', detalle: 'Adquisición de licencias de software SCADA', area: 'Tecnología', estado: 'En Proceso', valor: 74210.90, fecha: '2026-06-11' }
  ];

  constructor() { }

  ngOnInit(): void {
    //Vista solo front con datos de prueba (pendiente integrar backend)
  }

  //Filtrado en memoria del buscador (front)
  get procesosFiltrados(): ProcesoNecesidad[] {
    const q = this.filtro.trim().toLowerCase();
    if (!q) { return this.procesos; }
    return this.procesos.filter(p =>
      p.numeroProceso.toLowerCase().includes(q) ||
      p.codigo.toLowerCase().includes(q) ||
      p.detalle.toLowerCase().includes(q) ||
      p.area.toLowerCase().includes(q) ||
      p.estado.toLowerCase().includes(q)
    );
  }

  //Devuelve la clase CSS del badge según el estado
  claseEstado(estado: string): string {
    switch (estado) {
      case 'Adjudicado': return 'est-adjudicado';
      case 'Publicado':  return 'est-publicado';
      case 'Desierto':   return 'est-desierto';
      case 'Finalizado': return 'est-finalizado';
      default:           return 'est-proceso';
    }
  }

  //Placeholders de acciones (sin backend aún)
  nuevo(): void { console.log('Nuevo (pendiente backend)'); }
  editar(p: ProcesoNecesidad): void { console.log('Editar', p.codigo); }
  eliminar(p: ProcesoNecesidad): void { console.log('Eliminar', p.codigo); }
}
