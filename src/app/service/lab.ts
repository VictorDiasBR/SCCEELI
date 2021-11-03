export class Equip {
  id: number;
  nome: string;
  tipo: string;
  estado: string;
  potencia: number;
  dateTimeOn: string;
}
export class Lab {
  nome: string;
  consumo: number;
  estado: string;
  equips: Equip[];
  aula: boolean;
}
export class Regra {
  laboratorio: string;
  estadoLab: boolean;
  equipamento: string;
  probEquip: number;
}
export class Log {
  labNome?: string;
  equipamento?: any;
  dateTimeOn?: string;
  dateTimeOff?: string;
  inicioSimulacao?: string;
}
export class Simulacao {
  estadoSimulacao: boolean;
  titulo: string;
  descricao: string;
  modalidadeTempo: string;
  modelo: string;
  snapshotLabs: Lab[];
  regras: Regra[];
  log: Log[];
  dateTimeInicio: string;
  periodo?: string;
}

export class Meta {
  tipo: string;
  tipoEquip: string;
  periodo: string;
  gastoMin: string;
  gastoMax: string;
  descricao: string;
}

export class Predicao {
  titulo: string;
  periodo: string;
  totalPeriodo: number;
  totalPc: number;
  totalAr: number;
  totalLam: number;
  totalPro: number;
  dataPredicao: string;
}

export class ConsumoConverter {
  labKey: string;
  valor: number;
}
