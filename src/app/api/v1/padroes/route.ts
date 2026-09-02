import { NextRequest, NextResponse } from 'next/server';
import { PadroesService } from '@/core/services/padroesService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const busca = searchParams.get('busca') || undefined;
    const grandeza = searchParams.get('grandeza') || undefined;

    const itens = await PadroesService.listar(busca, grandeza);

    return NextResponse.json({
      sucesso: true,
      dados: itens,
      meta: { total: itens.length },
    });
  } catch (error) {
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro ao listar padrões metrológicos', erro: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.codigo || !body.descricao || !body.grandeza || !body.certificadoRBC) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Campos obrigatórios: codigo, descricao, grandeza, certificadoRBC' },
        { status: 400 }
      );
    }

    const novo = await PadroesService.criar(body);
    return NextResponse.json({ sucesso: true, dados: novo }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro ao cadastrar padrão', erro: String(error) },
      { status: 500 }
    );
  }
}
