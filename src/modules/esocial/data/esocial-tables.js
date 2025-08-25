// Dados das tabelas do eSocial para popular os comboboxes
// Baseado na documentação oficial do eSocial versão S-1.3

export const esocialTables = {
  // Tabela 05 - Tipos de Inscrição
  tiposInscricao: [
    { codigo: '1', descricao: 'CNPJ' },
    { codigo: '2', descricao: 'CPF' },
    { codigo: '3', descricao: 'CAEPF (Cadastro de Atividade Econômica de Pessoa Física)' },
    { codigo: '4', descricao: 'CNO (Cadastro Nacional de Obra)' }
  ],

  // Tabela 08 - Classificação Tributária
  // Baseado nas informações coletadas da documentação oficial
  classificacaoTributaria: [
    { codigo: '01', descricao: 'Empresas enquadradas no regime de tributação Simples com tributação previdenciária substituída' },
    { codigo: '02', descricao: 'Empresas enquadradas no regime de tributação Simples com tributação previdenciária não substituída' },
    { codigo: '03', descricao: 'Empresas enquadradas no regime de tributação Simples com tributação previdenciária substituída e não substituída' },
    { codigo: '04', descricao: 'Empresa em geral (Lucro Real, Presumido ou Arbitrado)' },
    { codigo: '05', descricao: 'Empresa em geral com atividade concomitante de produtor rural' },
    { codigo: '06', descricao: 'Entidade imune ou isenta de IRPJ' },
    { codigo: '07', descricao: 'Entidade imune ou isenta de IRPJ com atividade concomitante de produtor rural' },
    { codigo: '08', descricao: 'Produtor rural pessoa jurídica' },
    { codigo: '09', descricao: 'Órgão público da administração direta federal' },
    { codigo: '10', descricao: 'Órgão público da administração direta estadual ou do Distrito Federal' },
    { codigo: '11', descricao: 'Órgão público da administração direta municipal' },
    { codigo: '12', descricao: 'Autarquia federal' },
    { codigo: '13', descricao: 'Autarquia estadual ou do Distrito Federal' },
    { codigo: '14', descricao: 'Autarquia municipal' },
    { codigo: '15', descricao: 'Fundação pública federal' },
    { codigo: '16', descricao: 'Fundação pública estadual ou do Distrito Federal' },
    { codigo: '17', descricao: 'Fundação pública municipal' },
    { codigo: '18', descricao: 'Empresa pública ou sociedade de economia mista' }
  ],

  // Tabela 10 - Tipos de Lotação Tributária
  tiposLotacao: [
    { codigo: '01', descricao: 'Contribuinte individual' },
    { codigo: '02', descricao: 'Empregador doméstico' },
    { codigo: '03', descricao: 'Empresa em geral' },
    { codigo: '04', descricao: 'Empresa de trabalho temporário' },
    { codigo: '05', descricao: 'Cooperativa de trabalho' },
    { codigo: '06', descricao: 'Cooperativa de produção' },
    { codigo: '07', descricao: 'Entidade beneficente/isenta' },
    { codigo: '08', descricao: 'Produtor rural pessoa física' },
    { codigo: '09', descricao: 'Produtor rural pessoa jurídica' },
    { codigo: '10', descricao: 'Órgão público' },
    { codigo: '21', descricao: 'Operador portuário' },
    { codigo: '22', descricao: 'Contratante de cooperados via cooperativa de trabalho' },
    { codigo: '23', descricao: 'Contratante de cooperados via cooperativa de produção' },
    { codigo: '24', descricao: 'Tomador de serviços - Cessão de mão de obra' },
    { codigo: '25', descricao: 'Tomador de serviços - Empreitada parcial' },
    { codigo: '26', descricao: 'Tomador de serviços - Empreitada total' },
    { codigo: '90', descricao: 'Atividade de risco 1, 2 ou 3 (Cooperativa)' },
    { codigo: '91', descricao: 'Atividade de risco 4 (Cooperativa)' }
  ],

  // Tabela 20 - Tipos de Logradouro
  tiposLogradouro: [
    { codigo: 'R', descricao: 'Rua' },
    { codigo: 'AV', descricao: 'Avenida' },
    { codigo: 'AL', descricao: 'Alameda' },
    { codigo: 'BC', descricao: 'Beco' },
    { codigo: 'BL', descricao: 'Bloco' },
    { codigo: 'CH', descricao: 'Chácara' },
    { codigo: 'CJ', descricao: 'Conjunto' },
    { codigo: 'EST', descricao: 'Estrada' },
    { codigo: 'FAZ', descricao: 'Fazenda' },
    { codigo: 'LT', descricao: 'Lote' },
    { codigo: 'PC', descricao: 'Praça' },
    { codigo: 'PQ', descricao: 'Parque' },
    { codigo: 'QD', descricao: 'Quadra' },
    { codigo: 'ROD', descricao: 'Rodovia' },
    { codigo: 'SIT', descricao: 'Sítio' },
    { codigo: 'TR', descricao: 'Travessa' },
    { codigo: 'VL', descricao: 'Vila' }
  ],

  // Natureza Jurídica - Principais códigos
  naturezaJuridica: [
    { codigo: '2011', descricao: 'Empresa Individual de Responsabilidade Limitada (de Natureza Empresária)' },
    { codigo: '2062', descricao: 'Sociedade Empresária Limitada' },
    { codigo: '2054', descricao: 'Sociedade Anônima Fechada' },
    { codigo: '2055', descricao: 'Sociedade Anônima Aberta' },
    { codigo: '2135', descricao: 'Sociedade Limitada Unipessoal' },
    { codigo: '2127', descricao: 'Sociedade em Conta de Participação' },
    { codigo: '1015', descricao: 'Órgão Público do Poder Executivo Federal' },
    { codigo: '1023', descricao: 'Órgão Público do Poder Executivo Estadual ou do Distrito Federal' },
    { codigo: '1031', descricao: 'Órgão Público do Poder Executivo Municipal' },
    { codigo: '1104', descricao: 'Autarquia Federal' },
    { codigo: '1112', descricao: 'Autarquia Estadual ou do Distrito Federal' },
    { codigo: '1120', descricao: 'Autarquia Municipal' },
    { codigo: '1139', descricao: 'Fundação Pública de Direito Público Federal' },
    { codigo: '1147', descricao: 'Fundação Pública de Direito Público Estadual ou do Distrito Federal' },
    { codigo: '1155', descricao: 'Fundação Pública de Direito Público Municipal' },
    { codigo: '2038', descricao: 'Sociedade Simples Limitada' },
    { codigo: '3069', descricao: 'Fundação Privada' },
    { codigo: '3999', descricao: 'Associação Privada' }
  ],

  // Estados brasileiros
  estados: [
    { codigo: 'AC', descricao: 'Acre' },
    { codigo: 'AL', descricao: 'Alagoas' },
    { codigo: 'AP', descricao: 'Amapá' },
    { codigo: 'AM', descricao: 'Amazonas' },
    { codigo: 'BA', descricao: 'Bahia' },
    { codigo: 'CE', descricao: 'Ceará' },
    { codigo: 'DF', descricao: 'Distrito Federal' },
    { codigo: 'ES', descricao: 'Espírito Santo' },
    { codigo: 'GO', descricao: 'Goiás' },
    { codigo: 'MA', descricao: 'Maranhão' },
    { codigo: 'MT', descricao: 'Mato Grosso' },
    { codigo: 'MS', descricao: 'Mato Grosso do Sul' },
    { codigo: 'MG', descricao: 'Minas Gerais' },
    { codigo: 'PA', descricao: 'Pará' },
    { codigo: 'PB', descricao: 'Paraíba' },
    { codigo: 'PR', descricao: 'Paraná' },
    { codigo: 'PE', descricao: 'Pernambuco' },
    { codigo: 'PI', descricao: 'Piauí' },
    { codigo: 'RJ', descricao: 'Rio de Janeiro' },
    { codigo: 'RN', descricao: 'Rio Grande do Norte' },
    { codigo: 'RS', descricao: 'Rio Grande do Sul' },
    { codigo: 'RO', descricao: 'Rondônia' },
    { codigo: 'RR', descricao: 'Roraima' },
    { codigo: 'SC', descricao: 'Santa Catarina' },
    { codigo: 'SP', descricao: 'São Paulo' },
    { codigo: 'SE', descricao: 'Sergipe' },
    { codigo: 'TO', descricao: 'Tocantins' }
  ]
};

// Função auxiliar para buscar descrição por código
export const getDescricaoPorCodigo = (tabela, codigo) => {
  const item = esocialTables[tabela]?.find(item => item.codigo === codigo);
  return item ? item.descricao : '';
};

// Função auxiliar para obter opções formatadas para select
export const getOpcoesSelect = (tabela) => {
  return esocialTables[tabela]?.map(item => ({
    value: item.codigo,
    label: `${item.codigo} - ${item.descricao}`
  })) || [];
};