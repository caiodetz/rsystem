import { NextRequest, NextResponse } from 'next/server';
import { EquipamentosService } from '@/core/services/equipamentosService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const tipoEquipamento = searchParams.get('tipoEquipamento') || searchParams.get('tipo') || undefined;
    const clienteId = searchParams.get('clienteId') || undefined;
    const busca = searchParams.get('busca') || undefined;

    const itens = await EquipamentosService.listar({ status, tipoEquipamento, clienteId, busca });

    return NextResponse.json({
      sucesso: true,
      dados: itens,
      meta: { total: itens.length },
    });
  } catch (error) {
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro ao listar equipamentos', erro: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.modelo || !body.numeroSerie) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Campos obrigatórios: modelo, numeroSerie' },
        { status: 400 }
      );
    }

    const novo = await EquipamentosService.criar({
      clienteId: body.clienteId || 'cli-1',
      clienteNome: body.clienteNome || 'Cliente Não Identificado',
      numeroSerie: body.numeroSerie,
      fabricante: body.fabricante || 'GEHAKA',
      modelo: body.modelo,
      tipoEquipamento: body.tipoEquipamento || 'Medidor de Umidade GEHAKA',
      faixaMedicao: body.faixaMedicao || '8 a 50 %',
      resolucao: body.resolucao || '0,1 %',
      patrimonio: body.patrimonio,
      lacreNovo: body.lacreNovo,
      seloNovo: body.seloNovo,
      dataUltimaCalibracao: body.dataUltimaCalibracao || new Date().toISOString().split('T')[0],
      dataProximaCalibracao: body.dataProximaCalibracao || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: body.status || 'Calibrado',
    });

    return NextResponse.json({ sucesso: true, dados: novo }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro ao cadastrar equipamento', erro: String(error) },
      { status: 500 }
    );
  }
}
