import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import React from "react";
import {
  ICatEditProps,
  ICategory,
  ICategoryProps,
} from "../Component/Interface/DataTemplate";
import { MaterialReactTable } from "material-react-table";
import { columnCategory } from "../Component/TableComponent/ColumnDef/IColumnMaster";
import { apiUrl, CustomSnackBar, getToken } from "../Component/TemplateUrl";
import useHandleUnauthorized from "../Component/handleUnauthorized";

export default function CategorySettings() {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [dataCategory, setDataCategory] = React.useState<ICategory[]>([]);
  const [dataCategoryEdit, setDataCategoryEdit] = React.useState<ICategory>({
    vCode: "",
    vType: "",
    vValue1: "",
    vValue2: "",
    bActive: false
  })
  const [message, setMessage] = React.useState("");
  const [openSnack, setOpenSnack] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);

  const navigate = useHandleUnauthorized();

  const fetchCategory = () => {
    fetch(apiUrl + "api/Setting/GetSettingValue?types=CATEGORY", {
      method: "GET",
      headers: {
        Authorization: `bearer ${getToken}`,
      },
    }).then((resp) => {
      if (resp.ok) {
        resp.json().then((valData) => {
          setDataCategory(
            valData.data.map((val) => {
              return {
                vCode: val.vCode,
                vType: val.vType,
                vValue1: val.vValue1,
                vValue2: val.vValue2,
                bActive: val.bActive,
              };
            })
          );
        });
      } else {
        navigate();
      }
    });
  };

  React.useEffect(() => {
    fetchCategory();
  }, []);

  function AddCategory(props: ICategoryProps) {
    const { open, onClose } = props;
    const [code, setCode] = React.useState("");
    const [desc, setDesc] = React.useState("");
    const [hasErrorCode, setHasErrorCode] = React.useState(false);
    const [hasErrorDesc, setHasErrorDesc] = React.useState(false);
    const [duplicate, setDuplicate] = React.useState(false);
    const [maxCode, setMaxCode] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleAddCategory = () => {
      if (code !== "" && desc !== "") {
        let validCategory = dataCategory.filter(
          (val) => val.vCode.toLowerCase() === code.toLowerCase()
        );

        if (validCategory.length > 0) {
          setDuplicate(true);
          setHasErrorCode(true);
        } else {
          if (code.length > 4) {
            setMaxCode(true);
            setHasErrorCode(true);
          } else {
            setLoading(true);
            setDuplicate(false);
            setMaxCode(false);
            setHasErrorCode(false);
            fetch(apiUrl + "api/Setting/SaveSettingValue", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `bearer ${getToken}`,
              },
              body: JSON.stringify({
                vCode: code,
                vType: "CATEGORY",
                vValue1: desc,
                vValue2: "",
                bActive: true,
              }),
            }).then((resp) => {
              if (resp.ok) {
                fetchCategory();
                setLoading(false);
                setMessage("Add category successfully");
                setOpenSnack(true);
                setError(false);
                onClose();
              } else {
                fetchCategory();
                setLoading(false);
                setMessage("Add category failed!");
                setError(true);
                setOpenSnack(true);
                onClose();
              }
            });
          }
        }
      } else {
        if (code === "") {
          setHasErrorCode(true);
        }
        if (desc === "") {
          setHasErrorDesc(true);
        }
      }
    };

    return (
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Add Category</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          x
        </IconButton>
        <DialogContent dividers>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "left",
            }}
          >
            <FormControl sx={{ m: 1 }}>
              <TextField
                size="small"
                value={code}
                label="Code"
                onChange={(val) => {
                  if (val.target.value !== "") {
                    setHasErrorCode(false);
                    setCode(val.target.value);
                  } else {
                    setHasErrorCode(true);
                    setCode(val.target.value);
                  }
                }}
                fullWidth
              />
              {hasErrorCode && (
                <FormHelperText sx={{ color: "red" }}>
                  {duplicate
                    ? "Code already registered."
                    : maxCode
                    ? "Max char for code : 4"
                    : "This is required!"}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl sx={{ m: 1 }}>
              <TextField
                size="small"
                value={desc}
                label="Description"
                onChange={(val) => {
                  if (val.target.value !== "") {
                    setDesc(val.target.value);
                    setHasErrorDesc(false);
                  } else {
                    setDesc(val.target.value);
                    setHasErrorDesc(true);
                  }
                }}
                fullWidth
              />
              {hasErrorDesc && (
                <FormHelperText sx={{ color: "red" }}>
                  This is required!
                </FormHelperText>
              )}
            </FormControl>
            {loading && (
              <Backdrop open={loading}>
                <CircularProgress color="inherit" />
              </Backdrop>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="small"
            color="success"
            onClick={handleAddCategory}
          >
            Add
          </Button>
          <Button
            variant="contained"
            size="small"
            color="inherit"
            onClick={onClose}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  function EditCategory(props: ICatEditProps) {
    const { open, onClose, data } = props;
    const [code, setCode] = React.useState("");
    const [desc, setDesc] = React.useState("");
    const [status, setStatus] = React.useState("")
    const [hasErrorDesc, setHasErrorDesc] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        setCode(data.vCode);
        setDesc(data.vValue1);
        setStatus(data.bActive ? "Active" : "Non active")
    },[data])

    const handleEditCategory = () => {

        if(desc !== ""){
            setLoading(true)
            setHasErrorDesc(false)
            fetch(apiUrl + "api/Setting/SaveSettingValue", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `bearer ${getToken}`,
                },
                body: JSON.stringify({
                  vCode: code,
                  vType: "CATEGORY",
                  vValue1: desc,
                  vValue2: "",
                  bActive: status === "Active" ? true : false,
                }),
              }).then((resp) => {
                if (resp.ok) {
                  fetchCategory();
                  setLoading(false);
                  setMessage("Edit category successfully");
                  setOpenSnack(true);
                  setError(false);
                  onClose();
                } else {
                  fetchCategory();
                  setLoading(false);
                  setMessage("Edit category failed!");
                  setError(true);
                  setOpenSnack(true);
                  onClose();
                }
              });

        }else{
            setHasErrorDesc(true);
        }
    }

    return (
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Edit Category</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          x
        </IconButton>
        <DialogContent dividers>
            <Box sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "left",
            }}>
                <FormControl sx={{ m: 1 }}>
              <TextField
                size="small"
                value={code}
                label="Code"
                disabled
                fullWidth
              />
              
            </FormControl>
            <FormControl sx={{ m: 1 }}>
              <TextField
                size="small"
                value={desc}
                label="Description"
                onChange={(val) => {
                  if (val.target.value !== "") {
                    setDesc(val.target.value);
                    setHasErrorDesc(false);
                  } else {
                    setDesc(val.target.value);
                    setHasErrorDesc(true);
                  }
                }}
                fullWidth
              />
              {hasErrorDesc && (
                <FormHelperText sx={{ color: "red" }}>
                  This is required!
                </FormHelperText>
              )}
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <FormLabel>Status Affiliate Company</FormLabel>
              <RadioGroup
                row
                value={status}
                onChange={(val) => {
                  setStatus(val.target.value);
                }}
              >
                <FormControlLabel
                  value="Active"
                  control={<Radio />}
                  label="Active"
                />
                <FormControlLabel
                  value="Non active"
                  control={<Radio />}
                  label="Non Active"
                />
              </RadioGroup>
            </FormControl>
            {loading && (
              <Backdrop open={loading}>
                <CircularProgress color="inherit" />
              </Backdrop>
            )}

            </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="small"
            color="success"
            onClick={handleEditCategory}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            size="small"
            color="inherit"
            onClick={onClose}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  const handleClickEdit= (data: ICategory) => {
    setOpenEdit(true)
    setDataCategoryEdit(data)
    
  }

  return (
    <Box>
      <Button
        size="medium"
        variant="contained"
        sx={{ mt: 1, mb: 3, ml: 1, mr: 1 }}
        onClick={() => {
          setOpenDialog(true);
        }}
      >
        Add Category
      </Button>
      <AddCategory open={openDialog} onClose={() => setOpenDialog(false)} />
      {message && (
        <CustomSnackBar
          open={openSnack}
          onClose={() => {
            setOpenSnack(false);
          }}
          error={error}
          message={message}
        />
      )}
      <MaterialReactTable
        columns={columnCategory}
        data={dataCategory}
        enableRowActions
        renderRowActions={({ row }) => {
          const index = row.original.vCode;
          const editData = dataCategory.filter((val) => val.vCode === index);         

          return (
            <Button variant="contained" color="error" onClick={() => {handleClickEdit(editData[0])}}>
                Edit
              </Button>
          );
        }}
        positionActionsColumn="last"
      />
      <EditCategory
                open={openEdit}
                onClose={() => {
                  setOpenEdit(false);
                }}
                data={dataCategoryEdit}
              />
    </Box>
  );
}
