// frontend/src/components/common/Table.tsx
import React from 'react';

interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode; // Optional custom render function for cells
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onRowClick?: (item: T) => void;
}

function Table<T>({ data, columns, onRowClick }: TableProps<T>) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={String(column.key)} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, rowIndex) => (
          <tr key={rowIndex} onClick={() => onRowClick && onRowClick(item)} style={{ cursor: onRowClick ? 'pointer' : 'default' }}>
            {columns.map((column, colIndex) => (
              <td key={String(column.key) + colIndex} style={{ border: '1px solid #ddd', padding: '8px' }}>
                {column.render ? column.render(item) : String(item[column.key as keyof T])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
