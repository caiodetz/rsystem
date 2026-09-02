import { EstoqueLocal, ItemEstoque, MovimentacaoEstoque } from '../types';
import { MOCK_ESTOQUES, MOCK_ITENS_ESTOQUE, MOCK_MOVIMENTACOES } from '../mock-db/data';

let locais: EstoqueLocal[] = [...MOCK_ESTOQUES];
let itens: ItemEstoque[] = [...MOCK_ITENS_ESTOQUE];
let movimentacoes: MovimentacaoEstoque[] = [...MOCK_MOVIMENTACOES];

export const EstoqueService = {
  async listarLocais(): Promise<EstoqueLocal[]> {
    return locais;
  },

  async listarItens(filtro?: {
    localId?: string;
    tipoItem?: 'ProdutoPeca' | 'Servico';
    filtroSaldo?: 'todos' | 'saldo-zero' | 'saldo-positivo' | 'saldo-negativo';
    busca?: string;
  }): Promise<(ItemEstoque & { saldoLocalAtual?: number })[]> {
    let list = [...itens];

    if (filtro?.tipoItem) {
      list = list.filter((i) => i.tipoItem === filtro.tipoItem);
    }

    if (filtro?.busca) {
      const q = filtro.busca.toLowerCase();
      list = list.filter(
        (i) => i.codigo.toLowerCase().includes(q) || i.descricao.toLowerCase().includes(q)
      );
    }

    return list.map((item) => {
      const saldoLocal = filtro?.localId ? (item.saldosPorLocal[filtro.localId] ?? 0) : undefined;
      return {
        ...item,
        saldoLocalAtual: saldoLocal,
      };
    });
  },

  async transferirPecas(dados: {
    origemLocalId: string;
    destinoLocalId: string;
    itemCodigo: string;
    quantidade: number;
    numeroSerie?: string;
    responsavelNome: string;
    motivo: string;
  }): Promise<{ sucesso: boolean; mensagem: string }> {
    const item = itens.find((i) => i.codigo === dados.itemCodigo);
    if (!item) return { sucesso: false, mensagem: 'Item não localizado no catálogo.' };

    const saldoOrigem = item.saldosPorLocal[dados.origemLocalId] ?? 0;
    if (saldoOrigem < dados.quantidade) {
      return {
        sucesso: false,
        mensagem: `Saldo insuficiente no estoque de origem (Saldo atual: ${saldoOrigem}).`,
      };
    }

    // Abate da origem e soma no destino
    item.saldosPorLocal[dados.origemLocalId] = saldoOrigem - dados.quantidade;
    item.saldosPorLocal[dados.destinoLocalId] =
      (item.saldosPorLocal[dados.destinoLocalId] ?? 0) + dados.quantidade;

    // Registra movimentação
    const novaMov: MovimentacaoEstoque = {
      id: `mov-${Date.now()}`,
      dataHora: new Date().toLocaleString('pt-BR'),
      tipo: 'Transferencia',
      origemLocalId: dados.origemLocalId,
      destinoLocalId: dados.destinoLocalId,
      itemCodigo: dados.itemCodigo,
      itemDescricao: item.descricao,
      quantidade: dados.quantidade,
      numeroSerie: dados.numeroSerie,
      responsavelNome: dados.responsavelNome,
      status: 'Concluida',
      motivo: dados.motivo,
    };
    movimentacoes.unshift(novaMov);

    return { sucesso: true, mensagem: 'Transferência de estoque concluída com sucesso.' };
  },

  async solicitarRequisicao(dados: {
    origemLocalId: string; // ex: Central
    destinoLocalId: string; // ex: Técnico
    itemCodigo: string;
    quantidade: number;
    responsavelNome: string;
    motivo: string;
  }): Promise<MovimentacaoEstoque> {
    const item = itens.find((i) => i.codigo === dados.itemCodigo);
    const nova: MovimentacaoEstoque = {
      id: `req-${Date.now()}`,
      dataHora: new Date().toLocaleString('pt-BR'),
      tipo: 'Transferencia',
      origemLocalId: dados.origemLocalId,
      destinoLocalId: dados.destinoLocalId,
      itemCodigo: dados.itemCodigo,
      itemDescricao: item?.descricao || dados.itemCodigo,
      quantidade: dados.quantidade,
      responsavelNome: dados.responsavelNome,
      status: 'PendenteAprovacao',
      motivo: dados.motivo,
    };
    movimentacoes.unshift(nova);
    return nova;
  },

  async aprovarRequisicao(id: string, almoxarifeNome: string): Promise<boolean> {
    const mov = movimentacoes.find((m) => m.id === id);
    if (!mov || mov.status !== 'PendenteAprovacao') return false;

    if (mov.origemLocalId && mov.destinoLocalId) {
      const res = await this.transferirPecas({
        origemLocalId: mov.origemLocalId,
        destinoLocalId: mov.destinoLocalId,
        itemCodigo: mov.itemCodigo,
        quantidade: mov.quantidade,
        responsavelNome: almoxarifeNome,
        motivo: `Aprovação de requisição: ${mov.motivo || ''}`,
      });
      if (res.sucesso) {
        mov.status = 'Concluida';
        return true;
      }
    }
    return false;
  },

  async listarMovimentacoes(): Promise<MovimentacaoEstoque[]> {
    return movimentacoes;
  },
};
