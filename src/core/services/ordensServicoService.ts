import { OrdemServico, StatusOS, PrioridadeOS, TipoOS, OrdemServicoItemPeca } from '../types';
import { MOCK_ORDENS_SERVICO } from '../mock-db/data';
import { EstoqueService } from './estoqueService';

let ordens: OrdemServico[] = [...MOCK_ORDENS_SERVICO];

export const OrdensServicoService = {
  async listar(filtros?: {
    status?: string;
    prioridade?: string;
    tipo?: string;
    busca?: string;
    clienteId?: string;
  }): Promise<OrdemServico[]> {
    let list = [...ordens];

    if (filtros?.status && filtros.status !== 'Todos') {
      list = list.filter((os) => os.status === filtros.status);
    }

    if (filtros?.prioridade && filtros.prioridade !== 'Todas') {
      list = list.filter((os) => os.prioridade === filtros.prioridade);
    }

    if (filtros?.tipo && filtros.tipo !== 'Todos') {
      list = list.filter((os) => os.tipo === filtros.tipo);
    }

    if (filtros?.clienteId) {
      list = list.filter((os) => os.clienteId === filtros.clienteId);
    }

    if (filtros?.busca) {
      const q = filtros.busca.toLowerCase();
      list = list.filter(
        (os) =>
          os.numero.toLowerCase().includes(q) ||
          os.clienteNome.toLowerCase().includes(q) ||
          os.tecnicoNome.toLowerCase().includes(q) ||
          os.descricaoProblema.toLowerCase().includes(q) ||
          os.equipamentos.some(
            (eq) => eq.numeroSerie.toLowerCase().includes(q) || eq.modelo.toLowerCase().includes(q)
          )
      );
    }

    return list;
  },

  async obterPorNumeroOuId(termo: string): Promise<OrdemServico | null> {
    const limpo = termo.trim();
    const semZeros = limpo.replace(/^0+/, '');
    const comZeros = limpo.padStart(7, '0');

    const os = ordens.find(
      (o) =>
        o.id === limpo ||
        o.numero === limpo ||
        o.numero === semZeros ||
        o.numero === comZeros ||
        o.numero.padStart(7, '0') === comZeros ||
        (semZeros && o.numero.replace(/^0+/, '') === semZeros)
    );
    return os || null;
  },

  async obterPorId(id: string): Promise<OrdemServico | null> {
    return this.obterPorNumeroOuId(id);
  },

  async criar(dados: Omit<OrdemServico, 'id' | 'numero' | 'valorTotalServicos' | 'valorTotalPecas' | 'valorTotalGeral' | 'faturada'> & {
    numeroManual?: string;
  }): Promise<OrdemServico> {
    const maiorNum = ordens.reduce((max, o) => {
      const n = parseInt(o.numero, 10);
      return !isNaN(n) && n > max ? n : max;
    }, 1045);

    const proximoNum = dados.numeroManual || String(maiorNum + 1);
    const anoAtual = new Date().getFullYear().toString().slice(-2);

    // Atribui números sequenciais aos equipamentos
    const equipamentosComSeq = dados.equipamentos.map((eq, idx) => ({
      ...eq,
      numeroSequencial: idx + 1,
      certificadoNumero: `${proximoNum}-${idx + 1}/${anoAtual}`,
    }));

    const valorTotalServicos = dados.pecas
      .filter((p) => p.tipoItem === 'Servico')
      .reduce((sum, p) => sum + p.quantidade * p.valorUnitario, 0);

    const valorTotalPecas = dados.pecas
      .filter((p) => p.tipoItem === 'Peca')
      .reduce((sum, p) => sum + p.quantidade * p.valorUnitario, 0);

    const novaOS: OrdemServico = {
      ...dados,
      id: `os-${proximoNum}`,
      numero: proximoNum,
      equipamentos: equipamentosComSeq,
      valorTotalServicos,
      valorTotalPecas,
      valorTotalGeral: valorTotalServicos + valorTotalPecas,
      faturada: false,
    };

    ordens.unshift(novaOS);
    return novaOS;
  },

  async atualizar(id: string, dados: Partial<OrdemServico>): Promise<OrdemServico | null> {
    const idx = ordens.findIndex((o) => o.id === id || o.numero === id);
    if (idx === -1) return null;
    ordens[idx] = { ...ordens[idx], ...dados };
    return ordens[idx];
  },

  async excluir(id: string): Promise<boolean> {
    const initLen = ordens.length;
    ordens = ordens.filter((o) => o.id !== id && o.numero !== id);
    return ordens.length < initLen;
  },

  async atualizarStatus(id: string, novoStatus: StatusOS): Promise<OrdemServico | null> {
    const os = ordens.find((o) => o.id === id || o.numero === id);
    if (!os) return null;

    os.status = novoStatus;
    if (novoStatus === 'Equipamento Pronto' || novoStatus === 'Encerrada') {
      os.dataConclusao = new Date().toLocaleDateString('pt-BR');
    }

    if (novoStatus === 'Faturada') {
      os.faturada = true;
    }

    return os;
  },

  async adicionarPecaServico(
    osNumero: string,
    item: OrdemServicoItemPeca
  ): Promise<{ sucesso: boolean; mensagem: string; os?: OrdemServico }> {
    const os = ordens.find((o) => o.numero === osNumero || o.id === osNumero);
    if (!os) return { sucesso: false, mensagem: 'Ordem de Serviço não localizada.' };

    os.pecas.push(item);

    // Recalcula totais
    os.valorTotalServicos = os.pecas
      .filter((p) => p.tipoItem === 'Servico')
      .reduce((sum, p) => sum + p.quantidade * p.valorUnitario, 0);

    os.valorTotalPecas = os.pecas
      .filter((p) => p.tipoItem === 'Peca')
      .reduce((sum, p) => sum + p.quantidade * p.valorUnitario, 0);

    os.valorTotalGeral = os.valorTotalServicos + os.valorTotalPecas;

    return { sucesso: true, mensagem: 'Item lançado na OS com sucesso.', os };
  },
};
