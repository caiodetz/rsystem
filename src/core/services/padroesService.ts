import { PadraoReferencia } from '../types';
import { MOCK_PADROES } from '../mock-db/data';

let padroes: PadraoReferencia[] = [...MOCK_PADROES];

export const PadroesService = {
  async listar(busca?: string, grandeza?: string): Promise<PadraoReferencia[]> {
    let list = [...padroes];

    if (grandeza && grandeza !== 'Todas') {
      list = list.filter((p) => p.grandeza === grandeza);
    }

    if (busca) {
      const q = busca.toLowerCase();
      list = list.filter(
        (p) =>
          p.codigo.toLowerCase().includes(q) ||
          p.descricao.toLowerCase().includes(q) ||
          p.certificadoRBC.toLowerCase().includes(q) ||
          p.laboratorioRBC.toLowerCase().includes(q)
      );
    }

    return list;
  },

  async obterPorId(id: string): Promise<PadraoReferencia | null> {
    const pad = padroes.find((p) => p.id === id);
    return pad || null;
  },

  async criar(dados: Omit<PadraoReferencia, 'id'>): Promise<PadraoReferencia> {
    const novo: PadraoReferencia = {
      ...dados,
      id: `pad-${Date.now()}`,
    };
    padroes.unshift(novo);
    return novo;
  },

  async atualizar(id: string, dados: Partial<PadraoReferencia>): Promise<PadraoReferencia | null> {
    const idx = padroes.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    padroes[idx] = { ...padroes[idx], ...dados };
    return padroes[idx];
  },

  async excluir(id: string): Promise<boolean> {
    const init = padroes.length;
    padroes = padroes.filter((p) => p.id !== id);
    return padroes.length < init;
  },
};
