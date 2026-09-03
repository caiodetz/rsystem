import { ModeloDocumentoRelatorio } from '../types';

// ==========================================
// CSS PADRÃO METROLÓGICO A4 COMPARTILHADO
// ==========================================
const CSS_PADRAO_A4 = `
@page {
  size: A4;
  margin: 0;
}
* {
  box-sizing: border-box;
}
body {
  background-color: #f1f5f9;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 8.5pt;
  color: #000;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
}
.folha-a4 {
  width: 210mm;
  min-height: 297mm;
  padding: 8mm 12.7mm;
  background-color: white;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 15px auto;
}
@media print {
  html, body {
    height: 297mm;
    background-color: transparent !important;
  }
  .folha-a4 {
    box-shadow: none !important;
    width: 100% !important;
    height: 297mm !important;
    padding: 8mm 12.7mm !important;
    margin: 0 !important;
  }
}
`;

// ==========================================
// 1. MODELO ORDEM DE SERVIÇO COMPLETA (A4)
// Fiel a: EXEMPLO DE OS.pdf
// ==========================================
const TEMPLATE_OS_COMPLETA = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Ordem de Serviço Nº {{os.numero}} - RARUS</title>
  <style>
    ${CSS_PADRAO_A4}
    .cabecalho-os {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #000;
      padding-bottom: 4px;
      margin-bottom: 6px;
    }
    .os-numero-box {
      font-size: 11pt;
      font-weight: bold;
    }
    .os-numero-destaque {
      color: #dc2626;
      font-size: 13pt;
    }
    .os-titulo-central {
      text-align: center;
    }
    .os-titulo-principal {
      font-size: 13pt;
      font-weight: bold;
      color: #0b3b60;
      margin: 0;
    }
    .os-subtitulo {
      font-size: 11pt;
      font-weight: bold;
      color: #0b3b60;
      margin: 2px 0 0 0;
    }
    .logo-rarus-header {
      font-weight: 900;
      font-size: 16pt;
      color: #0284c7;
      text-align: right;
      letter-spacing: 1px;
    }
    .logo-sub {
      font-size: 6.5pt;
      color: #64748b;
      letter-spacing: 0.5px;
    }
    .quadro-borda {
      border: 1px solid #000;
      padding: 4px 6px;
      margin-bottom: 5px;
    }
    .tabela-info {
      width: 100%;
      border-collapse: collapse;
    }
    .tabela-info td {
      padding: 1.5px 3px;
      font-size: 8pt;
      vertical-align: top;
    }
    .rotulo {
      font-weight: bold;
      color: #000;
      white-space: nowrap;
      width: 1%;
    }
    .secao-header-faixa {
      background-color: #f8fafc;
      font-weight: bold;
      border-top: 1px solid #000;
      border-bottom: 1px solid #000;
      padding: 2px 4px;
      margin: 4px 0 2px 0;
      font-size: 8pt;
      display: flex;
      justify-content: space-between;
    }
    .grid-laudo {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      margin-bottom: 5px;
    }
    .box-laudo {
      border: 1px solid #000;
      padding: 4px 6px;
      font-size: 7.5pt;
      min-height: 48px;
    }
    .box-laudo-titulo {
      font-weight: bold;
      text-align: center;
      border-bottom: 1px solid #ccc;
      padding-bottom: 2px;
      margin-bottom: 3px;
    }
    .tabela-itens {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 4px;
    }
    .tabela-itens th {
      border-top: 1px solid #000;
      border-bottom: 1px solid #000;
      padding: 2.5px 4px;
      font-size: 7.5pt;
      font-weight: bold;
      text-align: left;
      background: #fafafa;
    }
    .tabela-itens td {
      padding: 2px 4px;
      font-size: 7.5pt;
      border-bottom: 1px dotted #e2e8f0;
    }
    .tabela-totais-rodape {
      display: flex;
      justify-content: space-between;
      border-top: 1.5px solid #000;
      border-bottom: 1.5px solid #000;
      padding: 3px 6px;
      font-size: 8pt;
      font-weight: bold;
      margin: 4px 0 6px 0;
      background: #f8fafc;
    }
    .rodape-geral-doc {
      border-top: 1px solid #000;
      padding-top: 4px;
      display: flex;
      justify-content: space-between;
      font-size: 6.8pt;
      color: #334155;
      line-height: 1.3;
    }
  </style>
