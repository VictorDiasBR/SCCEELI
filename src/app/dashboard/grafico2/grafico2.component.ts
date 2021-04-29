import { Component, OnInit } from "@angular/core";
import { LabService } from "../../service/lab.service";
import { LabDataService } from "../../service/lab.data.service";
import { Lab, Equip, Regra, Simulacao, Log } from "../../service/lab";
import { Observable } from "rxjs";
import * as Highcharts from "highcharts";
import HighchartsMore from "highcharts/highcharts-more";
import HighchartsExporting from "highcharts/modules/exporting";

HighchartsMore(Highcharts);
HighchartsExporting(Highcharts);

@Component({
  selector: "app-grafico2",
  templateUrl: "./grafico2.component.html",
  styleUrls: ["./grafico2.component.css"]
})
export class Grafico2Component implements OnInit {
  public loadingData: boolean = true;
  public dateProduction: Date = new Date();
  labs: Observable<any>;
  simulacoes: Observable<any>;
  bandeira = 0.5;
  /* HighChart */
  public updateFlag: boolean = true; // optional boolean
  public oneToOneFlag: boolean = true; // optional boolean, defaults to false
  public Highcharts: any = Highcharts; // required
  public chartConstructor: string = "chart"; // optional string, defaults to 'chart'
  progressTracking: any;

