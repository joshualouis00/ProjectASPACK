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
import axios from "axios";
import useHandleUnauthorized from "../Component/handleUnauthorized";

interface Data {
  vStepId: string;
  vStepDesc: string;
  vAffcoCtgry: string;
  vAttType: string;
  bActive: boolean | null;
}

export const DataWorkflow: React.FC = () => {
  const [rows, setRows] = React.useState<Data[]>([]);
  const [open, setOpen] = React.useState(false);
  const [stepDescription, setStepDescription] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [fileType, setFileType] = React.useState("");
  const [bactive, setBactive] = React.useState<boolean>(true);
  const [change, setChange] = React.useState<boolean>(false);

  //Buat si Edit
  const [editMode, setEditMode] = React.useState(false);
  const [selectedStep, setselectedStep] = React.useState<Data | null>(null);

  const token = localStorage.getItem("token");

  const navigate = useHandleUnauthorized();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get(
          "http://192.168.1.207:9020/api/WorkflowStep/getStep",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "*/*",
            },
          }
        );
        console.log("Data : ", JSON.stringify(resp.data, null, 2));
        setRows(resp.data.data);
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          navigate();
        } else {
          console.error("Error Get Step:", error);
        }
      }
    };

    fetchData();
  }, [change]);

  const handleClose = () => {
    setOpen(false);
    resetDialogFields();
    setselectedStep(null);
    setEditMode(false);
    setChange(false);
  };

  const handleOpenEditDialog = (step: Data) => {
    setselectedStep(step);
    setStepDescription(step.vStepDesc);
    setCategory(step.vAffcoCtgry);
    setFileType(step.vAttType);
    setBactive(step.bActive || false);
    setEditMode(true);
    setOpen(true);
  };

  const resetDialogFields = () => {
    setStepDescription("");
    setCategory("");
    setFileType("");
    setBactive(true);
  };

  //Add Step
  const handleSaveStep = async () => {
    const token = localStorage.getItem("token");
    const stepData = {
      vstepid:
        editMode && selectedStep
          ? selectedStep.vStepId
          : "STEP" + (rows.length + 1).toString(),
      vstepdesc: stepDescription,
      vaffcocategory: category,
      vfiletype: fileType,
      bactive: bactive,
    };

    try {
      const response = await axios.post(
        `http://192.168.1.207:9020/api/WorkflowStep/${
          editMode ? "editStep" : "addStep"
        }`,
        stepData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        }
      );

      console.log(
        `${editMode ? "Edit" : "Tambah"} : `,
        JSON.stringify(stepData, null, 2)
      );
      if (response.status === 200) {
        handleClose();
        setChange(true);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        navigate();
      } else {
        console.error("Error Workflow Step:", error);
      }
    }
  };

  const columns: MRT_ColumnDef<Data>[] = [
    {
      accessorKey: "vStepId",
      header: "Step No",
      size: 20,
    },
    {
      accessorKey: "vStepDesc",
      header: "Step Description",
      size: 200,
      sortingFn: (a, b) => {
        const nameA = a.original.vStepDesc.toLowerCase();
        const nameB = b.original.vStepDesc.toLowerCase();
        return nameA.localeCompare(nameB);
      },
    },
    {
      accessorKey: "vAffcoCtgry",
      header: "Category",
      size: 170,
      sortingFn: (a, b) => {
        const CategoryA = a.original.vAffcoCtgry.toLowerCase();
        const CategoryB = b.original.vAffcoCtgry.toLowerCase();
        return CategoryA.localeCompare(CategoryB);
      },
    },
    {
      accessorKey: "vAttType",
      header: "File Type",
      size: 100,
      sortingFn: (a, b) => {
        const typeA = a.original.vAttType.toLowerCase();
        const typeB = b.original.vAttType.toLowerCase();
        return typeA.localeCompare(typeB);
      },
    },
    {
      accessorKey: "bActive",
      header: "Active",
      size: 100,
      Cell: ({ cell }) => (cell.getValue<boolean>() ? "Active" : "Inactive"), // Ubah bactive menjadi "Active" atau "Inactive"
    },
    {
      header: "Action",
      Cell: ({ row }) => (
        <Button
          variant="contained"
          sx={{ backgroundColor: "#808080" }}
          size="small"
          onClick={() => handleOpenEditDialog(row.original)}
        >
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
        <DialogTitle>{editMode ? "Edit Step" : "Add Step"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {editMode
              ? "Edit detail step di bawah ini."
              : "Masukkan detail step baru di bawah ini."}
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
            <MenuItem value="PDF">PDF</MenuItem>
            <MenuItem value="Both">Both</MenuItem>
          </TextField>
          {/* Tambahkan pilihan untuk bactive */}
          <TextField
            select
            margin="dense"
            id="bactive"
            label="Active Status"
            fullWidth
            variant="standard"
            value={bactive ? "Active" : "Inactive"}
            onChange={(e) => setBactive(e.target.value === "Active")}
            required
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSaveStep}>
            {editMode ? "Save Changes" : "Add Step"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default DataWorkflow;
