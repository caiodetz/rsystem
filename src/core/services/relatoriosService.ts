import { FiltroRelatorio, ResultadoRelatorio } from '../types';
import { MOCK_EQUIPAMENTOS, MOCK_ORDENS_SERVICO, MOCK_CLIENTES, MOCK_ITENS_ESTOQUE, MOCK_CERTIFICADOS } from '../mock-db/data';

export const RelatoriosService = {
  async gerarRelatorio(filtro: FiltroRelatorio): Promise<ResultadoRelatorio> {
    const dataHora = new Date().toLocaleString('pt-BR');

    switch (filtro.tipo) {
      case 'etiquetas': {
        const itens = MOCK_EQUIPAMENTOS.map((eq) => ({
          patrimonio: eq.patrimonio || 'S/N',
          modelo: eq.modelo,
          fabricante: eq.fabricante,
          numeroSerie: eq.numeroSerie,
          cliente: eq.clienteNome,
          dataCalibracao: eq.dataUltimaCalibracao,
          proximaCalibracao: eq.dataProximaCalibracao,
          lacreNovo: eq.lacreNovo || 'N/A',
          seloNovo: eq.seloNovo || 'N/A',
          qrCodeLink: `https://rarus.com.br/validar?serie=${eq.numeroSerie}`,
          tipoImpressao: 'Rolo Térmico Elgin 50x30mm / 100x50mm',
        }));

        return {
          id: `rel-etiq-${Date.now()}`,
          titulo: 'Etiquetas de Calibração e Identificação (Impressora Elgin / Rolo Térmico)',
          geradoEm: dataHora,
          periodo: 'Lote Atual',
          totalRegistros: itens.length,
          indicadores: {
            'Total de Etiquetas Prontas': itens.length,
            'Equipamentos com Lacre': itens.filter((i) => i.lacreNovo !== 'N/A').length,
            'Padrão Térmico': 'Elgin / Rolo Contínuo',
          },
          itens,
        };
      }

      case 'estoque': {
        let itensEstoque = MOCK_ITENS_ESTOQUE.map((item) => {
          const saldoLocal = filtro.estoqueLocalId
            ? item.saldosPorLocal[filtro.estoqueLocalId] ?? 0
            : Object.values(item.saldosPorLocal).reduce((a, b) => a + b, 0);

          return {
            codigo: item.codigo,
            descricao: item.descricao,
            tipoItem: item.tipoItem === 'ProdutoPeca' ? 'Peça / Produto' : 'Peça de Serviço',
            saldoFisico: saldoLocal,
            saldoFiscal: item.saldoFiscal,
            diferencaFisicoFiscal: saldoLocal - item.saldoFiscal,
            precoUnitario: `R$ ${item.precoVenda.toFixed(2)}`,
            valorTotalFisico: `R$ ${(saldoLocal * item.precoVenda).toFixed(2)}`,
            unidade: item.unidadeMedida,
          };
        });

        if (filtro.filtroSaldo === 'saldo-zero') {
          itensEstoque = itensEstoque.filter((i) => i.saldoFisico === 0);
        } else if (filtro.filtroSaldo === 'saldo-positivo') {
          itensEstoque = itensEstoque.filter((i) => i.saldoFisico > 0);
        } else if (filtro.filtroSaldo === 'saldo-negativo') {
          itensEstoque = itensEstoque.filter((i) => i.saldoFisico < 0);
        }

        return {
          id: `rel-est-${Date.now()}`,
          titulo: 'Relatório de Contagem de Estoque (Físico vs. Fiscal)',
          geradoEm: dataHora,
          periodo: 'Posição em Tempo Real',
          totalRegistros: itensEstoque.length,
          indicadores: {
            'Itens Listados': itensEstoque.length,
            'Local Filtrado': filtro.estoqueLocalId ? filtro.estoqueLocalId : 'Todos os Estoques',
            'Filtro de Saldo': filtro.filtroSaldo || 'todos',
          },
          itens: itensEstoque,
        };
      }

      case 'orcamento': {
        const itens = MOCK_ORDENS_SERVICO.map((os) => ({
          osNumero: os.numero,
          cliente: os.clienteNome,
          tipoOS: os.tipo,
          status: os.status,
          totalServicos: `R$ ${os.valorTotalServicos.toFixed(2)}`,
          totalPecas: `R$ ${os.valorTotalPecas.toFixed(2)}`,
          valorGeral: `R$ ${os.valorTotalGeral.toFixed(2)}`,
          condicoes: '28 dias DDL ou 5% à vista',
          validadeProposta: '15 dias',
        }));

        return {
          id: `rel-orc-${Date.now()}`,
          titulo: 'Relatório de Orçamentos e Propostas Comerciais',
          geradoEm: dataHora,
          periodo: 'Ano Corrente',
          totalRegistros: itens.length,
          indicadores: {
            'Total de Orçamentos': itens.length,
            'Valor Total Ofertado': `R$ ${MOCK_ORDENS_SERVICO.reduce((s, o) => s + o.valorTotalGeral, 0).toFixed(2)}`,
          },
          itens,
        };
      }

      case 'vencimentos-anual': {
        const itens = MOCK_EQUIPAMENTOS.map((eq) => ({
          patrimonio: eq.patrimonio || 'S/N',
          equipamento: `${eq.fabricante} ${eq.modelo}`,
          numeroSerie: eq.numeroSerie,
          cliente: eq.clienteNome,
          dataUltimaCalibracao: eq.dataUltimaCalibracao,
          dataProximaCalibracao: eq.dataProximaCalibracao,
          status: eq.status,
          diasAteVencer: Math.ceil(
            (new Date(eq.dataProximaCalibracao).getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24)
          ),
        }));

        return {
          id: `rel-venc-${Date.now()}`,
          titulo: 'Relatório Anual de Vencimento de Calibrações (Prospecção de Clientes)',
          geradoEm: dataHora,
          periodo: 'Próximos 12 Meses',
          totalRegistros: itens.length,
          indicadores: {
            'Equipamentos no Horizonte': itens.length,
            'Vencidos / Próximos': itens.filter((i) => i.diasAteVencer <= 30).length,
          },
          itens,
        };
      }

      case 'sla-os':
      default: {
        const itens = MOCK_ORDENS_SERVICO.map((os) => ({
          numero: os.numero,
          cliente: os.clienteNome,
          tipo: os.tipo,
          status: os.status,
          tecnico: os.tecnicoNome,
          abertura: os.dataAbertura,
          previsao: os.dataPrevisao,
          conclusao: os.dataConclusao || 'Em andamento',
          valorTotal: `R$ ${os.valorTotalGeral.toFixed(2)}`,
        }));

        return {
          id: `rel-sla-${Date.now()}`,
          titulo: 'Relatório de Desempenho e SLA de Ordens de Serviço',
          geradoEm: dataHora,
          periodo: 'Últimos 30 Dias',
          totalRegistros: itens.length,
          indicadores: {
            'OS Ativas': itens.filter((i) => i.status !== 'Encerrada' && i.status !== 'Cancelada').length,
            'Faturamento Total Previsto': `R$ ${MOCK_ORDENS_SERVICO.reduce((s, o) => s + o.valorTotalGeral, 0).toFixed(2)}`,
          },
          itens,
        };
      }
    }
  },
};
