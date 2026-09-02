import { NextRequest, NextResponse } from 'next/server';
import { CalibracoesService } from '@/core/services/calibracoesService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const busca = searchParams.get('busca') || undefined;
    const itens = await CalibracoesService.listar(busca);

    return NextResponse.json({
      sucesso: true,
      dados: itens,
      meta: { total: itens.length },
    });
  } catch (error) {
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro ao listar calibrações', erro: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.equipamentoId || !body.osId || !body.padraoUtilizadoId) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Campos obrigatórios: equipamentoId, osId, padraoUtilizadoId' },
        { status: 400 }
      );
    }

    const novo = await CalibracoesService.criar(body);
    return NextResponse.json({ sucesso: true, dados: novo }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro ao registrar calibração', erro: String(error) },
      { status: 500 }
    );
  }
}
