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
import axios from 'axios';

interface Data {
  vstepid: string;
  vstepdesc: string;
  vaffcoctgry: string;
  vfiletype: string;
  bactive: boolean | null;
}

export const DataWorkflow: React.FC = () => {
  const [rows, setRows] = React.useState<Data[]>([]);
  const [open, setOpen] = React.useState(false);
  const [stepDescription, setStepDescription] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [fileType, setFileType] = React.useState("");
  const user = localStorage.getItem("UserID");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get('http://192.168.1.207:9020/api/WorkflowStep/getStep');
        console.log("Data : ", JSON.stringify(resp.data, null, 2));
        setRows(resp.data.data);
      } catch (error) {
        console.error('Errornya : ', error);
      }
    };

    fetchData();

  }, []);

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

  const handleAddStep = async () => {
    const newStep = {
      vstepid: "STEP" + (rows.length + 1).toString(),
      vstepdesc: stepDescription,
      vaffcocategory: category,
      vfiletype: fileType,
      bactive: true
    }

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post('http://192.168.1.207:9020/api/WorkflowStep/addStep', newStep, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*'
        }
      });
      
      console.log("Nambah : ", JSON.stringify(newStep, null, 2));
      if (response.status === 200) {
        handleClose();
        window.location.reload();
      }
    } catch (error) {
      console.error('Errornya : ', error);
    }
  };

  const columns: MRT_ColumnDef<Data>[] = [
    {
      accessorKey: "vstepid",
      header: "Step No",
      size: 20
    },
    {
      accessorKey: "vstepdesc",
      header: "Step Description",
      size: 200,
      sortingFn: (a, b) => {
        const nameA = a.original.vstepdesc.toLowerCase();
        const nameB = b.original.vstepdesc.toLowerCase();
        return nameA.localeCompare(nameB);
      },
    },
    {
      accessorKey: "vaffcoctgry",
      header: "Category",
      size: 170,
      sortingFn: (a, b) => {
        const CategoryA = a.original.vaffcoctgry.toLowerCase();
        const CategoryB = b.original.vaffcoctgry.toLowerCase();
        return CategoryA.localeCompare(CategoryB);
      },
    },
    {
      header: "Action",
      Cell: ({ row }) => (
        <Button variant="contained" sx={{ backgroundColor: "#808080" }} size="small">
          Update
        </Button>
      ),
    },
  ];

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <MaterialReactTable
        columns={columns}
        data={rows}
        initialState={{
          pagination: { pageIndex: 0, pageSize: 10 },
        }}
        enableSorting
        renderTopToolbarCustomActions={({ table }) => {
          const handleContact = () => {
            setOpen(true);
          };

          return (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Button
                onClick={handleContact}
                variant="contained"
                color="primary"
                sx={{ m: "5px", fontSize: "12px" }}
                size="small"
              >
                Add Step
              </Button>
            </div>
          );
        }}

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