</head>
<body>
  <div class="folha-a4">
    <div>
      <!-- CABEÇALHO -->
      <div class="cabecalho-os">
        <div class="os-numero-box">
          <div>Nº OS: <span class="os-numero-destaque">{{os.numero}}</span></div>
          <div style="font-size: 8pt; color: #475569;">Data: {{os.data}}</div>
        </div>
        <div class="os-titulo-central">
          <h1 class="os-titulo-principal">Laboratório de Manutenção e Calibração</h1>
          <h2 class="os-subtitulo">Vendas e Assistência Técnica</h2>
        </div>
        <div style="text-align: right;">
          <div class="logo-rarus-header">RARUS</div>
          <div class="logo-sub">TECNOLOGIA E SERVIÇOS</div>
        </div>
      </div>

      <!-- QUADRO CLIENTE -->
      <div class="quadro-borda">
        <table class="tabela-info">
          <tr>
            <td class="rotulo">Cliente:</td>
            <td style="font-weight: bold;">{{cliente.nome}}</td>
            <td class="rotulo">Insc. Estadual:</td>
            <td>{{cliente.inscricaoEstadual}}</td>
          </tr>
          <tr>
            <td class="rotulo">CNPJ/CPF:</td>
            <td>{{cliente.cnpj}}</td>
            <td class="rotulo">Bairro:</td>
            <td>{{cliente.bairro}}</td>
          </tr>
          <tr>
            <td class="rotulo">Endereço:</td>
            <td>{{cliente.endereco}}</td>
            <td class="rotulo">UF:</td>
            <td>{{cliente.uf}}</td>
          </tr>
          <tr>
            <td class="rotulo">Cidade:</td>
            <td>{{cliente.cidade}}</td>
            <td class="rotulo">CEP:</td>
            <td>{{cliente.cep}}</td>
          </tr>
          <tr>
            <td class="rotulo">Contato:</td>
            <td>{{cliente.contato}} • Fone: {{cliente.telefone}}</td>
            <td class="rotulo">E-mail:</td>
            <td>{{cliente.email}}</td>
          </tr>
        </table>
      </div>

      <!-- QUADRO EQUIPAMENTO -->
      <div class="quadro-borda">
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 2px; margin-bottom: 3px; font-weight: bold;">
          <span>Serviços realizados in loco: NÃO</span>
          <span>Garantia: NÃO</span>
        </div>
        <table class="tabela-info">
          <tr>
            <td class="rotulo">Modelo:</td>
            <td>{{equipamento.modelo}}</td>
            <td class="rotulo">Lacre Ant.:</td>
            <td>{{equipamento.lacreAnterior}}</td>
            <td class="rotulo">Selo Reparado Ant.:</td>
            <td>{{equipamento.seloAnterior}}</td>
          </tr>
          <tr>
            <td class="rotulo">Marca:</td>
            <td>{{equipamento.marca}}</td>
            <td class="rotulo">Lacre Nv.:</td>
            <td>{{equipamento.lacreNovo}}</td>
            <td class="rotulo">Selo Reparado Nv.:</td>
            <td>{{equipamento.seloNovo}}</td>
          </tr>
          <tr>
            <td class="rotulo">Série:</td>
            <td style="font-weight: bold; font-family: monospace;">{{equipamento.serie}}</td>
            <td class="rotulo">Portaria:</td>
            <td>{{equipamento.portariaInmetro}}</td>
            <td class="rotulo">Data Serv. Ant.:</td>
            <td>{{equipamento.dataServicoAnterior}}</td>
          </tr>
          <tr>
            <td class="rotulo">Patrimônio:</td>
            <td>{{equipamento.patrimonio}}</td>
            <td class="rotulo">Ano Fabric.:</td>
            <td>{{equipamento.anoFabricacao}}</td>
            <td class="rotulo">Data Calibração:</td>
            <td>{{equipamento.dataCalibracao}}</td>
          </tr>
          <tr>
            <td class="rotulo">Acessórios:</td>
            <td colspan="5">{{equipamento.acessorios}}</td>
          </tr>
        </table>
      </div>

      <!-- LAUDO TÉCNICO & SERVIÇOS A EXECUTAR -->
      <div class="grid-laudo">
        <div class="box-laudo">
          <div class="box-laudo-titulo">Laudo Técnico</div>
          <div>{{os.descricaoProblema}}</div>
        </div>
        <div class="box-laudo">
          <div class="box-laudo-titulo">Serviços a serem executados</div>
          <div>{{os.servicosExecutados}}</div>
        </div>
      </div>

      <!-- TABELA DE SERVIÇOS -->
      <div style="font-size: 8pt; font-weight: bold; margin: 4px 0 1px 0;">Serviços</div>
      <table class="tabela-itens">
        <thead>
          <tr>
            <th style="width: 80px;">Serviço</th>
            <th>Descrição do Serviço</th>
            <th style="width: 60px; text-align: center;">Quant.</th>
            <th style="width: 90px; text-align: right;">Vlr Unitário</th>
            <th style="width: 90px; text-align: right;">Vlr Total</th>
          </tr>
        </thead>
        <tbody>
          {{tabelaServicos}}
        </tbody>
      </table>

      <!-- TABELA DE PRODUTOS / PEÇAS -->
      <div style="font-size: 8pt; font-weight: bold; margin: 4px 0 1px 0;">Produtos & Peças</div>
      <table class="tabela-itens">
        <thead>
          <tr>
            <th style="width: 70px;">Produto</th>
            <th>Descrição do Item</th>
            <th style="width: 90px; text-align: center;">NCM</th>
            <th style="width: 50px; text-align: center;">Quant.</th>
            <th style="width: 80px; text-align: right;">Vlr Unitário</th>
            <th style="width: 80px; text-align: right;">Vlr Líq. Unit</th>
            <th style="width: 85px; text-align: right;">Vlr Total</th>
          </tr>
        </thead>
        <tbody>
          {{tabelaPecas}}
        </tbody>
      </table>

      <!-- TOTAIS CONSOLIDADOS -->
      <div class="tabela-totais-rodape">
        <span>Serviços: {{totais.servicos}}</span>
        <span>Produtos: {{totais.produtos}}</span>
        <span>{{totais.desconto}}</span>
        <span>Total Bruto: {{totais.bruto}}</span>
        <span style="color: #0284c7;">Total Líquido: {{totais.liquido}}</span>
      </div>

      <!-- STATUS, CONDIÇÕES E TRANSPORTE -->
      <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 10px; font-size: 7.5pt; margin-top: 6px;">
        <div>
          <div style="font-weight: bold; font-size: 8pt;">STATUS O.S: {{os.status}}</div>
          <div>Atendente: {{os.atendente}} • Técnico: {{os.tecnicoNome}}</div>
          <div style="margin-top: 4px; font-weight: bold;">Condições de Fornecimento:</div>
          <div>À prazo: 15 dias • Prazo de Entrega: Até 12 dias após aprovação</div>
          <div>Frete: FOB - por conta do cliente</div>
          <div>Garantia: Garantia de serviços e peças substituídas: 90 dias. A garantia não cobre mau uso, transporte irregular ou violação de lacres.</div>
        </div>
        <div style="border-left: 1px solid #ccc; padding-left: 8px;">
          <div style="font-weight: bold; font-size: 8pt;">Dados da Nota Fiscal de Transporte:</div>
          <div>Transportadora: CLIENTE TROUXE</div>
          <div>NF Entrada: NC</div>
          <div style="margin-top: 10px; text-align: center;">
            <div style="border-bottom: 1px solid #000; width: 180px; margin: 20px auto 3px auto;"></div>
            <div>Assinatura do Cliente / Responsável</div>
          </div>
        </div>
      </div>
    </div>

    <!-- RODAPÉ FIXO -->
    <div class="rodape-geral-doc">
      <div>
        <strong>RARUS TECNOLOGIA E SERVICOS LTDA</strong> • CNPJ: 45.179.602/0001-96 • IE: 13.920.394-0<br>
        FONE: (65) 99281-5160 / (66) 99234-1450 • AV. NOVO HORIZONTE, Nº 1056 - ROTA DO SOL - SORRISO/MT<br>
        www.rarustecnologia.com.br
      </div>
      <div style="text-align: right;">
        Representante Gehaka - vendas e assistência técnica<br>
        <strong>Autorizado pelo órgão metrológico sob o nº 51000352</strong>
      </div>
    </div>
  </div>
