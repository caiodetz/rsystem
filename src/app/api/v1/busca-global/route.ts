import { NextRequest, NextResponse } from 'next/server';
import { BuscaGlobalService } from '@/core/services/buscaGlobalService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';

    const resultados = await BuscaGlobalService.buscar(q);

    return NextResponse.json({
      sucesso: true,
      termo: q,
      total: resultados.length,
      dados: resultados,
    });
  } catch (error) {
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro na busca global', erro: String(error) },
      { status: 500 }
    );
  }
}
