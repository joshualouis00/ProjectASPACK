import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { type MRT_ColumnDef, MaterialReactTable } from "material-react-table";
import DateTimeFormatted from "../formatDateTime";
import Viewer from "../Viewer"; // Import Viewer component

interface FileData {
  fileName: string;
  createDate: string;
  status: string;
  fileURL: string;
}

interface AppTableProps {
  files: FileData[];
  setFiles: React.Dispatch<React.SetStateAction<FileData[]>>; 
}

export const AppTable: React.FC<AppTableProps> = ({ files, setFiles }) => {
  const [open, setOpen] = useState(false);
  const [selectedFileURL, setSelectedFileURL] = useState<string | null>(null);

  // Function to handle Preview button click
  const handlePreviewClick = (fileURL: string) => {
    setSelectedFileURL(fileURL);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFileURL(null);
  };

  const columns: MRT_ColumnDef<FileData>[] = [
    {
      accessorKey: "fileName",
      header: "File Name",
      Cell: ({ cell }) => (
        <a
          href={cell.row.original.fileURL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {cell.getValue<string>()}
        </a>
      ),
    },
    {
      accessorKey: "createDate",
      header: "Create Date",
      Cell: () => <DateTimeFormatted />,
    },
    {
      accessorKey: "status",
      header: "Status",
      Cell: ({ cell }) => <span>{cell.getValue<string>()}</span>,
    },
    {
      header: "Action",
      Cell: ({ row }) => (
        <Button
          variant="contained"
          onClick={() => handlePreviewClick(row.original.fileURL)}
        >
          Preview
        </Button>
      ),
    },
  ];

  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={files}
        enableRowSelection
        renderTopToolbarCustomActions={({ table }) => {
          const handleContact = () => {
            const updatedFiles = files.map((file) => {
              const isSelected = table
                .getSelectedRowModel()
                .flatRows.some(
                  (flatRow) => flatRow.original.fileName === file.fileName
                );

              if (isSelected) {
                return {
                  ...file,
                  status: file.status === "Active" ? "InActive" : "Active",
                };
              }

              return file;
            });

            setFiles(updatedFiles);
          };

          return (
            <div style={{ display: "flex", gap: "0.5rem" }}>
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

      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>Preview File</DialogTitle>
        <DialogContent>
          {selectedFileURL && <Viewer fileURL={selectedFileURL} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AppTable;