</body>
</html>`;

// ==========================================
// 2. MODELO ETIQUETA DE EQUIPAMENTO LAB (COM QR CODE)
// Fiel a: EXEMPLO ETIQUETA DE EQUIPAMENTO LAB.pdf
// ==========================================
const TEMPLATE_ETIQUETA_LAB = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Etiqueta Lab OS {{os.numero}}</title>
  <style>
    @page {
      size: 100mm 150mm;
      margin: 0;
    }
    * {
      box-sizing: border-box;
    }
    body {
      background-color: #f1f5f9;
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .etiqueta-lab-box {
      width: 96mm;
      min-height: 140mm;
      padding: 6mm;
      background: #ffffff;
      border: 2px solid #000;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin: 10px auto;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    @media print {
      body {
        background: transparent;
      }
      .etiqueta-lab-box {
        box-shadow: none;
        margin: 0;
        width: 100%;
        height: 100%;
        border: 2px solid #000;
      }
    }
    .header-etiqueta {
      display: flex;
      align-items: center;
      border-bottom: 2px solid #000;
      padding-bottom: 6px;
      gap: 8px;
    }
    .logo-etiqueta {
      width: 45px;
      text-align: center;
    }
    .logo-etiqueta-txt {
      font-weight: 900;
      font-size: 11pt;
      color: #0284c7;
    }
    .logo-etiqueta-sub {
      font-size: 5pt;
      color: #475569;
    }
    .header-dados {
      flex: 1;
      font-size: 8.5pt;
      line-height: 1.35;
    }
    .header-os-num {
      font-size: 12pt;
      font-weight: bold;
    }
    .subfaixa-garantia {
      display: flex;
      justify-content: space-between;
      font-size: 9.5pt;
      font-weight: bold;
      padding: 6px 2px 4px 2px;
      border-bottom: 1px solid #000;
      margin-bottom: 8px;
    }
    .lista-etapas {
      list-style: none;
      padding: 0;
      margin: 0;
      font-size: 10.5pt;
      font-weight: bold;
    }
    .item-etapa {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 3px 0;
      border-bottom: 1px dotted #e2e8f0;
    }
    .checkbox-quadrado {
      width: 18px;
      height: 18px;
      border: 1.5px solid #000;
      display: inline-block;
    }
    .bloco-qrcode-etiqueta {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-top: 1px solid #000;
      padding-top: 6px;
      margin-top: 8px;
    }
    .img-qrcode {
      width: 65px;
      height: 65px;
      display: block;
    }
    .codigo-controle-lab {
      font-size: 7.5pt;
      font-family: monospace;
      font-weight: bold;
      color: #334155;
    }
  </style>
</head>
<body>
  <div class="etiqueta-lab-box">
    <div>
      <!-- HEADER -->
      <div class="header-etiqueta">
        <div class="logo-etiqueta">
          <div class="logo-etiqueta-txt">RARUS</div>
          <div class="logo-etiqueta-sub">TECNOLOGIA</div>
        </div>
        <div class="header-dados">
          <div class="header-os-num">OS nº: <span style="color: #dc2626;">{{os.numero}}</span></div>
          <div style="font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 190px;">
            Cliente: {{cliente.nome}}
          </div>
          <div>Data Chegada: <strong>{{os.data}}</strong></div>
        </div>
      </div>

      <!-- STATUS & GARANTIA -->
      <div class="subfaixa-garantia">
        <span>Status</span>
        <span>Garantia: S ( ) N ( )</span>
      </div>

      <!-- ETAPAS COM CHECKBOXES -->
      <div class="lista-etapas">
        <div class="item-etapa"><span>1-Orçar</span><span class="checkbox-quadrado"></span></div>
        <div class="item-etapa"><span>2-Aguardando Aprovação</span><span class="checkbox-quadrado"></span></div>
        <div class="item-etapa"><span>3-Aprovado</span><span class="checkbox-quadrado"></span></div>
        <div class="item-etapa"><span>4-Reprovado</span><span class="checkbox-quadrado"></span></div>
        <div class="item-etapa"><span>5-Aguardando Peça de Fábrica</span><span class="checkbox-quadrado"></span></div>
        <div class="item-etapa"><span>6-Pronto / Despachar</span><span class="checkbox-quadrado"></span></div>
        <div class="item-etapa"><span>7-Aguardando Cliente Retirar</span><span class="checkbox-quadrado"></span></div>
        <div class="item-etapa"><span>8-Sem Conserto</span><span class="checkbox-quadrado"></span></div>
      </div>
    </div>

    <!-- QR CODE DINÂMICO E CÓDIGO DE CONTROLE QUALIDADE -->
    <div class="bloco-qrcode-etiqueta">
      <div>
        <div style="font-size: 7pt; color: #64748b; margin-bottom: 2px;">Rastreabilidade OS:</div>
        {{qrcode}}
      </div>
      <div style="text-align: right;">
        <div style="font-size: 8pt; font-weight: bold; margin-bottom: 4px;">Série: {{equipamento.serie}}</div>
        <div class="codigo-controle-lab">FOR-PRO-02-07 REV00 24/01/21</div>
      </div>
    </div>
  </div>
</body>
</html>`;

