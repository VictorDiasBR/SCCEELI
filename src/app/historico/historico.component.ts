import { Component, OnInit } from "@angular/core";
import { LabService } from "../service/lab.service";
import { Observable } from "rxjs";
@Component({
  selector: "app-historico",
  templateUrl: "./historico.component.html",
  styleUrls: ["./historico.component.css"]
})
export class HistoricoComponent implements OnInit {
  simulacoes: Observable<any>;
  predicoes: Observable<any>;
  displayedColumns: string[] = [
    "titulo",
    "descricao",
    "data",
    "estado",
    "modalidade",
    "modelo"
  ];
  displayedColumns2: string[] = [
    "data",
    "titulo",
    "periodo",
    "totalPeriodo",
    "totalPc",
    "totalAr",
    "totalLam",
    "totalPro"
  ];

  constructor(private labService: LabService) {
    this.simulacoes = this.labService.getAllSimulacoes();

    this.predicoes = this.labService.getAllPredicoes();
  }

  ngOnInit(): void {}
}
