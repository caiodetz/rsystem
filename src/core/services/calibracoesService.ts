import { Calibracao } from '../types';
import { MOCK_CALIBRACOES } from '../mock-db/data';

let calibracoes: Calibracao[] = [...MOCK_CALIBRACOES];

export const CalibracoesService = {
  async listar(busca?: string): Promise<Calibracao[]> {
    if (!busca) return calibracoes;
    const q = busca.toLowerCase();
    return calibracoes.filter(
      (c) =>
        c.numeroCertificado.toLowerCase().includes(q) ||
        c.equipamentoTag.toLowerCase().includes(q) ||
        c.clienteNome.toLowerCase().includes(q) ||
        c.tecnicoResponsavel.toLowerCase().includes(q)
    );
  },

  async obterPorId(id: string): Promise<Calibracao | null> {
    const cal = calibracoes.find((c) => c.id === id || c.numeroCertificado === id);
    return cal || null;
  },

  async criar(dados: Omit<Calibracao, 'id' | 'numeroCertificado' | 'qrCodeHash'>): Promise<Calibracao> {
    const num = `CERT-RBC-${new Date().getFullYear()}-${String(calibracoes.length + 42).padStart(4, '0')}`;
    const novo: Calibracao = {
      ...dados,
      id: `cal-${Date.now()}`,
      numeroCertificado: num,
      qrCodeHash: `RSYS-AUTH-${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
    };
    calibracoes.unshift(novo);
    return novo;
  },

  async obterCertificado(id: string): Promise<Calibracao | null> {
    return this.obterPorId(id);
  },
};
