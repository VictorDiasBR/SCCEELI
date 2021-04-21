import { Component, OnInit } from "@angular/core";
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

  /* HighChart */
  public updateFlag: boolean = true; // optional boolean
  public oneToOneFlag: boolean = true; // optional boolean, defaults to false
  public Highcharts: any = Highcharts; // required
  public chartConstructor: string = "chart"; // optional string, defaults to 'chart'
  public progressTracking: any = {
    chart: {
      polar: true,
      type: "line"
    },

    title: {
      text: "Budget vs spending",
      x: -80
    },

    pane: {
      size: "80%"
    },

    xAxis: {
      categories: [
        "Sales",
        "Marketing",
        "Development",
        "Customer Support",
        "Information Technology",
        "Administration"
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
        name: "Allocated Budget",
        data: [43000, 19000, 60000, 35000, 17000, 10000],
        pointPlacement: "on"
      },
      {
        name: "Actual Spending",
        data: [50000, 39000, 42000, 31000, 26000, 14000],
        pointPlacement: "on"
      }
    ]
  }; // required

  constructor() {}

  public ngOnInit(): void {
    this.loadingData = false;
  }

  public chartCallback(): void {
    console.log("Production progress");
    this.loadingData = false;
  } // optional function, defaults to null
}
