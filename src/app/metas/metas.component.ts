import { Component, OnInit } from "@angular/core";
import { LabService } from "../service/lab.service";
import { LabDataService } from "../service/lab.data.service";
import { Meta } from "../service/lab";
import { Observable } from "rxjs";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";

import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-metas",
  templateUrl: "./metas.component.html",
  styleUrls: ["./metas.component.css"]
})
export class MetasComponent implements OnInit {
  tipoMeta: FormGroup;
  periodo: FormGroup;
  descricao: FormGroup;
  isOptional = false;

  labs: Observable<any>;
  simulacoes: Observable<any>;

  metas: Observable<any>;

  displayedColumns: string[] = ["tipo","tipoEquip", "periodo", "gastoMin","gastoMax","descricao"];

  constructor(
    private labService: LabService,
    private labDataService: LabDataService,
    private _formBuilder: FormBuilder
  ) {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    this.labs = this.labService.getAll();

    this.simulacoes = this.labService.getAllSimulacoes();

    this.metas = this.labService.getAllMetas();

    this.tipoMeta = this._formBuilder.group({
      tipo: ["", Validators.required],
      tipoEquip: ["", Validators.required]
    });
    this.periodo = this._formBuilder.group({
      start: new FormControl(new Date(year, month, 13)),
      end: new FormControl(new Date(year, month, 16)),
      gastoMin: ["", Validators.required],
      gastoMax: ["", Validators.required]
    });
    this.descricao = this._formBuilder.group({
      descricao: ["", Validators.required]
    });
  }

  ngOnInit(): void {}

  salvar() {
    console.log(this.tipoMeta.value.tipo);
    console.log(
      this.periodo.value.start.toLocaleDateString("pt-BR", {
        timeZone: "UTC"
      })
    );
    console.log(
      this.periodo.value.end.toLocaleDateString("pt-BR", {
        timeZone: "UTC"
      })
    );
    console.log(this.descricao.value.descricao);

    var meta: Meta = {
      tipo: this.tipoMeta.value.tipo,
      tipoEquip:this.tipoMeta.value.tipoEquip,
      periodo:
        this.periodo.value.start.toLocaleDateString("pt-BR", {
          timeZone: "UTC"
        }) +
        " | " +
        this.periodo.value.end.toLocaleDateString("pt-BR", {
          timeZone: "UTC"
        }),
        gastoMin:this.periodo.value.gastoMin,
        gastoMax:this.periodo.value.gastoMax,
      descricao: this.descricao.value.descricao
    };

    this.labService.insertMeta(meta);
  }
}
