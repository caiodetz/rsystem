'use client';

import React, { useState } from 'react';
import { MOCK_FUNCIONARIOS } from '@/core/mock-db/data';
import { UsuarioFuncionario } from '@/core/types';
import {
  UserCheck,
  Shield,
  Award,
  CheckCircle2,
  FileSignature,
  Mail,
  Phone,
  Plus,
  Search,
} from 'lucide-react';

export function UsuariosView() {
  const [usuarios, setUsuarios] = useState<UsuarioFuncionario[]>(MOCK_FUNCIONARIOS);
  const [busca, setBusca] = useState('');

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nome.toLowerCase().includes(busca.toLowerCase()) ||
      u.cargo.toLowerCase().includes(busca.toLowerCase()) ||
      u.email.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="rarus-content-scroll">
      {/* Header */}
      <div className="rarus-page-header">
        <div className="rarus-page-title-group">
          <h1>Funcionários, RH & Matriz de Competência Técnica</h1>
          <p>
            Controle de equipe, permissões de calibração atribuídas pelo Responsável Técnico e assinaturas digitais
          </p>
        </div>
      </div>

      {/* Grid de Funcionários com Matriz de Permissões */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {usuariosFiltrados.map((usr) => {
          const initials = usr.nome
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('');

          return (
            <div
              key={usr.id}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              {/* Header do Card */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    backgroundColor: 'var(--rarus-navy)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '15px',
                  }}
                >
                  {initials}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-main)' }}>
                    {usr.nome}
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--rarus-cyan)', fontWeight: 600 }}>
                    {usr.cargo}
                  </div>
                </div>
                <span
                  className="rarus-status-pill status-calibrado"
                  style={{ fontSize: '10.5px' }}
                >
                  <span className="rarus-status-dot" />
                  {usr.perfil}
                </span>
              </div>

              {/* Contatos */}
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  paddingBottom: 10,
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Mail size={13} /> {usr.email}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Phone size={13} /> {usr.telefone}
                </div>
              </div>

              {/* Matriz de Competência Técnica de Calibração */}
              <div>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--text-subtle)',
                    marginBottom: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Shield size={13} color="var(--rarus-navy)" />
                  Habilitações de Calibração Autorizadas:
                </div>
                {usr.permissoesCalibracao.length === 0 ? (
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    Sem permissões de assinatura técnica (Função administrativa/RH).
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {usr.permissoesCalibracao.map((p, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'var(--bg-app)',
                          padding: '6px 10px',
                          borderRadius: 6,
                          fontSize: '11.5px',
                        }}
                      >
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                          {p.tipoEquipamento}
                        </span>
                        <span style={{ color: 'var(--rarus-cyan)', fontWeight: 600 }}>
                          {p.tipoCalibracaoNome}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Assinatura Digital Cadastrada */}
              <div
                style={{
                  marginTop: 'auto',
                  paddingTop: 10,
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FileSignature size={14} color="var(--rarus-success)" />
                  Assinatura Digital PNG:
                </span>
                <span style={{ fontWeight: 600, color: 'var(--rarus-success)' }}>
                  {usr.assinaturaDigitalUrl ? '✓ Cadastrada' : 'Pendente'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
