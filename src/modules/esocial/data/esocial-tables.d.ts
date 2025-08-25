// Definições de tipos para as tabelas do eSocial

export interface TabelaItem {
  codigo: string;
  descricao: string;
}

export interface ESocialTables {
  tiposInscricao: TabelaItem[];
  classificacaoTributaria: TabelaItem[];
  tiposLotacao: TabelaItem[];
  tiposLogradouro: TabelaItem[];
  naturezaJuridica: TabelaItem[];
  estados: TabelaItem[];
}

export interface OpcaoSelect {
  value: string;
  label: string;
}

export declare const esocialTables: ESocialTables;

export declare function getDescricaoPorCodigo(tabela: keyof ESocialTables, codigo: string): string;

export declare function getOpcoesSelect(tabela: keyof ESocialTables): OpcaoSelect[];