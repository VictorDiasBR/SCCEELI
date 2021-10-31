import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { LabService } from "../service/lab.service";
import { LabDataService } from "../service/lab.data.service";
import {
  Lab,
  Equip,
  Regra,
  Simulacao,
  Log,
  ConsumoConverter
} from "../service/lab";
import { Observable } from "rxjs";

@Component({
  selector: "app-laboratorio",
  templateUrl: "./laboratorio.component.html",
  styleUrls: ["./laboratorio.component.css"]
})
export class LaboratorioComponent implements AfterViewInit {
  displayedColumns: string[] = ["nome", "consumo", "gasto", "estado"];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  labs: Observable<any>;
  simulacoes: Observable<any>;
  count: number = 0;

  constructor(
    private labService: LabService,
    private labDataService: LabDataService
  ) {
    this.count = 0;
    this.labs = this.labService.getAll();
  }

  ngAfterViewInit() {}
}
