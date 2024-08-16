import React from "react";
import { type MRT_ColumnDef, MaterialReactTable } from "material-react-table";

interface FileData {
  fileName: string;
  createDate: string;
  status: string;
}

interface AppTableProps {
  files: FileData[];
}

const AppTable: React.FC<AppTableProps> = ({ files }) => {
  const columns: MRT_ColumnDef<FileData>[] = [
    {
      accessorKey: "fileName",
      header: "File Name",
      Cell: ({ cell }) => <span>{cell.getValue<string>()}</span>, // Removed hyperlink
    },
    {
      accessorKey: "createDate",
      header: "Create Date",
      Cell: ({ cell }) => <span>{cell.getValue<string>()}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      Cell: ({ cell }) => <span>{cell.getValue<string>()}</span>,
    },
  ];

  return (
    <MaterialReactTable
      columns={columns}
      data={files}
    />
  );
};

export default AppTable;
