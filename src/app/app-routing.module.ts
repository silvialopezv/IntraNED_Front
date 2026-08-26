import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArchivosComponent } from './componentes/archivos/archivos.component';
import { ComunicadosComponent } from './componentes/comunicados/comunicados.component';
import { HomeComponent } from './componentes/home/home.component';
import { MenuComponent } from './componentes/menu/menu.component';
import { ResProcesosComponent } from './componentes/procesos/res-procesos/res-procesos.component';
import { VentanasComponent } from './componentes/ventanas/ventanas.component';
import { InformeNecesidadProcesosComponent } from './componentes/informe-necesidad/procesos/informe-necesidad-procesos.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo:'home'},
  {path: 'procesos', component: ResProcesosComponent},
  {path: 'informe-necesidad/procesos', component: InformeNecesidadProcesosComponent},
  {path: 'archivos', component: ArchivosComponent},
  {path: 'home', component: HomeComponent},
  {path: 'comunicados', component:ComunicadosComponent},
  {path: 'ventanas', component:VentanasComponent},
  {path: 'menu', component:MenuComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
