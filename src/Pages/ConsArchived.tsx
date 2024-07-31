import { Box, Button } from "@mui/material";
import ButtonAddNews from "../Component/ButtonAddNews";
import { faker } from "@faker-js/faker";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";

export default function Archived() {
  const data = [...Array(10)].map(() => ({
    id: faker.string.uuid(),
    title: faker.lorem.word(),
    subtitle: faker.lorem.lines(),
    description: faker.lorem.paragraph(),
  }));

  const columns: MRT_ColumnDef<(typeof data)[0]>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "subtitle",
      header: "Subtitle",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
  ];

  return (
    <div>
      <Box>
        <ButtonAddNews />
        <br />
        <MaterialReactTable
          columns={columns}
          data={data}
          enableRowSelection
          renderBottomToolbarCustomActions={({ table }) => {
            const handleDeactivate = () => {
              table.getSelectedRowModel().flatRows.map((row) => {
                return alert("deactivating " + row.original.id);
              });
            };

            const handleActivate = () => {
              table.getSelectedRowModel().flatRows.map((row) => {
                return alert("activating " + row.original.id);
              });
            };

            const handleContact = () => {
              table.getSelectedRowModel().flatRows.map((row) => {
                return alert("contact " + row.original.id);
              });
            };

            return (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Button
                  color="error"
                  disabled={table.getSelectedRowModel().flatRows.length === 0}
                  onClick={handleDeactivate}
                  variant="contained"
                >
                  Deactivate
                </Button>
                <Button
                  color="success"
                  disabled={table.getSelectedRowModel().flatRows.length === 0}
                  onClick={handleActivate}
                  variant="contained"
                >
                  Activate
                </Button>
                <Button
                  color="info"
                  disabled={table.getSelectedRowModel().flatRows.length === 0}
                  onClick={handleContact}
                  variant="contained"
                >
                  Contact
                </Button>
              </div>
            );
          }}
        />
      </Box>
    </div>
  );
}
