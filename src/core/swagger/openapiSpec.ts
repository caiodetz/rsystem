/**
 * Especificação OpenAPI 3.0 para a API da RARUS Tecnologia & Serviços
 * Sistema Modular de Metrologia, Manutenção e Calibração de Equipamentos
 */

export const openapiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'RARUS Tecnologia & Serviços - Metrologia & Manutenção API',
    version: '1.0.0',
    description:
      'API RESTful modular para gestão de clientes, equipamentos industriais (GEHAKA e balanças), ordens de serviço em 14 etapas, estoque multi-local físico/fiscal, padrões basais RBC e motor de calibrações por relato.',
    contact: {
      name: 'Engenharia e Metrologia RARUS',
      email: 'contato@rarus.com.br',
    },
  },
  servers: [
    {
      url: '/api/v1',
      description: 'Servidor Local da API v1',
    },
  ],
  paths: {
    '/equipamentos': {
      get: {
        summary: 'Listar equipamentos e instrumentos',
        description: 'Retorna a lista de equipamentos cadastrados com suporte a filtros de status, tipo e busca.',
        tags: ['Equipamentos'],
        parameters: [
          {
            name: 'status',
            in: 'query',
            description: 'Filtrar por status do equipamento',
            schema: { type: 'string', enum: ['Calibrado', 'Vencido', 'Em Calibração', 'Em Manutenção', 'Crítico'] },
          },
          {
            name: 'tipoEquipamento',
            in: 'query',
            description: 'Filtrar por tipo de equipamento (ex: Medidor de Umidade GEHAKA)',
            schema: { type: 'string' },
          },
          {
            name: 'busca',
            in: 'query',
            description: 'Termo para busca em modelo, série, patrimônio e cliente',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Lista de equipamentos retornada com sucesso',
          },
        },
      },
      post: {
        summary: 'Cadastrar novo equipamento',
        tags: ['Equipamentos'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object' },
            },
          },
        },
        responses: {
          201: { description: 'Equipamento criado com sucesso' },
        },
      },
    },
    '/ordens-servico': {
      get: {
        summary: 'Listar Ordens de Serviço',
        description: 'Retorna ordens de serviço com 14 status oficiais e múltiplos equipamentos.',
        tags: ['Ordens de Serviço'],
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'busca', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Lista de OS retornada' } },
      },
      post: {
        summary: 'Criar nova OS com múltiplos equipamentos',
        tags: ['Ordens de Serviço'],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object' } } },
        },
        responses: { 201: { description: 'OS criada com sucesso' } },
      },
    },
    '/estoque': {
      get: {
        summary: 'Consultar Estoque Multi-Local (Central & Técnicos)',
        description: 'Retorna saldos físicos por local, saldo fiscal e peças de serviço.',
        tags: ['Estoque & Suprimentos'],
        parameters: [
          { name: 'localId', in: 'query', description: 'ID do estoque (ex: est-central, est-tec-itamar)', schema: { type: 'string' } },
          { name: 'busca', in: 'query', description: 'Código ou descrição da peça', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Posição de estoque retornada com sucesso' } },
      },
      post: {
        summary: 'Transferir peças ou solicitar requisição',
        tags: ['Estoque & Suprimentos'],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object' } } },
        },
        responses: { 200: { description: 'Operação de estoque realizada' } },
      },
    },
    '/relatos': {
      get: {
        summary: 'Listar Relatos de Calibração & Templates HTML',
        description: 'Retorna os modelos de calibração configurados por tipo de equipamento.',
        tags: ['Calibrações & Relatos'],
        parameters: [
          { name: 'tipoEquipamento', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Relatos retornados com sucesso' } },
      },
      post: {
        summary: 'Emitir certificado ou salvar template HTML',
        tags: ['Calibrações & Relatos'],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object' } } },
        },
        responses: { 201: { description: 'Certificado emitido ou relato salvo' } },
      },
    },
    '/clientes': {
      get: {
        summary: 'Listar clientes industriais',
        tags: ['Clientes'],
        responses: { 200: { description: 'Lista de clientes' } },
      },
      post: {
        summary: 'Cadastrar cliente',
        tags: ['Clientes'],
        responses: { 201: { description: 'Cliente cadastrado' } },
      },
    },
    '/padroes': {
      get: {
        summary: 'Listar padrões basais de referência (RBC)',
        tags: ['Padrões Basais'],
        responses: { 200: { description: 'Padrões com escala de alertas retornados' } },
      },
    },
    '/busca-global': {
      get: {
        summary: 'Busca Global ⌘K e Comandos Diretos',
        tags: ['Busca Global'],
        parameters: [
          { name: 'q', in: 'query', required: true, schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Resultados encontrados em todos os módulos' } },
      },
    },
  },
};
