import { UsuarioFuncionario } from '../types';
import { MOCK_FUNCIONARIOS } from '../mock-db/data';

let usuarios: UsuarioFuncionario[] = [...MOCK_FUNCIONARIOS];

export const UsuariosService = {
  async listar(): Promise<UsuarioFuncionario[]> {
    return usuarios;
  },

  async obterPorId(id: string): Promise<UsuarioFuncionario | null> {
    return usuarios.find((u) => u.id === id) || null;
  },

  async cadastrar(dados: Omit<UsuarioFuncionario, 'id' | 'ativo'>): Promise<UsuarioFuncionario> {
    const novo: UsuarioFuncionario = {
      ...dados,
      id: `usr-${Date.now()}`,
      ativo: true,
      assinaturaDigitalUrl: '/assinaturas/resp-tecnico.png',
    };
    usuarios.push(novo);
    return novo;
  },

  async atualizar(id: string, dados: Partial<UsuarioFuncionario>): Promise<UsuarioFuncionario | null> {
    const idx = usuarios.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    usuarios[idx] = { ...usuarios[idx], ...dados };
    return usuarios[idx];
  },
};
