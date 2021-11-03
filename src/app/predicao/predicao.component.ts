import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import * as Highcharts from "highcharts/highstock";
import { LabService } from "../service/lab.service";
import { LabDataService } from "../service/lab.data.service";
import {
  Lab,
  Equip,
  Regra,
  Simulacao,
  Log,
  ConsumoConverter,
  Predicao
} from "../service/lab";
import { Observable } from "rxjs";
declare var require: any;
const IndicatorsCore = require("highcharts/indicators/indicators");
IndicatorsCore(Highcharts);
const IndicatorZigZag = require("highcharts/indicators/zigzag");
IndicatorZigZag(Highcharts);

export interface DialogData {
  animal: string;
  name: string;
}
interface Transaction {
  item: string;
  cost: number;
}

interface Serie {
  name: string;
  type: string;
  color: string;
  data: number[];
}

@Component({
  selector: "app-predicao",
  templateUrl: "./predicao.component.html",
  styleUrls: ["./predicao.component.css"]
})
export class PredicaoComponent implements OnInit {
  campaignOne: FormGroup;

  name: FormGroup;

  animal: string;

  Highcharts = Highcharts;

  labs: Observable<any>;
  metas: Observable<any>;

  displayedColumns: string[] = ["item", "cost"];
  transactions: Transaction[] = [];

  totalAr: number = 0;
  totalPc: number = 0;
  totalLa: number = 0;
  totalPr: number = 0;

  total: number = 0;
  descricao: string = "";
  min: number = 0;
  max: number = 0;

  serie: Serie[] = [];

  updateFlag = false;
  updateFlag2 = false;