// ==========================================
// 3. MODELO CERTIFICADO MEDIDOR DE UMIDADE (A4)
// Fiel a: certificado medidor de umidade.html
// ==========================================
const TEMPLATE_CERT_UMIDADE = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Certificado de Calibração Medidor de Umidade - RARUS</title>
  <style>
    ${CSS_PADRAO_A4}
    .cabecalho {
      display: grid;
      grid-template-columns: 85px 1fr 85px;
      align-items: center;
      padding-bottom: 4px;
      border-bottom: 3px double #000;
    }
    .logo-container {
      width: 85px;
      font-weight: 900;
      font-size: 16pt;
      color: #0284c7;
      text-align: center;
    }
    .titulo-principal {
      font-size: 11pt;
      font-weight: bold;
      color: #000;
      margin: 0;
      text-transform: uppercase;
      text-align: center;
    }
    .subtitulo {
      font-size: 10pt;
      font-weight: bold;
      color: #000;
      margin: 2px 0 0 0;
      text-align: center;
    }
    .secao-titulo-principal {
      font-size: 9pt;
      font-weight: bold;
      color: #000;
      margin: 4px 0 2px 0;
    }
    .secao-container {
      border-top: 3px double #000;
      margin-top: 4px;
      padding-top: 2px;
    }
    .secao-titulo {
      font-weight: bold;
      font-size: 9pt;
      margin-bottom: 3px;
    }
    .tabela-dados {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 2px;
    }
    .tabela-dados td {
      padding: 1px 3px;
      vertical-align: top;
      white-space: nowrap;
      font-size: 8pt;
    }
    .rotulo {
      font-weight: bold;
      width: 1%;
      padding-right: 5px !important;
    }
    .tabela-relatorio {
      width: 100%;
      border-collapse: collapse;
      margin: 2px 0 4px 0;
    }
    .tabela-relatorio td, .tabela-relatorio th {
      padding: 2px 4px;
      font-size: 8pt;
      vertical-align: middle;
      text-align: center;
    }
    .tabela-relatorio th {
      font-weight: bold;
      border-bottom: 1px solid #000;
    }
    .tabela-bordada {
      width: 100%;
      border-collapse: collapse;
      margin: 3px 0 6px 0;
    }
    .tabela-bordada th, .tabela-bordada td {
      border: 1px solid #000;
      padding: 3px 4px;
      font-size: 8pt;
      vertical-align: middle;
      text-align: center;
    }
    .tabela-bordada th {
      font-weight: bold;
      background-color: #f8fafc;
    }
    .bloco-final-container {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 8px;
      position: relative;
    }
    .assinatura-box {
      width: 260px;
      margin: 0 auto;
      text-align: center;
    }
    .linha-assinatura {
      border-top: 1px solid #000;
      margin: 3px 0 2px 0;
      width: 100%;
    }
    .rodape {
      border-top: 3px double #000;
      padding-top: 4px;
      font-size: 6.8pt;
      text-align: center;
      line-height: 1.3;
    }
  </style>
</head>
<body>
  <div class="folha-a4">
    <div>
      <header class="cabecalho">
        <div class="logo-container">RARUS</div>
        <div>
          <h1 class="titulo-principal">LABORATÓRIO DE CALIBRAÇÃO RARUS TECNOLOGIA</h1>
          <h2 class="subtitulo">Certificado de Calibração nº {{os.numero}}/26</h2>
        </div>
        <div></div>
      </header>

      <div class="secao-titulo-principal">1. Dados do Solicitante</div>
      <table class="tabela-dados">
        <tr>
          <td class="rotulo">Cliente:</td>
          <td>{{cliente.nome}}</td>
          <td class="rotulo">Município:</td>
          <td>{{cliente.cidade}}</td>
        </tr>
        <tr>
          <td class="rotulo">Endereço:</td>
          <td>{{cliente.endereco}}</td>
          <td class="rotulo">Estado:</td>
          <td>{{cliente.uf}}</td>
        </tr>
      </table>

      <div class="secao-container">
        <div class="secao-titulo">2 - Descrição do item calibrado</div>
        <table class="tabela-dados">
          <tr>
            <td class="rotulo">Equipamento:</td>
            <td>Medidor de Umidade de Grãos</td>
            <td class="rotulo">Marca:</td>
            <td>{{equipamento.marca}}</td>
            <td class="rotulo">Modelo:</td>
            <td>{{equipamento.modelo}}</td>
          </tr>
          <tr>
            <td class="rotulo">Número de série:</td>
            <td style="font-family: monospace; font-weight: bold;">{{equipamento.serie}}</td>
            <td class="rotulo">Patrimônio:</td>
            <td>{{equipamento.patrimonio}}</td>
            <td class="rotulo">Divisão:</td>
            <td>0,1 %</td>
          </tr>
        </table>
      </div>

      <div class="secao-container">
        <div class="secao-titulo">3 - Informação da Calibração</div>
        <table class="tabela-dados">
          <tr>
            <td class="rotulo">Temperatura:</td>
            <td>24,8 °C</td>
            <td class="rotulo">Umidade:</td>
            <td>42,0 % UR</td>
          </tr>
          <tr>
            <td class="rotulo">Data da calibração:</td>
            <td>{{os.data}}</td>
            <td class="rotulo">Data de emissão:</td>
            <td>{{dataHoje}}</td>
          </tr>
        </table>
      </div>

      <div class="secao-container">
        <div class="secao-titulo">4 - Metodologia e Rastreabilidade Metrológica</div>
        <p style="font-size: 7.8pt; margin: 2px 0;">
          A calibração consiste em comparação direta com equipamento padrão de referência rastreado à RBC/Inmetro, estimado com base na média de 3 ensaios com amostras de grãos de referência.
        </p>
      </div>

      <div class="secao-container">
        <div class="secao-titulo">5 - Rastreabilidade dos Padrões Utilizados</div>
        <table class="tabela-relatorio">
          <thead>
            <tr>
              <th>Identificação</th>
              <th>Padrão</th>
              <th>Certificado RBC</th>
              <th>Validade</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>TH-01</td>
              <td>Termohigrômetro Digital</td>
              <td>LT-457/2024</td>
              <td>30/08/2026</td>
            </tr>
            <tr>
              <td>G2000</td>
              <td>Medidor Padrão RBC</td>
              <td>113416/2025</td>
              <td>30/01/2027</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="secao-container">
        <div class="secao-titulo">6 - Resultados das Medições</div>
        <table class="tabela-bordada">
          <thead>
            <tr>
              <th>Amostra</th>
              <th>Umidade Padrão (%)</th>
              <th>Leitura do Instrumento (%)</th>
              <th>Erro de Indicação (%)</th>
              <th>Incerteza Expandida (%)</th>
              <th>Critério</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>SOJA</td>
              <td>15,66</td>
              <td>15,70</td>
              <td>+0,04</td>
              <td>0,15</td>
              <td><strong>CONFORME</strong></td>
            </tr>
            <tr>
              <td>MILHO</td>
              <td>14,37</td>
              <td>14,40</td>
              <td>+0,03</td>
              <td>0,15</td>
              <td><strong>CONFORME</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bloco-final-container">
        <div class="assinatura-box">
          <div style="font-size: 8pt; color: #475569;">Emitido e verificado por:</div>
          <div class="linha-assinatura"></div>
          <div style="font-weight: bold; font-size: 8.5pt;">Caio Detz</div>
          <div style="font-size: 7.5pt;">Responsável Técnico Metrológico • RARUS</div>
        </div>
        <div style="position: absolute; right: 0; bottom: 0; text-align: center;">
          {{qrcode}}
          <div style="font-size: 7pt;">Autenticidade Certificado</div>
        </div>
      </div>
    </div>

    <div class="rodape">
      RARUS TECNOLOGIA E SERVICOS LTDA • CNPJ 45.179.602/0001-96 • IE 13.920.394-0 • FONE: (65) 99281-5160<br>
      AV. NOVO HORIZONTE, 1056 - ROTA DO SOL - SORRISO/MT - CEP 78895-124 • www.rarustecnologia.com.br
    </div>
  </div>
