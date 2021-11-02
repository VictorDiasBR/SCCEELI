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
  displayedColumns: string[] = ["item", "cost"];
  transactions: Transaction[] = [];

  totalAr: number = 0;
  totalPc: number = 0;
  totalLa: number = 0;
  totalPr: number = 0;

  total: number = 0;

  updateFlag = false;

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
      text: "Título Bar + Line"
    },
    subtitle: {
      text: "Subtítulo Bar + Line"
    },
    xAxis: [
      {
        categories: [
          "x1",
          "x2",
          "x3",
          "x4",
          "x5",
          "x6",
          "x7",
          "x8",
          "x9",
          "x10"
        ],
        crosshair: true
      }
    ],
    tooltip: {
      shared: true
    },
    series: [
      {
        name: "Série 1",
        type: "column",
        color: "#7cb5ec",

        data: [
          49.9,
          71.5,
          106.4,
          129.2,
          144.0,
          176.0,
          135.6,
          148.5,
          210.4,
          194.1
        ]
      },
      {
        name: "Série 2",
        type: "spline",
        color: "#0d233a",

        data: [70.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3]
      },
      {
        name: "Série 3",
        type: "spline",
        color: "#8bbc21",

        data: [4.0, 3.9, 6.5, 11.5, 15.2, 18.5, 22, 23.5, 20.3, 12.3]
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

      this.labService.insertPredicao(predicao);

      this.grafico1();
    });
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
