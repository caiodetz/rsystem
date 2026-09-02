import { NextRequest, NextResponse } from 'next/server';
import { RelatoriosService } from '@/core/services/relatoriosService';
import { FiltroRelatorio } from '@/core/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = (searchParams.get('tipo') as any) || 'estoque';
    const estoqueLocalId = searchParams.get('estoqueLocalId') || undefined;
    const filtroSaldo = (searchParams.get('filtroSaldo') as any) || undefined;

    const relatorio = await RelatoriosService.gerarRelatorio({
      tipo,
      estoqueLocalId,
      filtroSaldo,
    });

    return NextResponse.json({
      sucesso: true,
      dados: relatorio,
    });
  } catch (error) {
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro ao gerar relatório', erro: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as FiltroRelatorio;

    if (!body.tipo) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Parâmetro obrigatório: tipo' },
        { status: 400 }
      );
    }

    const relatorio = await RelatoriosService.gerarRelatorio(body);

    return NextResponse.json({
      sucesso: true,
      dados: relatorio,
    });
  } catch (error) {
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro ao gerar relatório', erro: String(error) },
      { status: 500 }
    );
  }
}
