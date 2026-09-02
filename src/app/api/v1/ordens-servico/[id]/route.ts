import { NextRequest, NextResponse } from 'next/server';
import { OrdensServicoService } from '@/core/services/ordensServicoService';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await OrdensServicoService.obterPorId(id);

    if (!item) {
      return NextResponse.json({ sucesso: false, mensagem: 'Ordem de serviço não encontrada' }, { status: 404 });
    }

    return NextResponse.json({ sucesso: true, dados: item });
  } catch (error) {
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro ao buscar ordem de serviço', erro: String(error) },
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
    const atualizado = await OrdensServicoService.atualizar(id, body);

    if (!atualizado) {
      return NextResponse.json({ sucesso: false, mensagem: 'Ordem de serviço não encontrada' }, { status: 404 });
    }

    return NextResponse.json({ sucesso: true, dados: atualizado });
  } catch (error) {
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro ao atualizar ordem de serviço', erro: String(error) },
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
    const ok = await OrdensServicoService.excluir(id);

    if (!ok) {
      return NextResponse.json({ sucesso: false, mensagem: 'Ordem de serviço não encontrada' }, { status: 404 });
    }

    return NextResponse.json({ sucesso: true, mensagem: 'Ordem de serviço removida' });
  } catch (error) {
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro ao remover ordem de serviço', erro: String(error) },
      { status: 500 }
    );
  }
}
