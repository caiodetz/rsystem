import { NextRequest, NextResponse } from 'next/server';
import { EstoqueService } from '@/core/services/estoqueService';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const localId = searchParams.get('localId') || undefined;
  const busca = searchParams.get('busca') || undefined;
  const tipoItem = (searchParams.get('tipoItem') as any) || undefined;

  const itens = await EstoqueService.listarItens({ localId, busca, tipoItem });
  const locais = await EstoqueService.listarLocais();
  const movimentacoes = await EstoqueService.listarMovimentacoes();

  return NextResponse.json({
    sucesso: true,
    dados: {
      locais,
      itens,
      movimentacoes,
    },
    meta: {
      totalItens: itens.length,
      totalLocais: locais.length,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.tipoAcao === 'transferencia') {
      const res = await EstoqueService.transferirPecas({
        origemLocalId: body.origemLocalId,
        destinoLocalId: body.destinoLocalId,
        itemCodigo: body.itemCodigo,
        quantidade: Number(body.quantidade),
        numeroSerie: body.numeroSerie,
        responsavelNome: body.responsavelNome || 'Operador',
        motivo: body.motivo || 'Transferência via API',
      });
      return NextResponse.json({ sucesso: res.sucesso, mensagem: res.mensagem });
    }

    if (body.tipoAcao === 'requisicao') {
      const req = await EstoqueService.solicitarRequisicao({
        origemLocalId: body.origemLocalId,
        destinoLocalId: body.destinoLocalId,
        itemCodigo: body.itemCodigo,
        quantidade: Number(body.quantidade),
        responsavelNome: body.responsavelNome || 'Técnico em Campo',
        motivo: body.motivo || 'Requisição via API',
      });
      return NextResponse.json({ sucesso: true, dados: req });
    }

    return NextResponse.json(
      { sucesso: false, mensagem: 'Ação inválida. Utilize tipoAcao: transferencia | requisicao' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json({ sucesso: false, mensagem: error.message }, { status: 500 });
  }
}
