import { Equipamento } from '../types';
import { MOCK_EQUIPAMENTOS } from '../mock-db/data';

let equipamentos: Equipamento[] = [...MOCK_EQUIPAMENTOS];

export const EquipamentosService = {
  async listar(filtros?: {
    status?: string;
    tipoEquipamento?: string;
    clienteId?: string;
    busca?: string;
  }): Promise<Equipamento[]> {
    let resultado = [...equipamentos];

    if (filtros?.status && filtros.status !== 'Todos') {
      resultado = resultado.filter((e) => e.status === filtros.status);
    }

    if (filtros?.tipoEquipamento && filtros.tipoEquipamento !== 'Todos') {
      resultado = resultado.filter((e) => e.tipoEquipamento === filtros.tipoEquipamento);
    }

    if (filtros?.clienteId) {
      resultado = resultado.filter((e) => e.clienteId === filtros.clienteId);
    }

    if (filtros?.busca) {
      const q = filtros.busca.toLowerCase();
      resultado = resultado.filter(
        (e) =>
          e.numeroSerie.toLowerCase().includes(q) ||
          e.modelo.toLowerCase().includes(q) ||
          e.fabricante.toLowerCase().includes(q) ||
          e.clienteNome.toLowerCase().includes(q) ||
          (e.patrimonio && e.patrimonio.toLowerCase().includes(q)) ||
          (e.lacreNovo && e.lacreNovo.toLowerCase().includes(q)) ||
          (e.seloNovo && e.seloNovo.toLowerCase().includes(q))
      );
    }

    return resultado;
  },

  async obterPorId(id: string): Promise<Equipamento | null> {
    const item = equipamentos.find((e) => e.id === id);
    return item || null;
  },

  async criar(dados: Omit<Equipamento, 'id'>): Promise<Equipamento> {
    const novo: Equipamento = {
      ...dados,
      id: `eq-${Date.now()}`,
    };
    equipamentos.unshift(novo);
    return novo;
  },

  async atualizar(id: string, dados: Partial<Equipamento>): Promise<Equipamento | null> {
    const index = equipamentos.findIndex((e) => e.id === id);
    if (index === -1) return null;

    equipamentos[index] = { ...equipamentos[index], ...dados };
    return equipamentos[index];
  },

  async excluir(id: string): Promise<boolean> {
    const initialLen = equipamentos.length;
    equipamentos = equipamentos.filter((e) => e.id !== id);
    return equipamentos.length < initialLen;
  },
};
