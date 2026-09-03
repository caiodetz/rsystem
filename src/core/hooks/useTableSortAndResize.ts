'use client';

import { useState, useCallback, useRef } from 'react';

export type SortDirection = 'desc' | 'asc' | null;

export interface UseTableSortAndResizeOptions<T> {
  initialSortKey?: keyof T | string | null;
  initialSortDirection?: SortDirection;
  defaultWidths?: Record<string, number>;
  minColumnWidth?: number;
}

export function useTableSortAndResize<T>(options: UseTableSortAndResizeOptions<T> = {}) {
  const {
    initialSortKey = null,
    initialSortDirection = null,
    defaultWidths = {},
    minColumnWidth = 60,
  } = options;

  // ESTADO DE ORDENAÇÃO
  const [sortKey, setSortKey] = useState<string | null>(initialSortKey as string | null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialSortDirection);

  // Alterna ordenação: Primeiro clique = 'desc' (conforme solicitado), Segundo = 'asc', Terceiro = null
  const handleSort = useCallback((key: string) => {
    setSortKey((prevKey) => {
      if (prevKey !== key) {
        setSortDirection('desc');
        return key;
      }
      setSortDirection((prevDir) => {
        if (prevDir === 'desc') return 'asc';
        if (prevDir === 'asc') return null;
        return 'desc';
      });
      return key;
    });
  }, []);

  // Função para ordenar arrays de dados com base na coluna ativa
  const sortData = useCallback(
    (data: T[], customAccessors?: Record<string, (item: T) => any>): T[] => {
      if (!sortKey || !sortDirection) return data;

      return [...data].sort((a: any, b: any) => {
        let valA: any;
        let valB: any;

        if (customAccessors && customAccessors[sortKey]) {
          valA = customAccessors[sortKey](a);
          valB = customAccessors[sortKey](b);
        } else {
          valA = a[sortKey];
          valB = b[sortKey];
        }

        if (valA === undefined || valA === null) valA = '';
        if (valB === undefined || valB === null) valB = '';

        // Comparação Numérica
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDirection === 'desc' ? valB - valA : valA - valB;
        }

        // Comparação de Datas (formato DD/MM/YYYY ou ISO)
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (typeof valA === 'string' && typeof valB === 'string') {
          if (dateRegex.test(valA) && dateRegex.test(valB)) {
            const [dA, mA, yA] = valA.split('/').map(Number);
            const [dB, mB, yB] = valB.split('/').map(Number);
            const timeA = new Date(yA, mA - 1, dA).getTime();
            const timeB = new Date(yB, mB - 1, dB).getTime();
            return sortDirection === 'desc' ? timeB - timeA : timeA - timeB;
          }

          // Comparação Alfanumérica padrão (case-insensitive)
          const comp = valA.localeCompare(valB, 'pt-BR', { numeric: true, sensitivity: 'base' });
          return sortDirection === 'desc' ? -comp : comp;
        }

        if (valA < valB) return sortDirection === 'desc' ? 1 : -1;
        if (valA > valB) return sortDirection === 'desc' ? -1 : 1;
        return 0;
      });
    },
    [sortKey, sortDirection]
  );

  // ESTADO DE REDIMENSIONAMENTO DE COLUNAS
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(defaultWidths);
  const resizingRef = useRef<{
    colId: string;
    startX: number;
    startWidth: number;
  } | null>(null);

  const handleResizeStart = useCallback(
    (colId: string, currentWidth: number, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startWidth = columnWidths[colId] || currentWidth;

      resizingRef.current = { colId, startX, startWidth };
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!resizingRef.current) return;
        const deltaX = moveEvent.clientX - resizingRef.current.startX;
        const newWidth = Math.max(minColumnWidth, resizingRef.current.startWidth + deltaX);

        setColumnWidths((prev) => ({
          ...prev,
          [resizingRef.current!.colId]: newWidth,
        }));
      };

      const handleMouseUp = () => {
        resizingRef.current = null;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [columnWidths, minColumnWidth]
  );

  return {
    sortKey,
    sortDirection,
    handleSort,
    sortData,
    columnWidths,
    handleResizeStart,
  };
}