  pc: number[][] = [];
  arCondicionado: number[][] = [];
  projetor: number[][] = [];
  lampada: number[][] = [];
  constructor(
    private labService: LabService,
    private labDataService: LabDataService
  ) {
    this.labs = this.labService.getAll();
    this.simulacoes = this.labService.getAllSimulacoes();
    var custoTotalPc: number = 0;
    var custoTotalAr: number = 0;
    var custoTotalPro: number = 0;
    var custoTotalLam: number = 0;

    this.simulacoes.forEach((element) => {
      var equipsTempoResto = [];
      var equipsTempo = [];
      this.pc = [];
      this.arCondicionado = [];
      this.projetor = [];
      this.lampada = [];
      element.forEach((s) => {
        if (s.estadoSimulacao === true) {
          custoTotalPc = 0;
          custoTotalAr = 0;
          custoTotalPro = 0;
          custoTotalLam = 0;
          for (const equip of s.snapshotLabs) {
            for (const data of equip.equipDateOn) {
              if (data !== "*") {
                var date1 = Math.floor(
                  new Date(
                    data.slice(6, 10),
                    data.slice(3, 5),
                    data.slice(0, 2),
                    data.slice(11, 13),
                    data.slice(14, 16),
                    data.slice(17, 19)
                  ).getTime() / 60000
                );

                var date2 = Math.floor(
                  new Date(
                    data.slice(6, 10),
                    data.slice(3, 5),
                    data.slice(0, 2),
                    22
                  ).getTime() / 60000
                );

                var diffMs = Number((date2 - date1).toFixed());
                var aux = {
                  labNome: equip.nomeLab,
                  equip: equip,
                  min: diffMs
                };

                equipsTempoResto.push(aux);
              }
            }
          }

          for (const log of s.log) {
            if (log.dateTimeOn) {
              var dateInicio = Math.floor(
                new Date(
                  log.dateTimeOn.slice(6, 10),
                  log.dateTimeOn.slice(3, 5),
                  log.dateTimeOn.slice(0, 2),
                  log.dateTimeOn.slice(11, 13),
                  log.dateTimeOn.slice(14, 16),
                  log.dateTimeOn.slice(17, 19)
                ).getTime() / 60000
              );
              var dateFim = Math.floor(
                new Date(
                  log.dateTimeOff.slice(6, 10),
                  log.dateTimeOff.slice(3, 5),
                  log.dateTimeOff.slice(0, 2),
                  log.dateTimeOff.slice(11, 13),
                  log.dateTimeOff.slice(14, 16),
                  log.dateTimeOff.slice(17, 19)
                ).getTime() / 60000
              );

              var min = Number((dateFim - dateInicio).toFixed());

              var aux2 = {
                labNome: log.labNome,
                equip: log,
                min: min
              };

              equipsTempo.push(aux2);
            }
          }

          for (const l1 of equipsTempoResto) {
            for (const l11 of l1.equip.equipDateOn) {
              for (const l2 of equipsTempo) {
                if (
                  l1.labNome === l2.labNome &&
                  l1.equip.equip.id === l2.equip.equipamento.id &&
                  l11.slice(0, 10) === l2.equip.dateTimeOn.slice(0, 10)
                ) {
                  l1.min += l2.min;
                }
              }
            }
          }

          var datas = [];
          for (const e of equipsTempo) {
            datas.push(e.equip.dateTimeOn.slice(0, 10));
            datas.push(e.equip.dateTimeOff.slice(0, 10));
          }
          var datasFiltro = [];
          for (const data of datas) {
            var duplicated =
              datasFiltro.findIndex((redItem) => {
                return data === redItem;
              }) > -1;

            if (!duplicated) {
              datasFiltro.push(data);
            }
          }

          for (const data of datasFiltro) {
            custoTotalPc = 0;
            custoTotalAr = 0;
            custoTotalPro = 0;
            custoTotalLam = 0;
            for (const e of equipsTempoResto) {
              for (const vetor of e.equip.equipDateOn) {
                if (
                  data === vetor.slice(0, 10) &&
                  e.equip.equip.nome === "computador"
                ) {
                  var temp = e.min / 60;
                  var kw = e.equip.equip.potencia / 1000;
                  var energia = kw * temp;
                  var valor = this.bandeira * energia;

                  custoTotalPc = Number((custoTotalPc + valor).toFixed(2));
                } else if (
                  data === vetor.slice(0, 10) &&
                  e.equip.equip.nome === "Ar Condicionado"
                ) {
                  var temp2 = e.min / 60;
                  var kw2 = e.equip.equip.potencia / 1000;
                  var energia2 = kw2 * temp2;
                  var valor2 = this.bandeira * energia2;

                  custoTotalAr = Number((custoTotalAr + valor2).toFixed(2));
                } else if (
                  data === vetor.slice(0, 10) &&
                  e.equip.equip.nome === "projetor"
                ) {
                  var temp3 = e.min / 60;
                  var kw3 = e.equip.equip.potencia / 1000;
                  var energia3 = kw3 * temp3;
                  var valor3 = this.bandeira * energia3;

                  custoTotalPro = Number((custoTotalPro + valor3).toFixed(2));
                } else if (
                  data === vetor.slice(0, 10) &&
                  e.equip.equip.nome === "lampada"
                ) {
                  var temp4 = e.min / 60;
                  var kw4 = e.equip.equip.potencia / 1000;
                  var energia4 = kw4 * temp4;
                  var valor4 = this.bandeira * energia4;

                  custoTotalLam = Number((custoTotalLam + valor4).toFixed(2));
                }
              }
            }
            this.pc.push([data, custoTotalPc]);
            this.projetor.push([data, custoTotalPro]);
            this.lampada.push([data, custoTotalLam]);
            this.arCondicionado.push([data, custoTotalAr]);
          }

          this.update(
            this.pc.reduce((total, x) => {
              if (
                x[0].toString().slice(3, 10) ===
                new Date().toLocaleString().slice(3, 10)
              ) {
                return (total += x[1]);
              }
              return total;
            }, 0),
            this.arCondicionado.reduce((total, x) => {
              if (
                x[0].toString().slice(3, 10) ===
                new Date().toLocaleString().slice(3, 10)
              ) {
                return (total += x[1]);
              }
              return total;
            }, 0),
            this.projetor.reduce((total, x) => {
              if (
                x[0].toString().slice(3, 10) ===
                new Date().toLocaleString().slice(3, 10)
              ) {
                return (total += x[1]);
              }
              return total;
            }, 0),
            this.lampada.reduce((total, x) => {
              if (
                x[0].toString().slice(3, 10) ===
                new Date().toLocaleString().slice(3, 10)
              ) {
                return (total += x[1]);
              }
              return total;
            }, 0)
          );
        }
      });
    });
  }
  update(pc: number, ar: number, pro: number, lam: number) {
    this.progressTracking = {
      chart: {
        polar: true,
        type: "line"
      },

      title: {
        text: "Total de gastos por equipamento no mês.(R$)",
        x: -80
      },

      pane: {
        size: "80%"
      },

      xAxis: {
        categories: [
          "Computadores",
          "Ar Condicionados",
          "Projetores",
          "Lâmpadas"
        ],
        tickmarkPlacement: "on",
        lineWidth: 0
      },

      yAxis: {
        gridLineInterpolation: "polygon",
        lineWidth: 0,
        min: 0
      },

      tooltip: {
        shared: true,
        pointFormat:
          '<span style="color:{series.color}">{series.name}: <b>${point.y:,.0f}</b><br/>'
      },

      legend: {
        align: "right",
        verticalAlign: "top",
        y: 70,
        layout: "vertical"
      },

      series: [
        {
          name: "Custo total",
          data: [pc, ar, pro, lam],
          pointPlacement: "on"
        }
      ]
    }; // required
  }
  public ngOnInit(): void {
    this.loadingData = false;
  }

  public chartCallback(): void {
    this.loadingData = false;
  } // optional function, defaults to null
}