</body>
</html>`;

// ==========================================
// 4. MODELO RELATÓRIO DE TRANSFERÊNCIA DE ESTOQUE (A4)
// Fiel a: EXEMPLO RELATÓRIO DE TRANSFERENCIA.pdf
// ==========================================
const TEMPLATE_RELATORIO_TRANSFERENCIA = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Transferência de Local de Estoque</title>
  <style>
    ${CSS_PADRAO_A4}
    .header-transf {
      border-bottom: 2px solid #000;
      padding-bottom: 4px;
      margin-bottom: 6px;
    }
    .quadro-titulo-transf {
      border: 1px solid #000;
      padding: 3px 6px;
      display: flex;
      justify-content: space-between;
      font-size: 9.5pt;
      font-weight: bold;
      background: #f8fafc;
      margin-bottom: 4px;
    }
    .box-dados-transf {
      border: 1px solid #000;
      padding: 4px 6px;
      font-size: 8pt;
      margin-bottom: 6px;
    }
    .tabela-transf {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #000;
      margin-top: 4px;
    }
    .tabela-transf th {
      border-bottom: 1px solid #000;
      background: #f1f5f9;
      padding: 3px 5px;
      font-size: 8pt;
      text-align: left;
    }
    .tabela-transf td {
      border-bottom: 1px dotted #cbd5e1;
      padding: 3px 5px;
      font-size: 8pt;
    }
    .bloco-assinaturas {
      display: flex;
      justify-content: space-around;
      margin-top: 40px;
    }
    .linha-visto {
      border-top: 1px solid #000;
      width: 200px;
      text-align: center;
      padding-top: 3px;
      font-size: 8pt;
    }
  </style>
</head>
<body>
  <div class="folha-a4">
    <div>
      <div class="header-transf">
        <div style="display: flex; justify-content: space-between; font-size: 8.5pt;">
          <div>
            <strong>RARUS TECNOLOGIA E SERVICOS LTDA</strong><br>
            End.: AV. NOVO HORIZONTE, Bairro: ROTA DO SOL, SORRISO - MT<br>
            Telefone: (65) 99281-5160
          </div>
          <div style="text-align: right; font-size: 7.5pt; color: #475569;">
            TGA Sistemas (65) 3339-0800
          </div>
        </div>
      </div>

      <div class="quadro-titulo-transf">
        <span>Transferência de Local de Est. (FISICO/FISCAL)</span>
        <span>Nº 0000538</span>
      </div>

      <div class="box-dados-transf">
        <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
          <span>Funcionário: <strong>Janaína Sousa</strong></span>
          <span>Emissão: <strong>{{dataHoje}} 00:00</strong></span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>Local de origem: <strong>222 - Uso/consumo Vinicius</strong></span>
          <span>Local de destino: <strong>666 - Uso/Consumo Caio D</strong></span>
        </div>
      </div>

      <div class="box-dados-transf">
        <strong>Observações:</strong><br>
        ACOMPANHA MALETA AMARELA Nº SERIE 21090154001026<br>
        1 CAPACITOR GANHO • 1 CAPACITOR ZERO • 1 CHAVE HARLOOCK
      </div>

      <div style="font-weight: bold; text-align: center; background: #e2e8f0; padding: 2px; border: 1px solid #000; font-size: 8pt;">
        PRODUTOS TRANSFERIDOS
      </div>
      <table class="tabela-transf">
        <thead>
          <tr>
            <th style="width: 80px;">Produto</th>
            <th>Descrição do Item</th>
            <th style="width: 140px;">Número de Série</th>
            <th style="width: 50px; text-align: center;">Quant.</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="font-family: monospace; font-weight: bold;">004880</td>
            <td>CONJ. CAPACITOR CALIBRACAO MUG SERIE 21090154001026</td>
            <td style="font-family: monospace;">21090154001026</td>
            <td style="text-align: center; font-weight: bold;">1</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top: 30px; text-align: center; font-size: 8pt;">
        SORRISO/MT, {{dataHoje}}
      </div>

      <div class="bloco-assinaturas">
        <div class="linha-visto">
          <strong>Janaína Sousa</strong><br>Expedição / Estoque
        </div>
        <div class="linha-visto">
          <strong>Caio Detz</strong><br>Gerente Técnico / Recebedor
        </div>
      </div>
    </div>

    <div style="border-top: 1px solid #ccc; padding-top: 4px; font-size: 7pt; color: #64748b; text-align: center;">
      RARUS TECNOLOGIA E SERVICOS • Documento emitido para controle interno de custódia e rastreabilidade metrológica.
    </div>
  </div>
</body>
</html>`;

// ==========================================
// 5. MODELO RELATÓRIO DE CONTAGEM DE ESTOQUE (A4)
// Fiel a: EXEMPLO RELATÓRIO CONTAGEM DE ESTOQUE.pdf
// ==========================================
const TEMPLATE_CONTAGEM_ESTOQUE = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Contagem de Estoque</title>
  <style>
    ${CSS_PADRAO_A4}
    .cabecalho-contagem {
      display: flex;
      justify-content: space-between;
      border-bottom: 2px double #000;
      padding-bottom: 4px;
      margin-bottom: 6px;
      font-size: 8.5pt;
    }
    .tabela-contagem {
      width: 100%;
      border-collapse: collapse;
      font-size: 8pt;
    }
    .tabela-contagem th {
      border-top: 2px solid #000;
      border-bottom: 2px solid #000;
      padding: 3px 4px;
      text-align: left;
    }
    .tabela-contagem td {
      border-bottom: 1px dotted #ccc;
      padding: 4px;
    }
  </style>
