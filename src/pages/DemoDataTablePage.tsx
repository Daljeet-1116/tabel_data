import { useState } from 'react';
import { DataTable } from '../components/DataTable';
import type { Column } from '../components/DataTable/DataTable.types';

interface User {
  id: number;
  name: string;
  age: number;
  email: string;
}

const sampleData: User[] = [
  { id: 1, name: 'Alice', age: 28, email: 'alice@example.com' },
  { id: 2, name: 'Bob', age: 34, email: 'bob@example.com' },
  { id: 3, name: 'Carol', age: 29, email: 'carol@example.com' },
];

const columns: Column<User>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'age', title: 'Age', dataIndex: 'age', sortable: true },
  { key: 'email', title: 'Email', dataIndex: 'email' },
];

export const DemoDataTablePage: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<User[]>([]);
  const [loading] = useState(false); // removed setLoading since unused

  const handleRowSelect = (rows: User[]) => {
    setSelectedRows(rows);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">DataTable Demo</h1>
      <DataTable<User>
        data={sampleData}
        columns={columns}
        loading={loading}
        selectable
        onRowSelect={handleRowSelect}
      />
      <div>Selected Rows: {selectedRows.map((r) => r.name).join(', ')}</div>
    </div>
  );
};