  pieChartOptions = {
    chart: {
      renderTo: "container",
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false
    },
    credits: {
      enabled: false
    },
    title: {
      text: "Gasto por equipamento"
    },
    subtitle: {
      text: "Resultado da predição"
    },
    tooltip: {
      pointFormat: "<b>R${point.y}</b>",
      percentageDecimals: 1
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          color: "#000000",
          connectorColor: "#000000",
          formatter: function () {
            return (
              "<b>" +
              this.point.name +
              "</b>: " +
              this.percentage.toFixed(1) +
              " %"
            );
          }
        }
      }
    },
    series: [
      {
        type: "pie",
        name: "",
        data: [
          ["Lâmpadas", this.totalLa],
          ["Projetores", this.totalPr],
          {
            name: "Computadores",
            y: this.totalPc,
            sliced: true,
            selected: true
          },
          ["Ár condicionados", this.totalAr]
        ]
      }
    ]
  };

  barLineChartOptions = {
    chart: {
      renderTo: "container",
      zoomType: "xy"
    },
    credits: {
      enabled: false
    },
    title: {
      text: "Predição x Metas"
    },
    subtitle: {
      text: "Meta para Computadores"
    },
    xAxis: [
      {
        categories: ["Computador", "Ar condicionado", "Lâmpada", "Projetor"],
        crosshair: true
      }
    ],
    tooltip: {
      shared: true
    },
    series: [
      {
        name: "Equipamentos",
        type: "column",
        color: "#7cb5ec",
        data: [0, 0, 0, 0]
      },
      {
        name: "meta",
        type: "spline",
        color: "#7cb5ec",
        data: [0, 0, 0, 0]
      },
      {
        name: "meta",
        type: "spline",
        color: "#7cb5ec",
        data: [0, 0, 0, 0]
      }
    ]
  };

  /** Gets the total cost of all transactions. */
  getTotalCost() {
    return this.transactions
      .map((t) => t.cost)
      .reduce((acc, value) => acc + value, 0)
      .toFixed(2);
  }
  constructor(
    public dialog: MatDialog,
    private labService: LabService,
    private labDataService: LabDataService,
    private _formBuilder: FormBuilder
  ) {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    this.labs = this.labService.getAll();
    this.metas = this.labService.getAllMetas();

    this.campaignOne = this._formBuilder.group({
      start: new FormControl(new Date(year, month, 13)),
      end: new FormControl(new Date(year, month, 16)),
      titulo: ""
    });
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: "250px",
      data: { name: this.campaignOne.value.titulo, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      this.animal = result;
    });
  }
  ngOnInit(): void {}

  executarPredicao() {
    var dataInicio = this.campaignOne.value.start.toLocaleDateString("pt-BR", {
      timeZone: "UTC"
    });
    var dataFim = this.campaignOne.value.end.toLocaleDateString("pt-BR", {
      timeZone: "UTC"
    });

    this.transactions = [{ item: dataInicio + " -> " + dataFim, cost: 50 }];
    var dateInicio = Math.floor(
      new Date(
        dataInicio.slice(6, 10),
        dataInicio.slice(3, 5),
        dataInicio.slice(0, 2)
      ).getTime() / 60000
    );
    var dateFim = Math.floor(
      new Date(
        dataFim.slice(6, 10),
        dataFim.slice(3, 5),
        dataFim.slice(0, 2)
      ).getTime() / 60000
    );
    var min = Number((dateFim - dateInicio).toFixed());

    var temp = min / 60;
    var kw = 100 / 1000;
    var energia = kw * temp;
    var valor = 0.3 * energia;

    var totalPc = 0;
    var totalAr = 0;
    var totalPr = 0;
    var totalLa = 0;

    this.labs.forEach((element) => {
      element.forEach((lab) => {
        for (const i of lab.equips) {
          if (i.tipo === "a") {
            totalAr += i.potencia;
          } else if (i.tipo === "c") {
            totalPc += i.potencia;
          } else if (i.tipo === "p") {
            totalPr += i.potencia;
          } else if (i.tipo === "l") {
            totalLa += i.potencia;
          }
        }
      });
      var tempTotal = min / 60;

      //total
      var kwTotal = (totalPc + totalAr + totalLa + totalPr) / 1000;
      var energiaTotal = kwTotal * tempTotal;
      var valorTotal = 0.3 * energiaTotal;
      // por equipamento
      var kwPc = totalPc / 1000;
      var energiaPc = kwPc * tempTotal;
      var valorPc = 0.3 * energiaPc;

      var kwPr = totalPr / 1000;
      var energiaPr = kwPr * tempTotal;
      var valorPr = 0.3 * energiaPr;

      var kwLa = totalLa / 1000;
      var energiaLa = kwLa * tempTotal;
      var valorLa = 0.3 * energiaLa;

      var kwAr = totalAr / 1000;
      var energiaAr = kwAr * tempTotal;
      var valorAr = 0.3 * energiaAr;

      this.totalAr = Number(valorAr.toFixed(2));
      this.totalPc = Number(valorPc.toFixed(2));
      this.totalPr = Number(valorPr.toFixed(2));
      this.totalLa = Number(valorLa.toFixed(2));

      this.total = Number(valorTotal.toFixed(2));

      this.transactions = [
        { item: "Computador", cost: this.totalPc },
        { item: "Ár condicionado", cost: this.totalAr },
        { item: "Projetor", cost: this.totalPr },
        { item: "Lâmpadas", cost: this.totalLa }
      ];

      var predicao: Predicao = {
        titulo: this.campaignOne.value.titulo,
        periodo: dataInicio + " | " + dataFim,
        totalPeriodo: this.total,
        totalPc: this.totalPc,
        totalAr: this.totalAr,
        totalLam: this.totalLa,
        totalPro: this.totalPr,
        dataPredicao: new Date().toLocaleString()
      };
      this.grafico1();
      this.labService.insertPredicao(predicao);
    });

    var serieLista: Serie[] = [];
    var serieLinhaMin: Serie;
    var serieLinhaMax: Serie;

    var descricao: string = "";
    this.metas.forEach((element) => {
      element.forEach((meta) => {
        if (meta.tipoEquip === "Computador") {
          serieLinhaMin = {
            name: "Meta: " + meta.descricao + " - Gasto Mínimo",
            type: "spline",
            color: "#00FF00",
            data: [Number(meta.gastoMin), 0, 0, 0]
          };
          serieLinhaMax = {
            name: "Meta: " + meta.descricao + " - Gasto Máximo",
            type: "spline",
            color: "#FF0000",
            data: [Number(meta.gastoMax), 0, 0, 0]
          };
        } else if (meta.tipoEquip === "Ar condicionado") {
          serieLinhaMin = {
            name: "Meta: " + meta.descricao + " - Gasto Mínimo",
            type: "spline",
            color: "#00FF00",
            data: [0, Number(meta.gastoMin), 0, 0]
          };
          serieLinhaMax = {
            name: "Meta: " + meta.descricao + " - Gasto Máximo",
            type: "spline",
            color: "#FF0000",
            data: [0, Number(meta.gastoMax), 0, 0]
          };
        } else if (meta.tipoEquip === "Lâmpada") {
          serieLinhaMin = {
            name: "Meta: " + meta.descricao + " - Gasto Mínimo",
            type: "spline",
            color: "#00FF00",
            data: [0, 0, Number(meta.gastoMin), 0]
          };
          serieLinhaMax = {
            name: "Meta: " + meta.descricao + " - Gasto Máximo",
            type: "spline",
            color: "#FF0000",
            data: [0, 0, Number(meta.gastoMax), 0]
          };
        } else if (meta.tipoEquip === "Projetor") {
          serieLinhaMin = {
            name: "Meta: " + meta.descricao + " - Gasto Mínimo",
            type: "spline",
            color: "#00FF00",
            data: [0, 0, 0, Number(meta.gastoMin)]
          };
          serieLinhaMax = {
            name: "Meta: " + meta.descricao + " - Gasto Máximo",
            type: "spline",
            color: "#FF0000",
            data: [0, 0, 0, Number(meta.gastoMax)]
          };
        } else if (meta.tipoEquip === "Todos os Equipamentos") {
          serieLinhaMin = {
            name: "Meta: " + meta.descricao + " - Gasto Mínimo",
            type: "spline",
            color: "#00FF00",
            data: [
              Number(meta.gastoMin),
              Number(meta.gastoMin),
              Number(meta.gastoMin),
              Number(meta.gastoMin)
            ]
          };
          serieLinhaMax = {
            name: "Meta: " + meta.descricao + " - Gasto Máximo",
            type: "spline",
            color: "#FF0000",
            data: [
              Number(meta.gastoMax),
              Number(meta.gastoMax),
              Number(meta.gastoMax),
              Number(meta.gastoMax)
            ]
          };
        }
        if (
          meta.tipoEquip === "Computador" ||
          meta.tipoEquip === "Ar condicionado" ||
          meta.tipoEquip === "Lâmpada" ||
          meta.tipoEquip === "Projetor" ||
          meta.tipoEquip === "Todos os Equipamentos"
        ) {
          var serieBarra: Serie = {
            name: "Equipamentos",
            type: "column",
            color: "#7cb5ec",
            data: [this.totalPc, this.totalAr, this.totalLa, this.totalPr]
          };
          this.grafico2([serieBarra, serieLinhaMin, serieLinhaMax]);
        }
      });
    });
  }

  grafico2(lista: Serie[]) {
    this.chartOptions[1].chartConfig.series = lista;

    this.updateFlag2 = true;
  }

  grafico1() {
    this.chartOptions[0].chartConfig.series[0] = {
      type: "pie",
      name: "",
      data: [
        ["Lâmpadas", this.totalLa],
        ["Projetores", this.totalPr],
        {
          name: "Computadores",
          y: this.totalPc,
          sliced: true,
          selected: true
        },
        ["Ár condicionados", this.totalAr]
      ]
    };
    this.updateFlag = true;
  }
  chartOptions = [
    { chartConfig: this.pieChartOptions },
    { chartConfig: this.barLineChartOptions }
  ];
}

@Component({
  selector: "dialog-overview-example-dialog",
  templateUrl: "datas-dialog.html",
  styleUrls: ["./predicao.component.css"]
})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
