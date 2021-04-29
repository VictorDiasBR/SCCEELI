import { Component, OnInit } from "@angular/core";
import { LabService } from "../../service/lab.service";
import { LabDataService } from "../../service/lab.data.service";
import { Lab, Equip, Regra, Simulacao, Log } from "../../service/lab";
import { Observable } from "rxjs";
import * as moment from "moment";
import * as Highcharts from "highcharts/highstock";
@Component({
  selector: "app-grafico",
  templateUrl: "./grafico.component.html",
  styleUrls: ["./grafico.component.css"]
})
export class GraficoComponent implements OnInit {
  datatime = "22/04/2021 20:08:52";
  labs: Observable<any>;
  simulacoes: Observable<any>;

  dados: Observable<any>;
  Highcharts = Highcharts;
  chartOptions: any;

  pc: number[][] = [];
  arCondicionado: number[][] = [];
  projetor: number[][] = [];
  lampada: number[][] = [];
  bandeira = 0.5;
  constructor(
    private labService: LabService,
    private labDataService: LabDataService
  ) {
    this.labs = this.labService.getAll();
    this.simulacoes = this.labService.getAllSimulacoes();

    this.simulacoes.forEach((element) => {
      var equipsTempoResto = [];
      var equipsTempo = [];
      this.pc = [];
      this.arCondicionado = [];
      this.projetor = [];
      this.lampada = [];
      element.forEach((s) => {
        if (s.estadoSimulacao === true) {
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

          var custoTotalPc: number;
          var custoTotalAr: number;
          var custoTotalPro: number;
          var custoTotalLam: number;
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
            this.pc.push([
              Date.parse(moment(data, "DD/MM/YYYY", true).format("YYYY-MM-DD")),
              custoTotalPc
            ]);
            this.projetor.push([
              Date.parse(moment(data, "DD/MM/YYYY", true).format("YYYY-MM-DD")),
              custoTotalPro
            ]);
            this.lampada.push([
              Date.parse(moment(data, "DD/MM/YYYY", true).format("YYYY-MM-DD")),
              custoTotalLam
            ]);
            this.arCondicionado.push([
              Date.parse(moment(data, "DD/MM/YYYY", true).format("YYYY-MM-DD")),
              custoTotalAr
            ]);
          }
          this.updateGrafico(
            this.pc,
            this.arCondicionado,
            this.projetor,
            this.lampada
          );
        }
      });
    });
  }
  ngOnInit() {}

  updateGrafico(
    pc: number[][],
    ar: number[][],
    pro: number[][],
    lam: number[][]
  ) {
    this.chartOptions = {
      rangeSelector: {
        selected: 1
      },

      title: {
        text: "Gastos com Equipamentos(R$)"
      },

      series: [
        {
          name: "Computador",
          data: pc
        },
        {
          name: "Ar Condicionado",
          data: ar
        },
        {
          name: "Projetor",
          data: pro
        },
        {
          name: "Lâmpada",
          data: lam
        }
      ]
    };
  }
}