</head>
<body>
  <div class="folha-a4">
    <div>
      <div class="cabecalho-contagem">
        <div>
          <strong>RARUS TECNOLOGIA E SERVICOS LTDA - MATRIZ</strong><br>
          <span style="font-size: 10pt; font-weight: bold;">Contagem de Estoque e Inventário Físico</span>
        </div>
        <div style="text-align: right;">
          Página 1 de 1<br>
          Data Emissão: {{dataHoje}}
        </div>
      </div>

      <table class="tabela-contagem">
        <thead>
          <tr>
            <th>Produto / Código</th>
            <th>Grupo</th>
            <th>Fabricante</th>
            <th>Prateleira</th>
            <th style="text-align: right;">Estoque Sistema</th>
            <th style="text-align: center; width: 120px;">Contagem Física</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>005202</strong> - PCI PRINCIPAL G1000</td>
            <td>00010 - Peças p/ Venda</td>
            <td>001 - GEHAKA</td>
            <td>A-02</td>
            <td style="text-align: right; font-weight: bold;">3,0000</td>
            <td style="text-align: center; font-family: monospace;">................................</td>
          </tr>
          <tr>
            <td><strong>004622</strong> - KNOB DE BORRACHA BK</td>
            <td>00010 - Peças p/ Venda</td>
            <td>001 - GEHAKA</td>
            <td>B-01</td>
            <td style="text-align: right; font-weight: bold;">12,0000</td>
            <td style="text-align: center; font-family: monospace;">................................</td>
          </tr>
          <tr>
            <td><strong>004514</strong> - FONTE ALIMENTAÇÃO 9V 1A</td>
            <td>00010 - Peças p/ Venda</td>
            <td>001 - GEHAKA</td>
            <td>A-04</td>
            <td style="text-align: right; font-weight: bold;">5,0000</td>
            <td style="text-align: center; font-family: monospace;">................................</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="display: flex; justify-content: space-between; border-top: 1px solid #000; padding-top: 8px; font-size: 8pt;">
      <div>Conferente Responsável: __________________________________</div>
      <div>Visto do Supervisor: __________________________________</div>
    </div>
  </div>
</body>
</html>`;

// ==========================================
// 6. MODELO DANFE NF-E (A4)
// Fiel a: EXEMPLO MODELO NF-e.pdf
// ==========================================
const TEMPLATE_DANFE_NFE = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>DANFE NF-e {{os.numero}}</title>
  <style>
    ${CSS_PADRAO_A4}
    .quadro-nfe {
      border: 1px solid #000;
      padding: 2px 4px;
      font-size: 7.5pt;
      margin-bottom: 3px;
    }
    .titulo-nfe-secao {
      font-size: 7pt;
      font-weight: bold;
      text-transform: uppercase;
      background: #f8fafc;
      border-bottom: 1px solid #000;
      padding: 1px 2px;
      margin-bottom: 2px;
    }
  </style>
</head>
<body>
  <div class="folha-a4">
    <div>
      <!-- CANHOTO -->
      <div class="quadro-nfe" style="display: flex; justify-content: space-between;">
        <div style="font-size: 6.8pt; width: 80%;">
          RECEBEMOS DE RARUS TECNOLOGIA E SERVICOS LTDA OS PRODUTOS/SERVIÇOS CONSTANTES DA NOTA FISCAL INDICADA AO LADO.<br>
          EMISSÃO: {{dataHoje}} • DEST.: {{cliente.nome}} • VALOR TOTAL: {{totais.liquido}}
        </div>
        <div style="border-left: 1px solid #000; padding-left: 6px; text-align: center; width: 20%;">
          <strong>NF-e</strong><br>
          Nº 000.003.072<br>SÉRIE 001
        </div>
      </div>

      <!-- CABEÇALHO DANFE -->
      <div class="quadro-nfe" style="display: grid; grid-template-columns: 1.5fr 1fr 1.5fr; gap: 6px;">
        <div>
          <strong style="font-size: 9pt;">RARUS TECNOLOGIA E SERVICOS LTDA</strong><br>
          AV. NOVO HORIZONTE, 1056 - ROTA DO SOL<br>
          SORRISO - MT - FONE: (65) 99281-5160<br>
          CNPJ: 45.179.602/0001-96 • IE: 13.920.394-0
        </div>
        <div style="text-align: center; border-left: 1px solid #000; border-right: 1px solid #000;">
          <strong style="font-size: 11pt;">DANFE</strong><br>
          <span style="font-size: 7pt;">DOCUMENTO AUXILIAR DA NOTA FISCAL ELETRÔNICA</span><br>
          1 - SAÍDA<br>
          <strong>Nº 000.003.072</strong><br>SÉRIE 001
        </div>
        <div style="text-align: center;">
          <div style="font-family: monospace; font-size: 8pt; font-weight: bold;">CHAVE DE ACESSO</div>
          <div style="font-family: monospace; font-size: 7.5pt;">5126 0745 1796 0200 0196 5500 1000 0030 7210 0167 6293</div>
          <div style="font-size: 6.5pt; color: #475569; margin-top: 4px;">Consulta de autenticidade no portal nacional da NF-e www.nfe.fazenda.gov.br</div>
        </div>
      </div>

      <!-- DESTINATÁRIO -->
      <div class="quadro-nfe">
        <div class="titulo-nfe-secao">Destinatário / Remetente</div>
        <div style="display: flex; justify-content: space-between;">
          <span>NOME: <strong>{{cliente.nome}}</strong></span>
          <span>CNPJ/CPF: <strong>{{cliente.cnpj}}</strong></span>
          <span>DATA EMISSÃO: <strong>{{dataHoje}}</strong></span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 2px;">
          <span>ENDEREÇO: {{cliente.endereco}}</span>
          <span>CIDADE: {{cliente.cidade}} - {{cliente.uf}}</span>
          <span>CEP: {{cliente.cep}}</span>
        </div>
      </div>

      <!-- PRODUTOS -->
      <div class="quadro-nfe">
        <div class="titulo-nfe-secao">Dados dos Produtos / Serviços</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 7pt;">
          <thead>
            <tr style="background: #f1f5f9; border-bottom: 1px solid #000;">
              <th>CÓDIGO</th>
              <th>DESCRIÇÃO</th>
              <th>NCM/SH</th>
              <th>CFOP</th>
              <th>UN</th>
              <th>QTD</th>
              <th>VLR UNIT</th>
              <th>VLR TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {{tabelaPecas}}
          </tbody>
        </table>
      </div>

      <!-- DADOS ADICIONAIS -->
      <div class="quadro-nfe">
        <div class="titulo-nfe-secao">Informações Complementares</div>
        <div style="font-size: 7pt; line-height: 1.4;">
          OS VINCULADA: {{os.numero}} • EQUIPAMENTO: {{equipamento.modelo}} SÉRIE: {{equipamento.serie}}<br>
          Condição Pagamento: 15 dias • Atendente: Caio Detz<br>
          PRODUTO DESTINADO A APLICAÇÃO EM MANUTENÇÃO TÉCNICA ESPECIALIZADA.
        </div>
      </div>
    </div>

    <div style="font-size: 6.5pt; text-align: center; border-top: 1px solid #ccc; padding-top: 3px;">
      Emissão autorizada sob protocolo SEFAZ/MT 151260063016172 • Sistema RARUS ERP
    </div>
  </div>
</body>
</html>`;

