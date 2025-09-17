import React, { useState, useMemo } from 'react';
import type { DataTableProps, Column } from './DataTable.types';

export function DataTable<T extends { [key: string]: any }>({
  data,
  columns,
  loading = false,
  selectable = false,
  onRowSelect,
}: DataTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const toggleRow = (row: T) => {
    let newSelectedRows: T[];
    if (selectedRows.includes(row)) {
      newSelectedRows = selectedRows.filter((r) => r !== row);
    } else {
      newSelectedRows = [...selectedRows, row];
    }
    setSelectedRows(newSelectedRows);
    onRowSelect?.(newSelectedRows);
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === sortedData.length) {
      setSelectedRows([]);
      onRowSelect?.([]);
    } else {
      setSelectedRows(sortedData);
      onRowSelect?.(sortedData);
    }
  };

  const onSort = (column: Column<T>) => {
    if (!column.sortable) return;

    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === column.dataIndex && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: column.dataIndex, direction });
  };

  const allSelected = selectedRows.length === sortedData.length && sortedData.length > 0;

  return (
    <div className="overflow-x-auto">
      {loading ? (
        <div className="text-center p-4">Loading...</div>
      ) : sortedData.length === 0 ? (
        <div className="text-center p-4">No data available.</div>
      ) : (
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              {selectable && (
                <th className="border border-gray-300 p-2">
                  <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => onSort(col)}
                  className={`border border-gray-300 p-2 cursor-pointer ${col.sortable ? 'hover:bg-gray-100' : ''}`}
                >
                  <div className="flex items-center space-x-1">
                    <span>{col.title}</span>
                    {col.sortable && sortConfig?.key === col.dataIndex && (
                      <span>{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, idx) => (
              <tr
                key={idx}
                className={`${selectedRows.includes(row) ? 'bg-blue-100' : ''} hover:bg-gray-50 cursor-pointer`}
                onClick={() => {
                  if (selectable) toggleRow(row);
                }}
              >
                {selectable && (
                  <td className="border border-gray-300 p-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row)}
                      onChange={() => toggleRow(row)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} className="border border-gray-300 p-2">
                    {String(row[col.dataIndex])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
