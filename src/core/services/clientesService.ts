import { Cliente } from '../types';
import { MOCK_CLIENTES } from '../mock-db/data';

let clientes: Cliente[] = [...MOCK_CLIENTES];

export const ClientesService = {
  async listar(busca?: string): Promise<Cliente[]> {
    if (!busca) return clientes;
    const q = busca.toLowerCase();
    return clientes.filter(
      (c) =>
        c.razaoSocial.toLowerCase().includes(q) ||
        c.nomeFantasia.toLowerCase().includes(q) ||
        c.cnpj.includes(q) ||
        c.codigo.toLowerCase().includes(q) ||
        c.cidade.toLowerCase().includes(q) ||
        c.segmento.toLowerCase().includes(q)
    );
  },

  async obterPorId(id: string): Promise<Cliente | null> {
    const cli = clientes.find((c) => c.id === id);
    return cli || null;
  },

  async criar(dados: Omit<Cliente, 'id'>): Promise<Cliente> {
    const novo: Cliente = {
      ...dados,
      id: `cli-${Date.now()}`,
    };
    clientes.unshift(novo);
    return novo;
  },

  async atualizar(id: string, dados: Partial<Cliente>): Promise<Cliente | null> {
    const idx = clientes.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    clientes[idx] = { ...clientes[idx], ...dados };
    return clientes[idx];
  },

  async excluir(id: string): Promise<boolean> {
    const initLen = clientes.length;
    clientes = clientes.filter((c) => c.id !== id);
    return clientes.length < initLen;
  },
};