// ==========================================
// 7. MODELO CERTIFICADO BALANÇA DE PRECISÃO (A4)
// ==========================================
const TEMPLATE_CERT_BALANCA = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Certificado de Calibração Balança de Precisão - RARUS</title>
  <style>
    ${CSS_PADRAO_A4}
    .cabecalho-balanca {
      border-bottom: 2px solid #000;
      padding-bottom: 4px;
      margin-bottom: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  </style>
</head>
<body>
  <div class="folha-a4">
    <div>
      <div class="cabecalho-balanca">
        <div style="font-weight: 900; font-size: 15pt; color: #0284c7;">RARUS METROLOGIA</div>
        <div style="text-align: center;">
          <div style="font-size: 11pt; font-weight: bold;">CERTIFICADO DE CALIBRAÇÃO DE BALANÇA</div>
          <div style="font-size: 9pt;">Rastreabilidade RBC • Nº {{os.numero}}-B/26</div>
        </div>
        <div style="text-align: right; font-size: 7.5pt;">Data: {{dataHoje}}</div>
      </div>

      <div style="border: 1px solid #000; padding: 4px 6px; margin-bottom: 6px; font-size: 8pt;">
        <strong>Cliente:</strong> {{cliente.nome}}<br>
        <strong>Equipamento:</strong> Balança de Precisão • <strong>Marca:</strong> GEHAKA • <strong>Modelo:</strong> BG 1000<br>
        <strong>Série:</strong> {{equipamento.serie}} • <strong>Capacidade:</strong> 1000 g • <strong>Divisão:</strong> 0,01 g
      </div>

      <div style="font-weight: bold; font-size: 8.5pt; margin-bottom: 3px;">Ensaio de Repetibilidade e Excentricidade de Carga</div>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 7.5pt; text-align: center;">
        <thead>
          <tr style="background: #f8fafc; border-bottom: 1px solid #000;">
            <th>Posição da Carga</th>
            <th>Carga Aplicada (g)</th>
            <th>Indicação Lida (g)</th>
            <th>Erro (g)</th>
            <th>Incerteza U (k=2)</th>
            <th>Resultado</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Centro</td><td>500,00</td><td>500,01</td><td>+0,01</td><td>± 0,02 g</td><td><strong>APROVADO</strong></td></tr>
          <tr><td>Frente</td><td>500,00</td><td>500,00</td><td>0,00</td><td>± 0,02 g</td><td><strong>APROVADO</strong></td></tr>
          <tr><td>Fundo</td><td>500,00</td><td>500,01</td><td>+0,01</td><td>± 0,02 g</td><td><strong>APROVADO</strong></td></tr>
          <tr><td>Esquerda</td><td>500,00</td><td>499,99</td><td>-0,01</td><td>± 0,02 g</td><td><strong>APROVADO</strong></td></tr>
          <tr><td>Direita</td><td>500,00</td><td>500,00</td><td>0,00</td><td>± 0,02 g</td><td><strong>APROVADO</strong></td></tr>
        </tbody>
      </table>

      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px;">
        <div style="text-align: center;">
          <div style="border-top: 1px solid #000; width: 220px; margin: 0 auto 3px auto;"></div>
          <div style="font-weight: bold; font-size: 8pt;">Caio Detz</div>
          <div style="font-size: 7pt;">Responsável Técnico Metrológico</div>
        </div>
        <div style="text-align: center;">
          {{qrcode}}
          <div style="font-size: 6.5pt;">Certificado Rastreável RBC</div>
        </div>
      </div>
    </div>

    <div style="font-size: 6.8pt; color: #475569; border-top: 1px solid #000; padding-top: 3px; text-align: center;">
      RARUS TECNOLOGIA E SERVICOS LTDA • Autorizado pelo órgão metrológico sob o nº 51000352
    </div>
  </div>
</body>
</html>`;

// ==========================================
// CATÁLOGO DE MODELOS NATIVOS
// ==========================================
export const MODELOS_DOCUMENTO_PADRAO: ModeloDocumentoRelatorio[] = [
  {
    id: 'modelo-os-completa',
    codigo: 'MOD-OS-01',
    nome: 'Ordem de Serviço Completa (A4)',
    descricao: 'Modelo A4 oficial com cabeçalho duplo, dados do cliente, equipamentos, laudo técnico, serviços e produtos com NCM e rodapé metrológico.',
    categoria: 'Ordem de Serviço',
    tipoMovimentoVinculado: 'Ordem de Serviço',
    disponivelNaImpressaoOS: true,
    formatoPapel: 'A4 Retrato',
    templateHtml: TEMPLATE_OS_COMPLETA,
    versao: 'REV 04',
    dataAtualizacao: '2026-09-02',
    ativo: true,
    variaveisDisponiveis: [
      'os.numero', 'os.data', 'cliente.nome', 'cliente.cnpj', 'equipamento.modelo',
      'equipamento.serie', 'tabelaServicos', 'tabelaPecas', 'totais.liquido'
    ],
  },
  {
    id: 'modelo-etiqueta-lab',
    codigo: 'MOD-ETQ-02',
    nome: 'Etiqueta de Equipamento Lab (com QR Code)',
    descricao: 'Etiqueta para colagem em instrumentos no laboratório com OS, cliente, 8 etapas com checkbox de controle e QR Code dinâmico da OS.',
    categoria: 'Etiquetas',
    tipoMovimentoVinculado: 'Ordem de Serviço',
    disponivelNaImpressaoOS: true,
    formatoPapel: 'Etiqueta Lab',
    templateHtml: TEMPLATE_ETIQUETA_LAB,
    versao: 'FOR-PRO-02-07 REV00',
    dataAtualizacao: '2026-09-02',
    ativo: true,
    variaveisDisponiveis: ['os.numero', 'os.data', 'cliente.nome', 'equipamento.serie', 'qrcode'],
  },
  {
    id: 'modelo-cert-umidade',
    codigo: 'MOD-CERT-01',
    nome: 'Certificado de Calibração — Medidor de Umidade',
    descricao: 'Certificado metrológico oficial A4 para medidores de umidade de grãos (GEHAKA G650i/G810) com rastreabilidade RBC e ensaios.',
    categoria: 'Certificados',
    tipoMovimentoVinculado: 'Calibração',
    disponivelNaImpressaoOS: true,
    formatoPapel: 'A4 Retrato',
    templateHtml: TEMPLATE_CERT_UMIDADE,
    versao: 'ISO 17025 V2',
    dataAtualizacao: '2026-09-02',
    ativo: true,
    variaveisDisponiveis: ['os.numero', 'cliente.nome', 'equipamento.serie', 'dataHoje', 'qrcode'],
  },
  {
    id: 'modelo-cert-balanca',
    codigo: 'MOD-CERT-02',
    nome: 'Certificado de Calibração — Balança de Precisão',
    descricao: 'Certificado metrológico oficial A4 para balanças analíticas e de precisão com ensaio de excentricidade e repetibilidade.',
    categoria: 'Certificados',
    tipoMovimentoVinculado: 'Calibração',
    disponivelNaImpressaoOS: true,
    formatoPapel: 'A4 Retrato',
    templateHtml: TEMPLATE_CERT_BALANCA,
    versao: 'ISO 17025 V1',
    dataAtualizacao: '2026-09-02',
    ativo: true,
    variaveisDisponiveis: ['os.numero', 'cliente.nome', 'equipamento.serie', 'dataHoje', 'qrcode'],
  },
  {
    id: 'modelo-relatorio-transferencia',
    codigo: 'MOD-TRF-01',
    nome: 'Relatório de Transferência de Estoque (FÍSICO/FISCAL)',
    descricao: 'Comprovante do Movimento 3.1.03 com local de origem, destino, produtos com número de série e assinaturas digitais.',
    categoria: 'Estoque',
    tipoMovimentoVinculado: '3.1.03 - Transferência de Estoque',
    disponivelNaImpressaoOS: false,
    formatoPapel: 'A4 Retrato',
    templateHtml: TEMPLATE_RELATORIO_TRANSFERENCIA,
    versao: 'REV 01',
    dataAtualizacao: '2026-09-02',
    ativo: true,
    variaveisDisponiveis: ['dataHoje'],
  },
  {
    id: 'modelo-relatorio-contagem',
    codigo: 'MOD-CTG-01',
    nome: 'Relatório de Contagem e Inventário de Estoque',
    descricao: 'Folha de contagem física de inventário com colunas de conferência manual à caneta para auditoria de almoxarifado.',
    categoria: 'Estoque',
    tipoMovimentoVinculado: 'Contagem de Estoque',
    disponivelNaImpressaoOS: false,
    formatoPapel: 'A4 Retrato',
    templateHtml: TEMPLATE_CONTAGEM_ESTOQUE,
    versao: 'REV 02',
    dataAtualizacao: '2026-09-02',
    ativo: true,
    variaveisDisponiveis: ['dataHoje'],
  },
  {
    id: 'modelo-danfe-nfe',
    codigo: 'MOD-NFE-01',
    nome: 'DANFE Documento Auxiliar da Nota Fiscal Eletrônica (NF-e)',
    descricao: 'Espelho padrão SEFAZ do DANFE de saída de mercadorias e remessas vinculadas às ordens de serviço.',
    categoria: 'Fiscal',
    tipoMovimentoVinculado: 'Venda/Saída NF-e',
    disponivelNaImpressaoOS: true,
    formatoPapel: 'A4 Retrato',
    templateHtml: TEMPLATE_DANFE_NFE,
    versao: 'DANFE 4.0',
    dataAtualizacao: '2026-09-02',
    ativo: true,
    variaveisDisponiveis: ['os.numero', 'cliente.nome', 'totais.liquido', 'dataHoje'],
  },
];

const LOCAL_STORAGE_KEY = 'rarus_modelos_relatorios_v1';

export const ModelosRelatorioService = {
  listar(): ModeloDocumentoRelatorio[] {
    if (typeof window === 'undefined') return MODELOS_DOCUMENTO_PADRAO;
    try {
      const salvo = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (salvo) {
        return JSON.parse(salvo);
      }
    } catch {
      // Fallback
    }
    return MODELOS_DOCUMENTO_PADRAO;
  },

  obterPorId(id: string): ModeloDocumentoRelatorio | undefined {
    return this.listar().find((m) => m.id === id);
  },

  listarPorMovimento(tipoMovimento: string): ModeloDocumentoRelatorio[] {
    return this.listar().filter((m) => m.ativo && m.tipoMovimentoVinculado === tipoMovimento);
  },

  listarDisponiveisOS(): ModeloDocumentoRelatorio[] {
    return this.listar().filter((m) => m.ativo && m.disponivelNaImpressaoOS);
  },

  salvar(modelo: ModeloDocumentoRelatorio): ModeloDocumentoRelatorio {
    const lista = this.listar();
    const index = lista.findIndex((m) => m.id === modelo.id);
    let atualizado: ModeloDocumentoRelatorio[];

    if (index >= 0) {
      atualizado = [...lista];
      atualizado[index] = {
        ...modelo,
        dataAtualizacao: new Date().toISOString().split('T')[0],
      };
    } else {
      atualizado = [
        ...lista,
        {
          ...modelo,
          dataAtualizacao: new Date().toISOString().split('T')[0],
        },
      ];
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(atualizado));
      } catch (err) {
        console.error('Erro ao persistir modelo no localStorage:', err);
      }
    }

    return modelo;
  },

  duplicar(id: string): ModeloDocumentoRelatorio | null {
    const original = this.obterPorId(id);
    if (!original) return null;

    const copia: ModeloDocumentoRelatorio = {
      ...original,
      id: `mod-custom-${Date.now()}`,
      codigo: `${original.codigo || 'MOD'}-COP`,
      nome: `${original.nome} (Cópia)`,
      dataAtualizacao: new Date().toISOString().split('T')[0],
    };

    return this.salvar(copia);
  },

  excluir(id: string): boolean {
    const lista = this.listar();
    const filtrada = lista.filter((m) => m.id !== id);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtrada));
      } catch {
        // Ignore
      }
    }
    return true;
  },

  restaurarPadroes(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  },
};
