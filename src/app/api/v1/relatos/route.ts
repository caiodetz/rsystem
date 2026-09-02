import { NextRequest, NextResponse } from 'next/server';
import { RelatosService } from '@/core/services/relatosService';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tipoEquipamento = searchParams.get('tipoEquipamento') || undefined;

  const relatos = await RelatosService.listarRelatos(tipoEquipamento);
  const tiposCalibracao = await RelatosService.listarTiposCalibracao();
  const certificados = await RelatosService.listarCertificados();

  return NextResponse.json({
    sucesso: true,
    dados: {
      relatos,
      tiposCalibracao,
      certificados,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.acao === 'emitirCertificado') {
      const cert = await RelatosService.emitirCertificado(body.dados);
      return NextResponse.json({ sucesso: true, dados: cert }, { status: 201 });
    }

    if (body.acao === 'salvarRelato') {
      const rel = await RelatosService.salvarRelato(body.relato);
      return NextResponse.json({ sucesso: true, dados: rel });
    }

    return NextResponse.json(
      { sucesso: false, mensagem: 'Ação inválida. Utilize emitirCertificado | salvarRelato' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json({ sucesso: false, mensagem: error.message }, { status: 500 });
  }
}
