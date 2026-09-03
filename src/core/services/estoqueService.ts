import { EstoqueLocal, ItemEstoque, MovimentacaoEstoque, TransferenciaEstoque } from '../types';
import { MOCK_ESTOQUES, MOCK_ITENS_ESTOQUE, MOCK_MOVIMENTACOES, MOCK_TRANSFERENCIAS } from '../mock-db/data';

let locais: EstoqueLocal[] = [...MOCK_ESTOQUES];
let itens: ItemEstoque[] = [...MOCK_ITENS_ESTOQUE];
let movimentacoes: MovimentacaoEstoque[] = [...MOCK_MOVIMENTACOES];
let transferencias: TransferenciaEstoque[] = [...MOCK_TRANSFERENCIAS];

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

  async listarTransferencias(filtro?: {
    busca?: string;
    status?: string;
    origemLocalId?: string;
    destinoLocalId?: string;
  }): Promise<TransferenciaEstoque[]> {
    let list = [...transferencias];

    if (filtro?.status && filtro.status !== 'todos') {
      list = list.filter((t) => t.status.toLowerCase() === filtro.status?.toLowerCase());
    }

    if (filtro?.origemLocalId && filtro.origemLocalId !== 'todos') {
      list = list.filter((t) => t.origemLocalId === filtro.origemLocalId);
    }

    if (filtro?.busca) {
      const q = filtro.busca.toLowerCase();
      list = list.filter(
        (t) =>
          t.numeroMovimento.toLowerCase().includes(q) ||
          t.identificador.toLowerCase().includes(q) ||
          t.funcionarioNome.toLowerCase().includes(q) ||
          t.origemLocalNome.toLowerCase().includes(q) ||
          t.destinoLocalNome.toLowerCase().includes(q) ||
          t.itens.some((it) => it.itemCodigo.toLowerCase().includes(q) || it.descricao.toLowerCase().includes(q))
      );
    }

    return list;
  },

  async obterTransferenciaPorId(id: string): Promise<TransferenciaEstoque | null> {
    return transferencias.find((t) => t.id === id || t.identificador === id) || null;
  },

  async salvarTransferencia(transf: TransferenciaEstoque): Promise<TransferenciaEstoque> {
    const idx = transferencias.findIndex((t) => t.id === transf.id);
    if (idx !== -1) {
      transferencias[idx] = transf;
      return transferencias[idx];
    } else {
      transferencias.unshift(transf);
      return transf;
    }
  },

  async criarTransferencia(
    dados: Omit<TransferenciaEstoque, 'id' | 'identificador' | 'numeroMovimento'>
  ): Promise<TransferenciaEstoque> {
    const nextNum = String(transferencias.length + 690).padStart(7, '0');
    const nextId = String(168540 + transferencias.length + 10);
    const nova: TransferenciaEstoque = {
      ...dados,
      id: `trf-${nextId}`,
      identificador: nextId,
      numeroMovimento: nextNum,
    };
    transferencias.unshift(nova);
    return nova;
  },

  async efetivarTransferencia(id: string): Promise<{ sucesso: boolean; mensagem: string }> {
    const t = transferencias.find((item) => item.id === id);
    if (!t) return { sucesso: false, mensagem: 'Movimento não localizado.' };
    if (t.status === 'Concluido') return { sucesso: false, mensagem: 'Este movimento já foi efetivado anteriormente.' };

    // Realiza as baixas e entradas de estoque
    for (const itemTrf of t.itens) {
      const itemEstoque = itens.find((i) => i.codigo === itemTrf.itemCodigo);
      if (itemEstoque) {
        const saldoOrigem = itemEstoque.saldosPorLocal[t.origemLocalId] ?? 0;
        itemEstoque.saldosPorLocal[t.origemLocalId] = Math.max(0, saldoOrigem - itemTrf.quantidade);
        const saldoDestino = itemEstoque.saldosPorLocal[t.destinoLocalId] ?? 0;
        itemEstoque.saldosPorLocal[t.destinoLocalId] = saldoDestino + itemTrf.quantidade;
      }
    }

    t.status = 'Concluido';
    return { sucesso: true, mensagem: `Movimento TF-${t.numeroMovimento} efetivado com sucesso! Estoques atualizados.` };
  },

  async cancelarTransferencia(id: string): Promise<{ sucesso: boolean; mensagem: string }> {
    const t = transferencias.find((item) => item.id === id);
    if (!t) return { sucesso: false, mensagem: 'Movimento não localizado.' };
    t.status = 'Cancelado';
    return { sucesso: true, mensagem: `Movimento TF-${t.numeroMovimento} cancelado com sucesso.` };
  },

  /**
   * Baixa física imediata ao lançar a peça na Ordem de Serviço (Decisão 1 do Usuário)
   */
  async baixarSaldoFisicoOS(dados: {
    itemCodigo: string;
    localId: string;
    quantidade: number;
    osNumero: string;
    responsavelNome?: string;
  }): Promise<{ sucesso: boolean; mensagem: string; saldoRestante?: number }> {
    const item = itens.find((i) => i.codigo === dados.itemCodigo);
    if (!item) return { sucesso: false, mensagem: 'Item não localizado no estoque.' };

    const saldoAtual = item.saldosPorLocal[dados.localId] ?? 0;
    // Decrementa o saldo físico no local (permite trabalhar ou alerta se insuficiente)
    const novoSaldo = Math.max(0, saldoAtual - dados.quantidade);
    item.saldosPorLocal[dados.localId] = novoSaldo;

    const mov: MovimentacaoEstoque = {
      id: `mov-os-${Date.now()}`,
      dataHora: new Date().toLocaleString('pt-BR'),
      tipo: 'SaidaOS',
      origemLocalId: dados.localId,
      itemCodigo: dados.itemCodigo,
      itemDescricao: item.descricao,
      quantidade: dados.quantidade,
      osNumero: dados.osNumero,
      responsavelNome: dados.responsavelNome || 'Técnico Responsável',
      status: 'Concluida',
      motivo: `Lançamento de peça na OS #${dados.osNumero}`,
    };
    movimentacoes.unshift(mov);

    return { sucesso: true, mensagem: 'Baixa física realizada com sucesso.', saldoRestante: novoSaldo };
  },

  /**
   * Estorno de saldo físico ao remover a peça da OS (Decisão 5 do Usuário)
   */
  async estornarSaldoFisicoOS(dados: {
    itemCodigo: string;
    localId: string;
    quantidade: number;
    osNumero: string;
    responsavelNome?: string;
  }): Promise<{ sucesso: boolean; mensagem: string; saldoRestante?: number }> {
    const item = itens.find((i) => i.codigo === dados.itemCodigo);
    if (!item) return { sucesso: false, mensagem: 'Item não localizado no estoque.' };

    const saldoAtual = item.saldosPorLocal[dados.localId] ?? 0;
    const novoSaldo = saldoAtual + dados.quantidade;
    item.saldosPorLocal[dados.localId] = novoSaldo;

    const mov: MovimentacaoEstoque = {
      id: `mov-est-${Date.now()}`,
      dataHora: new Date().toLocaleString('pt-BR'),
      tipo: 'Ajuste',
      origemLocalId: dados.localId,
      itemCodigo: dados.itemCodigo,
      itemDescricao: item.descricao,
      quantidade: dados.quantidade,
      osNumero: dados.osNumero,
      responsavelNome: dados.responsavelNome || 'Técnico Responsável',
      status: 'Concluida',
      motivo: `Estorno de peça removida da OS #${dados.osNumero}`,
    };
    movimentacoes.unshift(mov);

    return { sucesso: true, mensagem: 'Estorno físico de estoque concluído.', saldoRestante: novoSaldo };
  },

  /**
   * Baixa fiscal definitiva ao faturar a OS (Decisão 1 do Usuário)
   */
  async baixarSaldoFiscalFaturamento(dados: {
    osNumero: string;
    itensPecas: { itemCodigo: string; quantidade: number }[];
  }): Promise<{ sucesso: boolean; mensagem: string }> {
    for (const p of dados.itensPecas) {
      const item = itens.find((i) => i.codigo === p.itemCodigo);
      if (item && item.tipoItem === 'ProdutoPeca') {
        item.saldoFiscal = Math.max(0, item.saldoFiscal - p.quantidade);
      }
    }
    return { sucesso: true, mensagem: 'Baixa no estoque fiscal concluída pelo faturamento da OS.' };
  },
};
