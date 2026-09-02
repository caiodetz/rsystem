import { NextRequest, NextResponse } from 'next/server';
import { CalibracoesService } from '@/core/services/calibracoesService';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await CalibracoesService.obterCertificado(id);

    if (!item) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Certificado de calibração não localizado' },
        { status: 404 }
      );
    }

    const certificadoOficial = {
      laboratorioEmissor: {
        nome: 'RSYSTEM Laboratórios Metrológicos Acreditados RBC',
        acreditacaoInmetro: 'CAL Nº 0412 - ISO/IEC 17025',
        cnpj: '00.123.456/0001-99',
        endereco: 'Av. Metrologia Industrial, 1000 - Tech Park',
        responsavelTecnico: item.tecnicoResponsavel,
      },
      certificado: {
        numero: item.numeroCertificado,
        dataEmissao: item.dataCalibracao,
        validadeSugerida: item.dataProximaCalibracao,
        status: item.resultado,
        codigoAutenticidade: item.qrCodeHash,
      },
      cliente: {
        id: item.clienteId,
        nome: item.clienteNome,
      },
      instrumento: {
        tag: item.equipamentoTag,
        descricao: item.equipamentoDescricao,
      },
      padraoRastreavel: {
        descricao: item.padraoUtilizadoDesc,
        certificadoRBC: item.padraoCertificadoRBC,
      },
      condicoesAmbientais: {
        temperatura: `${item.temperaturaAmbiente} °C`,
        umidade: `${item.umidadeRelativa} %`,
      },
      tabelaEnsaios: item.pontosMedicao,
      declaracaoConformidade: item.declaracaoConformidade,
      observacoes: item.observacoes,
    };

    return NextResponse.json({
      sucesso: true,
      dados: certificadoOficial,
    });
  } catch (error) {
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro ao emitir certificado de calibração', erro: String(error) },
      { status: 500 }
    );
  }
}
