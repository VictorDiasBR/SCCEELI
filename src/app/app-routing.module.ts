import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { PredicaoComponent } from "./predicao/predicao.component";
import { LaboratorioComponent } from "./laboratorio/laboratorio.component";
import { EquipamentoComponent } from "./equipamento/equipamento.component";
import { GastosComponent } from "./gastos/gastos.component";
import { MetasComponent } from "./metas/metas.component";
import { HistoricoComponent } from "./historico/historico.component";
import { DispositivosComponent } from "./dispositivos/dispositivos.component";
import { RelatorioComponent } from "./relatorio/relatorio.component";

const routes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "predicoes", component: PredicaoComponent },
  { path: "laboratorios", component: LaboratorioComponent },
  { path: "equipamentos", component: EquipamentoComponent },
  { path: "gastos", component: GastosComponent },
  { path: "metas", component: MetasComponent },
  { path: "historico", component: HistoricoComponent },
  { path: "dispositivos", component: DispositivosComponent },
  { path: "relatorio_geral", component: RelatorioComponent },
  { path: "", redirectTo: "dashboard", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
