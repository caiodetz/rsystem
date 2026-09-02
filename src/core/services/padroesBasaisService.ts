import { PadraoBasal, StatusPadraoBasal } from '../types';
import { MOCK_PADROES_BASAIS } from '../mock-db/data';

let padroesBasais: PadraoBasal[] = [...MOCK_PADROES_BASAIS];

export const PadroesBasaisService = {
  calcularStatusPorValidade(dataValidadeIso: string): {
    status: StatusPadraoBasal;
    diasRestantes: number;
    mensagemAlerta?: string;
  } {
    const hoje = new Date();
    const dataVal = new Date(dataValidadeIso);
    const diffTime = dataVal.getTime() - hoje.getTime();
    const diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diasRestantes <= 0) {
      return {
        status: 'VencidoBloqueado',
        diasRestantes,
        mensagemAlerta: 'BLOQUEADO: Padrão com calibração vencida! Uso proibido para emissão de certificados.',
      };
    } else if (diasRestantes <= 30) {
      return {
        status: 'Alerta30dCritico',
        diasRestantes,
        mensagemAlerta: `CRÍTICO: Padrão basal vence em ${diasRestantes} dias! Providencie re-calibração urgente.`,
      };
    } else if (diasRestantes <= 60) {
      return {
        status: 'Alerta60d',
        diasRestantes,
        mensagemAlerta: `ATENÇÃO: Padrão basal vence em ${diasRestantes} dias.`,
      };
    } else if (diasRestantes <= 90) {
      return {
        status: 'Alerta90d',
        diasRestantes,
        mensagemAlerta: `AVISO: Calibração expira em ${diasRestantes} dias.`,
      };
    }

    return {
      status: 'Valido',
      diasRestantes,
    };
  },

  async listar(busca?: string): Promise<
    (PadraoBasal & {
      diasRestantes: number;
      mensagemAlerta?: string;
      bloqueado: boolean;
    })[]
  > {
    let list = [...padroesBasais];

    if (busca) {
      const q = busca.toLowerCase();
      list = list.filter(
        (p) =>
          p.codigoIdentificador.toLowerCase().includes(q) ||
          p.descricao.toLowerCase().includes(q) ||
          p.certificadoRBC.toLowerCase().includes(q)
      );
    }

    return list.map((p) => {
      const calc = this.calcularStatusPorValidade(p.dataValidade);
      return {
        ...p,
        status: calc.status,
        diasRestantes: calc.diasRestantes,
        mensagemAlerta: calc.mensagemAlerta,
        bloqueado: calc.status === 'VencidoBloqueado',
      };
    });
  },

  async obterPorIdentificador(codigo: string): Promise<PadraoBasal | null> {
    const p = padroesBasais.find((item) => item.codigoIdentificador.toUpperCase() === codigo.toUpperCase());
    return p || null;
  },

  async cadastrar(dados: Omit<PadraoBasal, 'id' | 'status' | 'historicoCalibracoes'>): Promise<PadraoBasal> {
    const calc = this.calcularStatusPorValidade(dados.dataValidade);
    const novo: PadraoBasal = {
      ...dados,
      id: `pad-${Date.now()}`,
      status: calc.status,
      historicoCalibracoes: [
        {
          data: dados.dataCalibracao,
          certificadoRBC: dados.certificadoRBC,
          orgaoCalibrador: dados.orgaoCalibrador,
          validade: dados.dataValidade,
        },
      ],
    };
    padroesBasais.unshift(novo);
    return novo;
  },
};
