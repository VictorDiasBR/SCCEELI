import { Component, OnInit } from "@angular/core";
import { map } from "rxjs/operators";
import { Breakpoints, BreakpointObserver } from "@angular/cdk/layout";
export interface Lab {
  nome: string;
}
@Component({
  selector: "app-laboratorios",
  templateUrl: "./laboratorios.component.html",
  styleUrls: ["./laboratorios.component.css"]
})
export class LaboratoriosComponent {
  gaugeType = "semi";
  gaugeValue = 60.3;
  gaugeLabel = "Speed";
  gaugeAppendText = "kw/hr";
  size = 150;
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: "LAMI 1" },
          { title: "LAMI 2" },
          { title: "LAMI 3" },
          { title: "LAMI 4" }
        ];
      }

      return [
        { title: "LAMI 1", value: 70.8, estado: "on" },
        { title: "LAMI 2", value: 20.8, estado: "on" },
        { title: "LAMI 3", value: 30.8, estado: "on" },
        { title: "LAMI 4", value: 60.2, estado: "on" },
        { title: "LAMI 5", value: 50.8, estado: "on" },
        { title: "LAMI 6", value: 0, estado: "off" },
        { title: "LAMI 7", value: 0, estado: "off" },
        { title: "LAMI 8", value: 0, estado: "off" }
      ];
    })
  );

  constructor(private breakpointObserver: BreakpointObserver) {}
}
