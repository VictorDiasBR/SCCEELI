import { Injectable } from "@angular/core";
import { Lab, Equip, Regra, Simulacao, Log, Meta, Predicao } from "./lab";
import { AngularFireDatabase } from "@angular/fire/database";

import { map } from "rxjs/operators";
@Injectable({
  providedIn: "root"
})
export class LabService {
  constructor(private db: AngularFireDatabase) {}

  insert(lab: Lab) {
    this.db
      .list("lab")
      .push(lab)
      .then((result: any) => {
        console.log(result.key);
      });
  }
  update(lab: Lab, key: string) {
    this.db
      .list("lab")
      .update(key, lab)
      .catch((error: any) => {
        console.error(error);
      });
  }
  updateEquip(key: string, index: number, equip: Equip) {
    this.db
      .list("lab/" + key + "/equips/")
      .update(index.toString(), equip)
      .catch((error: any) => {
        console.error(error);
      });
  }
  getAll() {
    return this.db
      .list("lab")
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((c) => ({
            key: c.payload.key,
            ...(c.payload.val() as {})
          }));
        })
      );
  }

  delete(key: string) {
    this.db.object("lab/" + key).remove();
  }

  insertRegra(regra: Regra) {
    this.db
      .list("regras")
      .push(regra)
      .then((result: any) => {
        console.log(result.key);
      });
  }
  updateRegra(regra: Regra, key: string) {
    this.db
      .list("regras")
      .update(key, regra)
      .catch((error: any) => {
        console.error(error);
      });
  }

  getAllRegras() {
    return this.db
      .list("regras")
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((c) => ({
            key: c.payload.key,
            ...(c.payload.val() as {})
          }));
        })
      );
  }

  deleteRegra(key: string) {
    this.db.object("regras/" + key).remove();
  }

  insertSimulacao(simulacao: Simulacao) {
    this.db
      .list("simulacoes")
      .push(simulacao)
      .then((result: any) => {
        console.log(result.key);
      });
  }
  updateLog(key: string, log: Log) {
    this.db
      .list("simulacoes/" + key + "/log/")
      .update(key, log)
      .then((result: any) => {});
  }
  updateSimulacao(simulacao: Simulacao, key: string) {
    this.db
      .list("simulacoes")
      .update(key, simulacao)
      .catch((error: any) => {
        console.error(error);
      });
  }

  getAllSimulacoes() {
    return this.db
      .list("simulacoes")
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((c) => ({
            key: c.payload.key,
            ...(c.payload.val() as {})
          }));
        })
      );
  }

  deleteSimulacao(key: string) {
    this.db.object("simulacoes/" + key).remove();
  }

  insertMeta(meta: Meta) {
    this.db
      .list("metas")
      .push(meta)
      .then((result: any) => {
        console.log(result.key);
      });
  }
  updateMeta(regra: Meta, key: string) {
    this.db
      .list("metas")
      .update(key, regra)
      .catch((error: any) => {
        console.error(error);
      });
  }

  getAllMetas() {
    return this.db
      .list("metas")
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((c) => ({
            key: c.payload.key,
            ...(c.payload.val() as {})
          }));
        })
      );
  }

  deleteMeta(key: string) {
    this.db.object("metas/" + key).remove();
  }

  insertPredicao(predicao: Predicao) {
    this.db
      .list("predicoes")
      .push(predicao)
      .then((result: any) => {
        console.log(result.key);
      });
  }
  updatePredicao(predicao: Predicao, key: string) {
    this.db
      .list("predicoes")
      .update(key, predicao)
      .catch((error: any) => {
        console.error(error);
      });
  }

  getAllPredicoes() {
    return this.db
      .list("predicoes")
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((c) => ({
            key: c.payload.key,
            ...(c.payload.val() as {})
          }));
        })
      );
  }

  deletePredicao(key: string) {
    this.db.object("predicoes/" + key).remove();
  }
}
