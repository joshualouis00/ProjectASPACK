import Button from '@mui/material/Button';
import {
  type MRT_ColumnDef,
  MaterialReactTable,
} from 'material-react-table';
import { faker } from '@faker-js/faker';

const data = [...Array(5)].map(() => ({
  createDate: faker.date.recent().toDateString(),
  firstName: faker.person.firstName(),
  status: "Active" || "Inactive"
}));

const columns: MRT_ColumnDef<(typeof data)[0]>[] = [
    {
      accessorKey: 'firstName',
      header: 'File Name',
    },
    {
      accessorKey: 'createDate',
      header: 'Create Date',
    },
    {
      accessorKey: 'status',
      header: 'Status',
    },
]

export const AppTable = () => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enableRowSelection
    renderTopToolbarCustomActions={({ table }) => {

      const handleContact = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('contact ' + row.original.firstName);
        });
      };

      return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            color="info"
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleContact}
            variant="contained"
          >
            Submit
          </Button>
        </div>
      );
    }}
  />
);

export default AppTable;


