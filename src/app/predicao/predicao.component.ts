import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import * as Highcharts from "highcharts/highstock";
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
  campaignTwo: FormGroup;

  animal: string;
  name: string;

  Highcharts = Highcharts;

  displayedColumns: string[] = ["item", "cost"];
  transactions: Transaction[] = [
    { item: "Beach ball", cost: 4 },
    { item: "Towel", cost: 5 },
    { item: "Frisbee", cost: 2 },
    { item: "Sunscreen", cost: 4 },
    { item: "Cooler", cost: 25 },
    { item: "Swim suit", cost: 15 }
  ];

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
      text: "Título Pie"
    },
    subtitle: {
      text: "Subtítulo Pie"
    },
    tooltip: {
      pointFormat: "<b>{point.percentage}%</b>",
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
            return "<b>" + this.point.name + "</b>: " + this.percentage + " %";
          }
        }
      }
    },
    series: [
      {
        type: "pie",
        name: "",
        data: [
          ["Série 1", 45.0],
          ["Série 2", 26.8],
          {
            name: "Série 3",
            y: 12.8,
            sliced: true,
            selected: true
          },
          ["Série 4", 8.5],
          ["Série 5", 6.2],
          ["Série 6", 0.7]
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
    yAxis: [
      {
        // Primary yAxis
        labels: {
          format: "{value}",
          style: {
            color: "#7cb5ec"
          }
        },
        title: {
          text: "Unidade de Medida 1",
          style: {
            color: "#7cb5ec"
          }
        }
      },
      {
        // Secondary yAxis
        title: {
          text: "Unidade de Medida 2",
          style: {
            color: "#0d233a"
          }
        },
        labels: {
          format: "{value}",
          style: {
            color: "#0d233a"
          }
        },
        opposite: true
      },
      {
        // Secondary yAxis
        title: {
          text: "Unidade de Medida 3",
          style: {
            color: "#8bbc21"
          }
        },
        labels: {
          format: "{value}",
          style: {
            color: "#8bbc21"
          }
        },
        opposite: true
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
        yAxis: 0,
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
        yAxis: 1,
        data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3]
      },
      {
        name: "Série 3",
        type: "spline",
        color: "#8bbc21",
        yAxis: 2,
        data: [4.0, 3.9, 6.5, 11.5, 15.2, 18.5, 22, 23.5, 20.3, 12.3]
      },
      {
        //Sinalizadores
        type: "flags",
        shape: "flag",
        color: "rgba(0, 0, 0, 0.50)",
        fillColor: "rgba(255, 255, 255, 0.20)",
        border: "0px",
        style: {
          color: "gray",
          fontFamily: "Verdana, sans-serif",
          fontSize: "9px"
        },
        states: {
          hover: {
            fillColor: "rgb(255, 255, 255)"
          }
        },
        tooltip: {
          followPointer: true
        },
        name: "Sinalizador",
        zIndex: 2,
        y: -245,
        data: [
          { x: 1, title: "Sinalizador 1", text: "Sinalizador 1" },
          { x: 6, title: "Sinalizador 2", text: "Sinalizador 2" }
        ]
      }
    ]
  };

  /** Gets the total cost of all transactions. */
  getTotalCost() {
    return this.transactions
      .map((t) => t.cost)
      .reduce((acc, value) => acc + value, 0);
  }
  constructor(public dialog: MatDialog) {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    this.campaignOne = new FormGroup({
      start: new FormControl(new Date(year, month, 13)),
      end: new FormControl(new Date(year, month, 16))
    });

    this.campaignTwo = new FormGroup({
      start: new FormControl(new Date(year, month, 15)),
      end: new FormControl(new Date(year, month, 19))
    });
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: "250px",
      data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      this.animal = result;
    });
  }
  ngOnInit(): void {}

  executarPredicao() {
    console.log(this.name);
    console.log(this.campaignOne.value.start);
    console.log(this.campaignOne.value.end);
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
