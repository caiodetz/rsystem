import { NextRequest, NextResponse } from 'next/server';
import { CalibracoesService } from '@/core/services/calibracoesService';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await CalibracoesService.obterPorId(id);

    if (!item) {
      return NextResponse.json({ sucesso: false, mensagem: 'Calibração não encontrada' }, { status: 404 });
    }

    return NextResponse.json({ sucesso: true, dados: item });
  } catch (error) {
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro ao buscar calibração', erro: String(error) },
      { status: 500 }
    );
  }
}
