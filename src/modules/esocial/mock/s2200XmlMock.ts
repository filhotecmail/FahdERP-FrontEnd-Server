export const s2200XmlMock = `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtAdmissao/v_S_01_02_00">
  <evtAdmissao Id="ID1234567890123456789012345678901234567890">
    <ideEvento>
      <indRetif>1</indRetif>
      <nrRecibo>1.2.0000000000000000001</nrRecibo>
      <tpAmb>2</tpAmb>
      <procEmi>1</procEmi>
      <verProc>1.0</verProc>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>1</tpInsc>
      <nrInsc>12345678000195</nrInsc>
    </ideEmpregador>
    <trabalhador>
      <cpfTrab>12345678901</cpfTrab>
      <nmTrab>João da Silva Santos</nmTrab>
      <sexo>M</sexo>
      <racaCor>2</racaCor>
      <estCiv>1</estCiv>
      <grauInstr>08</grauInstr>
      <nmSoc>João Silva</nmSoc>
      <nascimento>
        <dtNascto>1985-03-15</dtNascto>
        <codMunic>3550308</codMunic>
        <uf>SP</uf>
        <paisNascto>105</paisNascto>
        <paisNac>105</paisNac>
        <nmMae>Maria Santos Silva</nmMae>
        <nmPai>José Silva Santos</nmPai>
      </nascimento>
      <endereco>
        <brasil>
          <tpLograd>R</tpLograd>
          <dscLograd>Rua das Flores</dscLograd>
          <nrLograd>123</nrLograd>
          <complemento>Apto 45</complemento>
          <bairro>Centro</bairro>
          <cep>01234567</cep>
          <codMunic>3550308</codMunic>
          <uf>SP</uf>
        </brasil>
      </endereco>
      <trabImig>
        <tmpResid>1</tmpResid>
        <condIng>1</condIng>
      </trabImig>
      <infoDeficiencia>
        <defFisica>N</defFisica>
        <defVisual>N</defVisual>
        <defAuditiva>N</defAuditiva>
        <defMental>N</defMental>
        <defIntelectual>N</defIntelectual>
        <reabReadap>N</reabReadap>
      </infoDeficiencia>
      <dependente>
        <tpDep>03</tpDep>
        <nmDep>Ana Silva Santos</nmDep>
        <dtNascto>2010-08-20</dtNascto>
        <cpfDep>98765432100</cpfDep>
        <depIRRF>S</depIRRF>
        <depSF>S</depSF>
        <incTrab>N</incTrab>
      </dependente>
      <contato>
        <fonePrinc>11987654321</fonePrinc>
        <foneAlternat>1134567890</foneAlternat>
        <emailPrinc>joao.silva@email.com</emailPrinc>
      </contato>
    </trabalhador>
    <vinculo>
      <matricula>001234</matricula>
      <tpRegTrab>1</tpRegTrab>
      <tpRegPrev>1</tpRegPrev>
      <cadIni>S</cadIni>
      <infoRegimeTrab>
        <infoCeletista>
          <dtAdm>2024-01-15</dtAdm>
          <tpAdmissao>1</tpAdmissao>
          <indAdmissao>1</indAdmissao>
          <tpRegJor>1</tpRegJor>
          <natAtividade>1</natAtividade>
          <dtBase>12</dtBase>
          <cnpjSindCategProf>12345678000195</cnpjSindCategProf>
          <FGTS>
            <opcFGTS>1</opcFGTS>
            <dtOpcFGTS>2024-01-15</dtOpcFGTS>
          </FGTS>
          <trabTemporario>
            <hipLeg>1</hipLeg>
            <justContr>Contrato temporário para projeto específico</justContr>
            <tpInclContr>1</tpInclContr>
          </trabTemporario>
        </infoCeletista>
      </infoRegimeTrab>
      <infoContrato>
        <codCargo>123456</codCargo>
        <codFuncao>654321</codFuncao>
        <codCateg>101</codCateg>
        <codCarreira>001</codCarreira>
        <dtIngrCarr>2024-01-15</dtIngrCarr>
        <remuneracao>
          <vrSalFx>5000.00</vrSalFx>
          <undSalFixo>7</undSalFixo>
          <dscSalVar>Comissão sobre vendas</dscSalVar>
        </remuneracao>
        <duracao>
          <tpContr>2</tpContr>
          <dtTerm>2024-12-31</dtTerm>
          <clauAssec>S</clauAssec>
        </duracao>
        <localTrabalho>
          <localTrabGeral>
            <tpInsc>1</tpInsc>
            <nrInsc>12345678000195</nrInsc>
            <descComp>Sede da empresa</descComp>
          </localTrabGeral>
        </localTrabalho>
        <horContratual>
          <qtdHrsSem>40</qtdHrsSem>
          <tpJornada>2</tpJornada>
          <tmpParc>0</tmpParc>
          <horario>
            <dia>2</dia>
            <codHorContrat>001</codHorContrat>
          </horario>
          <horario>
            <dia>3</dia>
            <codHorContrat>001</codHorContrat>
          </horario>
          <horario>
            <dia>4</dia>
            <codHorContrat>001</codHorContrat>
          </horario>
          <horario>
            <dia>5</dia>
            <codHorContrat>001</codHorContrat>
          </horario>
          <horario>
            <dia>6</dia>
            <codHorContrat>001</codHorContrat>
          </horario>
        </horContratual>
        <filiacaoSindical>
          <cnpjSindTrab>98765432000187</cnpjSindTrab>
        </filiacaoSindical>
        <alvaraJudicial>
          <nrProcJud>1234567-89.2024.5.02.0001</nrProcJud>
        </alvaraJudicial>
      </infoContrato>
      <sucessaoVinc>
        <tpInsc>1</tpInsc>
        <nrInsc>98765432000187</nrInsc>
        <matricAnt>000987</matricAnt>
        <dtTransf>2024-01-01</dtTransf>
        <observacao>Transferência por reorganização empresarial</observacao>
      </sucessaoVinc>
      <transfDom>
        <cpfSubstituto>11122233344</cpfSubstituto>
        <dtIniSubst>2024-01-15</dtIniSubst>
      </transfDom>
      <mudancaCPF>
        <cpfAnt>10987654321</cpfAnt>
        <dtAltCPF>2023-12-01</dtAltCPF>
        <observacao>Alteração de CPF por regularização de documentos</observacao>
      </mudancaCPF>
      <afastamento>
        <dtIniAfast>2024-02-01</dtIniAfast>
        <codMotAfast>01</codMotAfast>
      </afastamento>
      <desligamento>
        <dtDeslig>2024-12-31</dtDeslig>
        <indPagtoAPI>S</indPagtoAPI>
        <dtProjFimAPI>2025-01-31</dtProjFimAPI>
        <pensAlim>0</pensAlim>
        <percAliment>0.00</percAliment>
        <vrAlim>0.00</vrAlim>
      </desligamento>
    </vinculo>
  </evtAdmissao>
</eSocial>`;

