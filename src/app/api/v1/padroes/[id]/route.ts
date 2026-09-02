import { NextRequest, NextResponse } from 'next/server';
import { PadroesService } from '@/core/services/padroesService';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await PadroesService.obterPorId(id);

    if (!item) {
      return NextResponse.json({ sucesso: false, mensagem: 'Padrão não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ sucesso: true, dados: item });
  } catch (error) {
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro ao buscar padrão', erro: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const atualizado = await PadroesService.atualizar(id, body);

    if (!atualizado) {
      return NextResponse.json({ sucesso: false, mensagem: 'Padrão não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ sucesso: true, dados: atualizado });
  } catch (error) {
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro ao atualizar padrão', erro: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ok = await PadroesService.excluir(id);

    if (!ok) {
      return NextResponse.json({ sucesso: false, mensagem: 'Padrão não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ sucesso: true, mensagem: 'Padrão removido com sucesso' });
  } catch (error) {
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro ao remover padrão', erro: String(error) },
      { status: 500 }
    );
  }
}
