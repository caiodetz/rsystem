import QRCode from 'qrcode';
import { OrdemServico, Cliente, Equipamento, OrdemServicoItemPeca, TransferenciaEstoque, ItemEstoque } from '@/core/types';

export interface ContextoRenderizacao {
  os?: OrdemServico | null;
  cliente?: Cliente | null;
  equipamento?: Equipamento | any | null;
  pecas?: OrdemServicoItemPeca[];
  transferencia?: TransferenciaEstoque | null;
  itensEstoque?: ItemEstoque[];
  dadosExtras?: Record<string, any>;
}

/**
 * Gera Data URL PNG para um texto de QR Code
 */
export async function gerarQrCodeDataUrl(texto: string): Promise<string> {
  try {
    return await QRCode.toDataURL(texto, {
      width: 180,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('Erro ao gerar QR Code:', err);
    return '';
  }
}

/**
 * Renderiza um template HTML substituindo as tags {{variavel}} pelo valor correspondente do contexto
 */
export async function renderizarTemplateHtml(
  templateHtml: string,
  contexto: ContextoRenderizacao
): Promise<string> {
  let html = templateHtml;

  const os = contexto.os;
  const cliente = contexto.cliente;
  const eq = contexto.equipamento || (os?.equipamentos && os.equipamentos[0]) || null;
  const pecas = contexto.pecas || os?.pecas || [];
  const extras = contexto.dadosExtras || {};

  // Formatações de Data
  const dataHoje = new Date().toLocaleDateString('pt-BR');
  const anoAtual = String(new Date().getFullYear());

  // Dados da OS
  const osNumero = os?.numero ? os.numero.padStart(7, '0') : '0005303';
  const osData = os?.dataAbertura || dataHoje;
  const osStatus = os?.status || 'Em Serviço';
  const osTecnico = os?.tecnicoNome || 'Caio Detz';
  const osPrevisao = os?.dataPrevisao || '08/09/2026';
  const osDefeito = os?.descricaoProblema || 'Manutenção preventiva e calibração periódica.';
  const osLaudo = os?.laudoTecnico || 'Manutenção preventiva geral com verificação metrológica.';

  // QR Code da OS
  let qrcodeUrl = '';
  if (html.includes('{{qrcode') || html.includes('{{qrcode_os}}')) {
    const trackingUrl = `https://rarustecnologia.com.br/rastreio-os?os=${osNumero}`;
    qrcodeUrl = await gerarQrCodeDataUrl(trackingUrl);
  }

  // Dados do Cliente
  const clienteNome = cliente?.razaoSocial || os?.clienteNome || 'FITOLAB PESQUISA E CONSULTORIA AGRICOLA LTDA';
  const clienteFantasia = cliente?.nomeFantasia || os?.clienteNome || 'FITOLAB';
  const clienteCodigo = cliente?.codigo || 'C01800';
  const clienteCnpj = cliente?.cnpj || '03.672.660/0001-07';
  const clienteInscricao = '13.920.394-0';
  const clienteEndereco = cliente?.endereco || 'RODOVIA BR 163, KM 726';
  const clienteBairro = 'AREA RURAL DE SORRISO';
  const clienteCidade = cliente?.cidade || 'SORRISO';
  const clienteUf = cliente?.estado || 'MT';
  const clienteCep = cliente?.cep || '78898-899';
  const clienteContato = cliente?.contatoResponsavel || 'RAFAEL';
  const clienteEmail = cliente?.email || 'rafael.fitolab@gmail.com';
  const clienteFone = cliente?.telefone || '66-99918-8328';

  // Dados do Equipamento
  const eqModelo = eq?.modelo || 'G650I';
  const eqMarca = eq?.fabricante || 'GEHAKA';
  const eqSerie = eq?.numeroSerie || '16031014001017';
  const eqPatrimonio = eq?.patrimonio || 'N.C';
  const eqAno = eq?.anoFabricacao || '2016';
  const eqAcessorios = eq?.acessorios || 'BOLSA, FONTE, CUMBUCA, CAPA';
  const eqLacreAnt = eq?.lacreAnterior || 'N.A';
  const eqLacreNovo = eq?.lacreNovo || 'LAC-2026-4401';
  const eqSeloAnt = eq?.seloAnterior || 'N.A';
  const eqSeloNovo = eq?.seloNovo || 'SELO-INM-88910';
  const eqPortaria = eq?.portariaInmetro || 'Portaria INMETRO/DIMEL Nº 0296/2013';
  const eqDataServicoAnt = eq?.dataServicoAnterior || '04/07/2024';
  const eqDataCalib = eq?.dataUltimaCalibracao || '18/07/2025';

  // Cálculos e Tabelas de Peças e Serviços
  const servicosLista = pecas.filter((p) => p.tipoItem === 'Servico');
  const produtosLista = pecas.filter((p) => p.tipoItem === 'Peca' || p.tipoItem !== 'Servico');

  const totalServicos = servicosLista.reduce((s, p) => s + (p.valorTotal ?? p.quantidade * p.valorUnitario), 0);
  const totalProdutos = produtosLista.reduce((s, p) => s + (p.valorTotal ?? p.quantidade * p.valorUnitario), 0);
  const totalBruto = totalServicos + totalProdutos;
  const totalLiquido = totalBruto;

  // Renderizar Linhas de Serviços HTML
  const linhasServicosHtml = servicosLista.length > 0
    ? servicosLista.map((s) => `
        <tr>
          <td style="font-family: monospace; font-weight: bold; width: 80px;">${s.codigo || '000303'}</td>
          <td>${s.descricao}</td>
          <td style="text-align: center; width: 60px;">${s.quantidade.toFixed(2)}</td>
          <td style="text-align: right; width: 90px;">${s.valorUnitario.toFixed(2)}</td>
          <td style="text-align: right; width: 90px; font-weight: bold;">${(s.valorTotal ?? s.quantidade * s.valorUnitario).toFixed(2)}</td>
        </tr>
      `).join('')
    : `
        <tr>
          <td style="font-family: monospace; font-weight: bold; width: 80px;">000303</td>
          <td>SERV MED UMID GRAOS PORTATIL LAB</td>
          <td style="text-align: center; width: 60px;">1,00</td>
          <td style="text-align: right; width: 90px;">974,30</td>
          <td style="text-align: right; width: 90px; font-weight: bold;">974,30</td>
        </tr>
      `;

  // Renderizar Linhas de Produtos / Peças HTML
  const linhasProdutosHtml = produtosLista.length > 0
    ? produtosLista.map((p) => `
        <tr>
          <td style="font-family: monospace; font-weight: bold; width: 70px;">${p.codigo || '004622'}</td>
          <td>${p.descricao}</td>
          <td style="text-align: center; font-family: monospace; width: 90px;">${(p as any).ncm || '9033.00.00'}</td>
          <td style="text-align: center; width: 50px;">${p.quantidade.toFixed(2)}</td>
          <td style="text-align: right; width: 80px;">${p.valorUnitario.toFixed(2)}</td>
          <td style="text-align: right; width: 80px;">${(p.valorDesconto ? p.valorUnitario - p.valorDesconto : p.valorUnitario).toFixed(2)}</td>
          <td style="text-align: right; width: 85px; font-weight: bold;">${(p.valorTotal ?? p.quantidade * p.valorUnitario).toFixed(2)}</td>
        </tr>
      `).join('')
    : `
        <tr>
          <td style="font-family: monospace; font-weight: bold;">004622</td>
          <td>KNOB DE BORRACHA BK</td>
          <td style="text-align: center; font-family: monospace;">9033.00.00</td>
          <td style="text-align: center;">5,00</td>
          <td style="text-align: right;">27,60</td>
          <td style="text-align: right;">27,60</td>
          <td style="text-align: right; font-weight: bold;">138,00</td>
        </tr>
        <tr>
          <td style="font-family: monospace; font-weight: bold;">004523</td>
          <td>BATERIA 9V</td>
          <td style="text-align: center; font-family: monospace;">8506.80.90</td>
          <td style="text-align: center;">1,00</td>
          <td style="text-align: right;">16,80</td>
          <td style="text-align: right;">16,80</td>
          <td style="text-align: right; font-weight: bold;">16,80</td>
        </tr>
        <tr>
          <td style="font-family: monospace; font-weight: bold;">004514</td>
          <td>FONTE ALIMENTAÇÃO 9V 1A - PLUG FIXO</td>
          <td style="text-align: center; font-family: monospace;">8504.40.90</td>
          <td style="text-align: center;">1,00</td>
          <td style="text-align: right;">147,00</td>
          <td style="text-align: right;">147,00</td>
          <td style="text-align: right; font-weight: bold;">147,00</td>
        </tr>
        <tr>
          <td style="font-family: monospace; font-weight: bold;">004509</td>
          <td>ADESIVO DO PAINEL G650i</td>
          <td style="text-align: center; font-family: monospace;">9027.90.99</td>
          <td style="text-align: center;">1,00</td>
          <td style="text-align: right;">109,30</td>
          <td style="text-align: right;">109,30</td>
          <td style="text-align: right; font-weight: bold;">109,30</td>
        </tr>
        <tr>
          <td style="font-family: monospace; font-weight: bold;">005196</td>
          <td>PCI PRINCIPAL G610I/G650I VERSAO 2.0</td>
          <td style="text-align: center; font-family: monospace;">90279099</td>
          <td style="text-align: center;">1,00</td>
          <td style="text-align: right;">1.789,30</td>
          <td style="text-align: right;">1.789,30</td>
          <td style="text-align: right; font-weight: bold;">1.789,30</td>
        </tr>
      `;

  // Mapeamento de Tags
  const mapaTags: Record<string, string> = {
    '{{os.numero}}': osNumero,
    '{{os.dataAbertura}}': osData,
    '{{os.data}}': osData,
    '{{os.status}}': osStatus,
    '{{os.tecnicoNome}}': osTecnico,
    '{{os.atendente}}': osTecnico,
    '{{os.dataPrevisao}}': osPrevisao,
    '{{os.descricaoProblema}}': osDefeito,
    '{{os.laudoTecnico}}': osLaudo,
    '{{os.servicosExecutados}}': 'Manutenção corretiva e/ou preventiva, desmontagem e montagem, limpeza geral, calibração com certificado rastreado e testes finais com padrões de fábrica.',
    '{{cliente.nome}}': clienteNome,
    '{{cliente.razaoSocial}}': clienteNome,
    '{{cliente.nomeFantasia}}': clienteFantasia,
    '{{cliente.codigo}}': clienteCodigo,
    '{{cliente.cnpj}}': clienteCnpj,
    '{{cliente.inscricaoEstadual}}': clienteInscricao,
    '{{cliente.endereco}}': clienteEndereco,
    '{{cliente.bairro}}': clienteBairro,
    '{{cliente.cidade}}': clienteCidade,
    '{{cliente.uf}}': clienteUf,
    '{{cliente.cep}}': clienteCep,
    '{{cliente.contato}}': clienteContato,
    '{{cliente.email}}': clienteEmail,
    '{{cliente.telefone}}': clienteFone,
    '{{equipamento.modelo}}': eqModelo,
    '{{equipamento.fabricante}}': eqMarca,
    '{{equipamento.marca}}': eqMarca,
    '{{equipamento.numeroSerie}}': eqSerie,
    '{{equipamento.serie}}': eqSerie,
    '{{equipamento.patrimonio}}': eqPatrimonio,
    '{{equipamento.anoFabricacao}}': eqAno,
    '{{equipamento.acessorios}}': eqAcessorios,
    '{{equipamento.lacreAnterior}}': eqLacreAnt,
    '{{equipamento.lacreNovo}}': eqLacreNovo,
    '{{equipamento.seloAnterior}}': eqSeloAnt,
    '{{equipamento.seloNovo}}': eqSeloNovo,
    '{{equipamento.portariaInmetro}}': eqPortaria,
    '{{equipamento.dataServicoAnterior}}': eqDataServicoAnt,
    '{{equipamento.dataCalibracao}}': eqDataCalib,
    '{{tabelaServicos}}': linhasServicosHtml,
    '{{tabelaPecas}}': linhasProdutosHtml,
    '{{totais.servicos}}': totalServicos > 0 ? `R$ ${totalServicos.toFixed(2)}` : 'R$ 974,30',
    '{{totais.produtos}}': totalProdutos > 0 ? `R$ ${totalProdutos.toFixed(2)}` : 'R$ 2.200,40',
    '{{totais.bruto}}': totalBruto > 0 ? `R$ ${totalBruto.toFixed(2)}` : 'R$ 3.174,70',
    '{{totais.desconto}}': 'Desc. 0,00% 0',
    '{{totais.liquido}}': totalLiquido > 0 ? `R$ ${totalLiquido.toFixed(2)}` : 'R$ 3.174,70',
    '{{qrcode}}': qrcodeUrl ? `<img src="${qrcodeUrl}" class="img-qrcode" alt="QR Code OS ${osNumero}" />` : '',
    '{{qrcode_os}}': qrcodeUrl ? `<img src="${qrcodeUrl}" class="img-qrcode" alt="QR Code OS ${osNumero}" />` : '',
    '{{qrcode_src}}': qrcodeUrl,
    '{{dataHoje}}': dataHoje,
    '{{anoAtual}}': anoAtual,
    ...extras,
  };

  // Substituição de todas as tags
  for (const [tag, valor] of Object.entries(mapaTags)) {
    html = html.split(tag).join(String(valor ?? ''));
  }

  return html;
}