export const xmlStats = {
  totalRegistros: 1250,
  processados: 1100,
  erros: 45,
  sucesso: 980,
  criticas: 75,
  naoEnviados: 150
};

// Dados temporais para gráfico de área/linha
export const timeSeriesData = {
  labels: [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ],
  datasets: [
    {
      label: 'Sucessos',
      data: [45, 89, 134, 178, 203, 245, 289, 334, 378, 423, 467, 512],
      backgroundColor: 'rgba(34, 197, 94, 0.2)',
      borderColor: 'rgba(34, 197, 94, 1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4
    },
    {
      label: 'Críticas',
      data: [12, 18, 25, 31, 38, 44, 51, 57, 64, 70, 73, 75],
      backgroundColor: 'rgba(251, 191, 36, 0.2)',
      borderColor: 'rgba(251, 191, 36, 1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4
    },
    {
      label: 'Erros',
      data: [3, 7, 12, 18, 23, 28, 32, 36, 40, 43, 44, 45],
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      borderColor: 'rgba(239, 68, 68, 1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4
    },
    {
      label: 'Não Enviados',
      data: [200, 180, 165, 150, 140, 135, 128, 120, 115, 110, 105, 150],
      backgroundColor: 'rgba(156, 163, 175, 0.2)',
      borderColor: 'rgba(156, 163, 175, 1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4
    }
  ]
};