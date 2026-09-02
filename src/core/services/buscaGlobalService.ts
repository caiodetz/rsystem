import { ItemBuscaGlobal } from '../types';
import { ClientesService } from './clientesService';
import { EquipamentosService } from './equipamentosService';
import { OrdensServicoService } from './ordensServicoService';
import { PadroesBasaisService } from './padroesBasaisService';
import { EstoqueService } from './estoqueService';
import { RelatosService } from './relatosService';

export const BuscaGlobalService = {
  async buscar(termo: string): Promise<ItemBuscaGlobal[]> {
    if (!termo || termo.trim().length === 0) return [];
    const q = termo.trim().toLowerCase();
    const resultados: ItemBuscaGlobal[] = [];

    // 1. COMANDOS RÁPIDOS DIRETOS (Abertura imediata de telas/relatórios)
    if ('contagem de estoque'.includes(q) || 'estoque'.includes(q)) {
      resultados.push({
        id: 'cmd-estoque',
        titulo: 'Relatório: Contagem de Estoque',
        subtitulo: 'Executar contagem física e fiscal de peças e serviços',
        tipo: 'relatorio',
        tagBadge: 'RELATÓRIO / AÇÃO',
        moduloAlvo: 'estoque',
        rota: '/relatorios?tipo=estoque',
        comandoAcao: 'abrir_contagem_estoque',
      });
    }

    if ('nova ordem de serviço'.includes(q) || 'nova os'.includes(q) || 'abrir os'.includes(q)) {
      resultados.push({
        id: 'cmd-nova-os',
        titulo: 'Comando: Abrir Nova Ordem de Serviço',
        subtitulo: 'Cadastrar nova OS com múltiplos equipamentos',
        tipo: 'os',
        tagBadge: 'AÇÃO RÁPIDA',
        moduloAlvo: 'ordens-servico',
        rota: '/ordens-servico?acao=nova',
        comandoAcao: 'abrir_nova_os',
      });
    }

    if ('novo cliente'.includes(q) || 'cadastrar cliente'.includes(q)) {
      resultados.push({
        id: 'cmd-novo-cli',
        titulo: 'Comando: Cadastrar Novo Cliente',
        subtitulo: 'Adicionar nova planta industrial ou cliente agrícola',
        tipo: 'cliente',
        tagBadge: 'AÇÃO RÁPIDA',
        moduloAlvo: 'clientes',
        rota: '/clientes?acao=novo',
        comandoAcao: 'abrir_novo_cliente',
      });
    }

    if ('etiqueta'.includes(q) || 'imprimir etiqueta'.includes(q)) {
      resultados.push({
        id: 'cmd-etiquetas',
        titulo: 'Relatório: Etiquetas de Identificação com QR Code',
        subtitulo: 'Impressão para rolo térmico Elgin / Zebra de calibração',
        tipo: 'relatorio',
        tagBadge: 'RELATÓRIO',
        moduloAlvo: 'relatorios',
        rota: '/relatorios?tipo=etiquetas',
        comandoAcao: 'abrir_etiquetas',
      });
    }

    if ('orçamento'.includes(q) || 'proposta'.includes(q)) {
      resultados.push({
        id: 'cmd-orcamento',
        titulo: 'Relatório: Orçamentos e Propostas de Calibração',
        subtitulo: 'Visualizar e gerar orçamento comercial para cliente',
        tipo: 'relatorio',
        tagBadge: 'RELATÓRIO',
        moduloAlvo: 'relatorios',
        rota: '/relatorios?tipo=orcamento',
        comandoAcao: 'abrir_orcamentos',
      });
    }

    if ('vencimento'.includes(q) || 'calibrações a vencer'.includes(q)) {
      resultados.push({
        id: 'cmd-vencimento',
        titulo: 'Relatório: Equipamentos com Vencimento Anual',
        subtitulo: 'Prospecção comercial e contato preventivo de safra',
        tipo: 'relatorio',
        tagBadge: 'RELATÓRIO',
        moduloAlvo: 'relatorios',
        rota: '/relatorios?tipo=vencimentos-anual',
        comandoAcao: 'abrir_vencimentos',
      });
    }

    // 2. BUSCA EM CLIENTES
    const clientes = await ClientesService.listar(q);
    clientes.slice(0, 4).forEach((c) => {
      resultados.push({
        id: `bus-cli-${c.id}`,
        titulo: c.razaoSocial,
        subtitulo: `${c.nomeFantasia} • CNPJ: ${c.cnpj} • ${c.cidade}/${c.estado}`,
        tipo: 'cliente',
        tagBadge: 'CLIENTE',
        moduloAlvo: 'clientes',
        rota: `/clientes?id=${c.id}`,
      });
    });

    // 3. BUSCA EM ORDENS DE SERVIÇO
    const ordens = await OrdensServicoService.listar({ busca: q });
    ordens.slice(0, 4).forEach((os) => {
      resultados.push({
        id: `bus-os-${os.id}`,
        titulo: `OS #${os.numero} - ${os.clienteNome}`,
        subtitulo: `${os.tipo} • Status: ${os.status} • Técnico: ${os.tecnicoNome}`,
        tipo: 'os',
        tagBadge: `OS ● ${os.status}`,
        moduloAlvo: 'ordens-servico',
        rota: `/ordens-servico?numero=${os.numero}`,
      });
    });

    // 4. BUSCA EM EQUIPAMENTOS
    const equips = await EquipamentosService.listar({ busca: q });
    equips.slice(0, 4).forEach((e) => {
      resultados.push({
        id: `bus-eq-${e.id}`,
        titulo: `${e.modelo} (Série: ${e.numeroSerie})`,
        subtitulo: `${e.fabricante} • ${e.clienteNome} • Patrimônio: ${e.patrimonio || 'S/N'}`,
        tipo: 'equipamento',
        tagBadge: `INSTRUMENTO ● ${e.status}`,
        moduloAlvo: 'equipamentos',
        rota: `/equipamentos?id=${e.id}`,
      });
    });

    // 5. BUSCA EM PADRÕES BASAIS
    const padroes = await PadroesBasaisService.listar(q);
    padroes.slice(0, 3).forEach((p) => {
      resultados.push({
        id: `bus-pad-${p.id}`,
        titulo: `Padrão Basal [${p.codigoIdentificador}]: ${p.descricao}`,
        subtitulo: `Cert. RBC: ${p.certificadoRBC} • Validade: ${p.dataValidade}`,
        tipo: 'padrao',
        tagBadge: `PADRÃO ● ${p.status}`,
        moduloAlvo: 'padroes',
        rota: `/padroes?id=${p.id}`,
      });
    });

    // 6. BUSCA EM PEÇAS DE ESTOQUE
    const pecas = await EstoqueService.listarItens({ busca: q });
    pecas.slice(0, 3).forEach((peca) => {
      resultados.push({
        id: `bus-pec-${peca.id}`,
        titulo: `[${peca.codigo}] ${peca.descricao}`,
        subtitulo: `Tipo: ${peca.tipoItem === 'ProdutoPeca' ? 'Peça / Produto' : 'Peça de Serviço'} • R$ ${peca.precoVenda.toFixed(2)}`,
        tipo: 'estoque',
        tagBadge: 'ESTOQUE',
        moduloAlvo: 'estoque',
        rota: `/estoque?codigo=${peca.codigo}`,
      });
    });

    // 7. BUSCA EM CERTIFICADOS
    const certs = await RelatosService.listarCertificados();
    const certsFiltrados = certs.filter(
      (c) =>
        c.numero.toLowerCase().includes(q) ||
        c.clienteNome.toLowerCase().includes(q) ||
        c.equipamentoSerie.toLowerCase().includes(q)
    );
    certsFiltrados.slice(0, 3).forEach((c) => {
      resultados.push({
        id: `bus-cert-${c.id}`,
        titulo: `Certificado RBC #${c.numero}`,
        subtitulo: `${c.clienteNome} • ${c.equipamentoModelo} (${c.equipamentoSerie})`,
        tipo: 'calibracao',
        tagBadge: 'CERTIFICADO',
        moduloAlvo: 'calibracoes',
        rota: `/calibracoes?id=${c.id}`,
      });
    });

    return resultados;
  },
};
