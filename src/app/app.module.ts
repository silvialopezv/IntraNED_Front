import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MaterialModule } from './material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResProcesosComponent } from './componentes/procesos/res-procesos/res-procesos.component';
import { ModalProcesosComponent } from './componentes/modal/modal-procesos/modal-procesos.component';
import { NavComponent } from './componentes/nav/nav/nav.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from "angular-datatables";
import { FormsModule } from '@angular/forms';
import { ModalArchivosComponent } from './componentes/modal/modal-archivos/modal-archivos.component';
import { ArchivosComponent } from './componentes/archivos/archivos.component';
import { HomeComponent } from './componentes/home/home.component';
import { ComunicadosComponent } from './componentes/comunicados/comunicados.component';
import { ModalComunicadosComponent } from './componentes/modal/modal-comunicados/modal-comunicados.component';
import { VentanasComponent } from './componentes/ventanas/ventanas.component';
import { ModalVentanasComponent } from './componentes/modal/modal-ventanas/modal-ventanas.component';
import { MenuComponent } from './componentes/menu/menu.component';
import { ModalMenuComponent } from './componentes/modal/modal-menu/modal-menu.component';
import { InformeNecesidadProcesosComponent } from './componentes/informe-necesidad/procesos/informe-necesidad-procesos.component';

@NgModule({
  declarations: [
    AppComponent,
    ResProcesosComponent,
    ModalProcesosComponent,
    NavComponent,
    ModalArchivosComponent,
    ArchivosComponent,
    HomeComponent,
    ComunicadosComponent,
    ModalComunicadosComponent,
    VentanasComponent,
    ModalVentanasComponent,
    MenuComponent,
    ModalMenuComponent,
    InformeNecesidadProcesosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule, 
    MaterialModule,
    HttpClientModule,
    DataTablesModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
