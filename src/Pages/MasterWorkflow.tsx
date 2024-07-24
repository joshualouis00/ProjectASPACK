import * as React from "react";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import { Category } from "@mui/icons-material";

interface Data {
  no: number;
  name: string;
  category: string;
}

function createData(no: number, name: string, category: string): Data {
  return { no, name, category };
}

export const initialData = () => [
  createData(1, "Example Step 1", "ASSO JV"),
  createData(2, "Example Step 2", "ASSO JV"),
  createData(3, "Example Step 3", "SUBS"),
  createData(4, "Example Step 4", "All"),
  createData(5, "Example Step 5", "SUBS"),
  createData(6, "Example Step 6", "ASSO JV"),
  createData(7, "Example Step 7", "ASSO JV"),
  createData(8, "Example Step 8", "SUBS"),
  createData(9, "Example Step 9", "All"),
  createData(10, "Example Step 10", "SUBS"),
  createData(11, "ASPACK 11", "SUBS"),
];

const DataWorkflow: React.FC = () => {
  const [rows, setRows] = React.useState<Data[]>(initialData());
  const [open, setOpen] = React.useState(false);
  const [stepDescription, setStepDescription] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [fileType, setFileType] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetDialogFields();
  };

  const resetDialogFields = () => {
    setStepDescription("");
    setCategory("");
    setFileType("");
  };

  const handleAddStep = () => {
    setRows([...rows, createData(rows.length + 1, stepDescription, category)]);
    handleClose();
  };

  const columns: MRT_ColumnDef<Data>[] = [
    {
      accessorKey: "no",
      header: "Step No",
      minSize: 170,
      sortingFn: (a, b) => a.original.no - b.original.no,
    },
    {
      accessorKey: "name",
      header: "Step Description",
      minSize: 100,
      sortingFn: (a, b) => {
        const nameA = a.original.name.toLowerCase();
        const nameB = b.original.name.toLowerCase();
        return nameA.localeCompare(nameB);
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      minSize: 170,
      sortingFn: (a, b) => {
        const CategoryA = a.original.category.toLowerCase();
        const CategoryB = b.original.category.toLowerCase();
        return CategoryA.localeCompare(CategoryB);
      },
    },
    {
      accessorKey: "action",
      header: "Action",
      minSize: 170,
      enableSorting: false,
      Cell: ({ row }) => (
        <Button variant="contained" sx={{ backgroundColor: "#808080" }}>
          Update
        </Button>
      ),
    },
  ];

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
        sx={{ mb: "5px", ml: "10px" }}
      >
        Add Step
      </Button>
      <MaterialReactTable
        columns={columns}
        data={rows}
        initialState={{
          pagination: { pageIndex: 0, pageSize: 10 },
        }}
        enableSorting
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Step</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Masukkan detail step baru di bawah ini.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="stepDescription"
            label="Step Description"
            type="text"
            fullWidth
            variant="standard"
            value={stepDescription}
            onChange={(e) => setStepDescription(e.target.value)}
            required
          />
          <TextField
            select
            margin="dense"
            id="category"
            label="Category"
            fullWidth
            variant="standard"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="ASSO JV">ASSO JV</MenuItem>
            <MenuItem value="SUBS">SUBS</MenuItem>
          </TextField>
          <TextField
            select
            margin="dense"
            id="fileType"
            label="File Type"
            fullWidth
            variant="standard"
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            required
          >
            <MenuItem value="Excel">Excel</MenuItem>
            <MenuItem value="Email">PDF</MenuItem>
            <MenuItem value="Text">Both</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddStep}>Add Step</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default DataWorkflow;
