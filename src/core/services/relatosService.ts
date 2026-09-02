import { RelatoCalibracao, TipoCalibracao, CertificadoCalibracao, UsuarioFuncionario } from '../types';
import { MOCK_RELATOS, MOCK_TIPOS_CALIBRACAO, MOCK_CERTIFICADOS, MOCK_FUNCIONARIOS } from '../mock-db/data';

let relatos: RelatoCalibracao[] = [...MOCK_RELATOS];
let tiposCalibracao: TipoCalibracao[] = [...MOCK_TIPOS_CALIBRACAO];
let certificados: CertificadoCalibracao[] = [...MOCK_CERTIFICADOS];

export const RelatosService = {
  async listarTiposCalibracao(): Promise<TipoCalibracao[]> {
    return tiposCalibracao;
  },

  async listarRelatos(tipoEquipamento?: string): Promise<RelatoCalibracao[]> {
    if (!tipoEquipamento) return relatos;
    return relatos.filter((r) => r.tipoEquipamento === tipoEquipamento);
  },

  async obterRelatoPorId(id: string): Promise<RelatoCalibracao | null> {
    return relatos.find((r) => r.id === id) || null;
  },

  async salvarRelato(relato: RelatoCalibracao): Promise<RelatoCalibracao> {
    const idx = relatos.findIndex((r) => r.id === relato.id);
    if (idx !== -1) {
      relatos[idx] = relato;
      return relatos[idx];
    } else {
      const novo = { ...relato, id: `rel-${Date.now()}` };
      relatos.push(novo);
      return novo;
    }
  },

  verificarPermissaoTecnico(tecnicoId: string, tipoCalibracaoId: string, tipoEquipamento: string): {
    permitido: boolean;
    motivo?: string;
  } {
    const tecnico = MOCK_FUNCIONARIOS.find((f) => f.id === tecnicoId);
    if (!tecnico) return { permitido: false, motivo: 'Técnico não localizado no quadro de funcionários.' };

    if (tecnico.perfil === 'Administrador' || tecnico.perfil === 'ResponsavelTecnico') {
      return { permitido: true };
    }

    const temPermissao = tecnico.permissoesCalibracao.some(
      (p) => p.tipoCalibracaoId === tipoCalibracaoId && p.tipoEquipamento === tipoEquipamento
    );

    if (!temPermissao) {
      return {
        permitido: false,
        motivo: `O técnico ${tecnico.nome} não possui permissão homologada para executar esta calibração no equipamento ${tipoEquipamento}.`,
      };
    }

    return { permitido: true };
  },

  renderizarHtmlCertificado(
    templateHtml: string,
    variaveis: Record<string, unknown>
  ): string {
    let renderizado = templateHtml;

    const flattenObject = (obj: Record<string, unknown>, prefix = ''): Record<string, string> => {
      let result: Record<string, string> = {};
      for (const key in obj) {
        const val = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
          Object.assign(result, flattenObject(val as Record<string, unknown>, newKey));
        } else {
          result[newKey] = String(val ?? '');
        }
      }
      return result;
    };

    const flatVars = flattenObject(variaveis);

    for (const [chave, valor] of Object.entries(flatVars)) {
      const regex = new RegExp(`{{\\s*${chave}\\s*}}`, 'g');
      renderizado = renderizado.replace(regex, valor);
    }

    return renderizado;
  },

  async emitirCertificado(dados: {
    osNumero: string;
    osId: string;
    equipamentoId: string;
    equipamentoSerie: string;
    equipamentoModelo: string;
    equipamentoPatrimonio?: string;
    equipamentoLacreNovo?: string;
    equipamentoSeloNovo?: string;
    clienteId: string;
    clienteRazaoSocial: string;
    clienteCnpj: string;
    relatoId: string;
    tecnicoId: string;
    tecnicoNome: string;
    padroesUtilizados: { identificador: string; descricao: string; certificado: string; validade: string }[];
    dadosColetados: Record<string, unknown>;
  }): Promise<CertificadoCalibracao> {
    const relato = relatos.find((r) => r.id === dados.relatoId) || relatos[0];
    const anoAtual = new Date().getFullYear().toString().slice(-2);
    
    // Contagem de certificados para a mesma OS
    const certsMesmaOs = certificados.filter((c) => c.osNumero === dados.osNumero).length;
    const numeroSeqItem = certsMesmaOs + 1;
    const numeroCertificado = `${dados.osNumero}-${numeroSeqItem}/${anoAtual}`;

    const hash = `RARUS-AUTH-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    const variaveisTemplate = {
      certificado: {
        numero: numeroCertificado,
        dataEmissao: new Date().toLocaleDateString('pt-BR'),
        hash,
      },
      cliente: {
        razaoSocial: dados.clienteRazaoSocial,
        cnpj: dados.clienteCnpj,
      },
      equipamento: {
        modelo: dados.equipamentoModelo,
        numeroSerie: dados.equipamentoSerie,
        patrimonio: dados.equipamentoPatrimonio || 'S/N',
        lacreNovo: dados.equipamentoLacreNovo || 'N/A',
        seloNovo: dados.equipamentoSeloNovo || 'N/A',
      },
      padrao: dados.padroesUtilizados[0] || {
        identificador: 'PAD-PADRAO',
        descricao: 'Padrão Homologado',
        certificado: 'RBC-0000',
      },
      ensaio: dados.dadosColetados,
      tecnico: {
        nome: dados.tecnicoNome,
      },
    };

    const htmlRenderizado = this.renderizarHtmlCertificado(
      relato.templateHtmlCertificado,
      variaveisTemplate
    );

    const novoCert: CertificadoCalibracao = {
      id: `cert-${Date.now()}`,
      numero: numeroCertificado,
      osId: dados.osId,
      osNumero: dados.osNumero,
      equipamentoId: dados.equipamentoId,
      equipamentoSerie: dados.equipamentoSerie,
      equipamentoModelo: dados.equipamentoModelo,
      clienteId: dados.clienteId,
      clienteNome: dados.clienteRazaoSocial,
      relatoId: relato.id,
      tipoCalibracaoNome: relato.tipoCalibracaoNome,
      tecnicoId: dados.tecnicoId,
      tecnicoNome: dados.tecnicoNome,
      dataEmissao: new Date().toLocaleDateString('pt-BR'),
      dataValidade: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
      padroesUtilizados: dados.padroesUtilizados,
      dadosColetados: dados.dadosColetados,
      calculosResultados: { resultado: 'CONFORME' },
      htmlCertificadoGerado: htmlRenderizado,
      hashAutenticidade: hash,
      status: 'Válido',
    };

    certificados.unshift(novoCert);
    return novoCert;
  },

  async listarCertificados(): Promise<CertificadoCalibracao[]> {
    return certificados;
  },
};
