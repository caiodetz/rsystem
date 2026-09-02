import { NextRequest, NextResponse } from 'next/server';
import { ClientesService } from '@/core/services/clientesService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const busca = searchParams.get('busca') || undefined;

    const itens = await ClientesService.listar(busca);

    return NextResponse.json({
      sucesso: true,
      dados: itens,
      meta: { total: itens.length },
    });
  } catch (error) {
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro ao listar clientes', erro: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.razaoSocial || !body.cnpj || !body.email) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Campos obrigatórios: razaoSocial, cnpj, email' },
        { status: 400 }
      );
    }

    const novo = await ClientesService.criar(body);
    return NextResponse.json({ sucesso: true, dados: novo }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro ao cadastrar cliente', erro: String(error) },
      { status: 500 }
    );
  }
}
