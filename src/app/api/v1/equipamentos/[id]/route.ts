import { NextRequest, NextResponse } from 'next/server';
import { EquipamentosService } from '@/core/services/equipamentosService';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await EquipamentosService.obterPorId(id);

    if (!item) {
      return NextResponse.json({ sucesso: false, mensagem: 'Equipamento não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ sucesso: true, dados: item });
  } catch (error) {
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro ao buscar equipamento', erro: String(error) },
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
    const atualizado = await EquipamentosService.atualizar(id, body);

    if (!atualizado) {
      return NextResponse.json({ sucesso: false, mensagem: 'Equipamento não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ sucesso: true, dados: atualizado });
  } catch (error) {
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro ao atualizar equipamento', erro: String(error) },
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
    const sucesso = await EquipamentosService.excluir(id);

    if (!sucesso) {
      return NextResponse.json({ sucesso: false, mensagem: 'Equipamento não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ sucesso: true, mensagem: 'Equipamento excluído com sucesso' });
  } catch (error) {
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro ao excluir equipamento', erro: String(error) },
      { status: 500 }
    );
  }
}
