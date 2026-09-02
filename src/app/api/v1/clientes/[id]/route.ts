import { NextRequest, NextResponse } from 'next/server';
import { ClientesService } from '@/core/services/clientesService';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await ClientesService.obterPorId(id);

    if (!item) {
      return NextResponse.json({ sucesso: false, mensagem: 'Cliente não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ sucesso: true, dados: item });
  } catch (error) {
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro ao buscar cliente', erro: String(error) },
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
    const atualizado = await ClientesService.atualizar(id, body);

    if (!atualizado) {
      return NextResponse.json({ sucesso: false, mensagem: 'Cliente não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ sucesso: true, dados: atualizado });
  } catch (error) {
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro ao atualizar cliente', erro: String(error) },
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
    const ok = await ClientesService.excluir(id);

    if (!ok) {
      return NextResponse.json({ sucesso: false, mensagem: 'Cliente não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ sucesso: true, mensagem: 'Cliente removido com sucesso' });
  } catch (error) {
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro ao remover cliente', erro: String(error) },
      { status: 500 }
    );
  }
}
