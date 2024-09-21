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
import { apiUrl, getToken } from "../Component/TemplateUrl";

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
  const [editMode, setEditMode] = React.useState(false);
  const [selectedStep, setselectedStep] = React.useState<Data | null>(null);
  const navigate = useHandleUnauthorized();

  const fetchData = async () => {
    try {
      const resp = await axios.get(
        apiUrl + "api/WorkflowStep/getStep",
        {
          headers: {
            Authorization: `Bearer ` + getToken,
            Accept: "*/*",
          },
        }
      );
      
      setRows(resp.data.data);
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        navigate();
      } else {
        console.error("Error Get Step:", error);
      }
    }
  };
  React.useEffect(() => {
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

  const handleSaveStep = async () => {
    const stepData = {
      vStepId:
        editMode && selectedStep
          ? selectedStep.vStepId
          : "STEP" + (rows.length + 1).toString(),
      vStepDesc: stepDescription,
      vAffcoCategory: category,
      vfileType: fileType,
      bActive: bactive,
    };
  
    try {
      const response = await axios.post(
        apiUrl + `api/WorkflowStep/${editMode ? "editStep" : "addStep"}`,
        stepData,
        {
          headers: {
            Authorization: `Bearer ` + getToken,
            Accept: "*/*",
          },
        }
      );
  
      // Check for status 200 (OK) or 204 (No Content)
      if (response.status === 200 || response.status === 204) {
        if (editMode) {
          // If in edit mode, find and update the existing row
          setRows((prevRows) =>
            prevRows.map((row) =>
              row.vStepId === stepData.vStepId
                ? {
                    ...row,
                    vStepDesc: stepData.vStepDesc,
                    vAffcoCtgry: stepData.vAffcoCategory,
                    vAttType: stepData.vfileType,
                    bActive: stepData.bActive,
                  }
                : row
            )
          );
        } else {
          // If not in edit mode, add a new row
          setRows((prevRows) => [
            ...prevRows,
            {
              vStepId: stepData.vStepId,
              vStepDesc: stepData.vStepDesc,
              vAffcoCtgry: stepData.vAffcoCategory,
              vAttType: stepData.vfileType,
              bActive: stepData.bActive,
            },
          ]);
        }
        await fetchData(); // Ensure data is refreshed from the server
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
      Cell: ({ cell }) => (
        <span
          style={{
            display: "block",
            width: "65px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {cell.getValue<string>()}
        </span>
      ),
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
      Cell: ({ cell }) => (
        <span
          style={{
            display: "block",
            width: "150px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {cell.getValue<string>()}
        </span>
      ),
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
      Cell: ({ cell }) => (
        <span
          style={{
            display: "block",
            width: "100px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {cell.getValue<string>()}
        </span>
      ),
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
      Cell: ({ cell }) => (
        <span
          style={{
            display: "block",
            width: "100px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {cell.getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "bActive",
      header: "Active",
      size: 100,
      Cell: ({ cell }) => (
        <span
        style={{
          display: "block",
          width: "105px",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        >
          {cell.getValue<boolean>() ? "Active" : "Inactive"} 
        </span>
      ),
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
        disabled={editMode}
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
