import { NextRequest, NextResponse } from 'next/server';
import { OrdensServicoService } from '@/core/services/ordensServicoService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const prioridade = searchParams.get('prioridade') || undefined;
    const tipo = searchParams.get('tipo') || undefined;
    const busca = searchParams.get('busca') || undefined;
    const clienteId = searchParams.get('clienteId') || undefined;

    const itens = await OrdensServicoService.listar({ status, prioridade, tipo, busca, clienteId });

    return NextResponse.json({
      sucesso: true,
      dados: itens,
      meta: { total: itens.length },
    });
  } catch (error) {
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro ao listar ordens de serviço', erro: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.clienteNome || !body.tipo) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Campos obrigatórios: clienteNome, tipo' },
        { status: 400 }
      );
    }

    const novo = await OrdensServicoService.criar({
      clienteId: body.clienteId || 'cli-1',
      clienteNome: body.clienteNome,
      tipo: body.tipo,
      prioridade: body.prioridade || 'Normal',
      status: body.status || 'Aberta',
      equipamentos: body.equipamentos || [],
      pecas: body.pecas || [],
      tecnicoId: body.tecnicoId || 'usr-tec-itamar',
      tecnicoNome: body.tecnicoNome || 'Técnico Itamar Soares',
      dataAbertura: body.dataAbertura || new Date().toLocaleDateString('pt-BR'),
      dataPrevisao: body.dataPrevisao || new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
      descricaoProblema: body.descricaoProblema || 'Atendimento registrado via API',
    });

    return NextResponse.json({ sucesso: true, dados: novo }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro ao criar ordem de serviço', erro: String(error) },
      { status: 500 }
    );
  }
}
