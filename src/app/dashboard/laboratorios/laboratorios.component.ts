import { Component, OnInit, AfterViewInit } from "@angular/core";
import { map } from "rxjs/operators";
import { LabService } from "../../service/lab.service";
import { LabDataService } from "../../service/lab.data.service";
import {
  Lab,
  Equip,
  Regra,
  Simulacao,
  Log,
  ConsumoConverter
} from "../../service/lab";
import { Observable } from "rxjs";
import { Breakpoints, BreakpointObserver } from "@angular/cdk/layout";

@Component({
  selector: "app-laboratorios",
  templateUrl: "./laboratorios.component.html",
  styleUrls: ["./laboratorios.component.css"]
})
export class LaboratoriosComponent implements OnInit, AfterViewInit {
  gaugeType = "semi";
  gaugeValue = 60.3;
  gaugeLabel = "Speed";
  gaugeAppendText = "kw/hr";
  size = 150;

  labs: Observable<any>;
  simulacoes: Observable<any>;

  listaGastos: ConsumoConverter[] = [];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private labService: LabService,
    private labDataService: LabDataService
  ) {
    this.labs = this.labService.getAll();
   
    this.simulacoes = this.labService.getAll();
  }

  ngOnInit() {}
  ngAfterViewInit() {}
  /** Based on the screen size, switch from standard to one column per row */
}
