import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import ButtonAddNews from "../Component/ButtonAddNews";
import { MaterialReactTable } from "material-react-table";
import {
  ICategory,
  IConsNewsProps,
  IConsProps,
} from "../Component/Interface/DataTemplate";
import React from "react";
import { columnConsNews } from "../Component/TableComponent/ColumnDef/IColumnMaster";
import { apiUrl, CustomSnackBar, generateCategory, getToken } from "../Component/TemplateUrl";
import CloseIcon from "@mui/icons-material/Close";
import useHandleUnauthorized from "../Component/handleUnauthorized";


export default function Archived() {
  const [dataCons, setDataCons] = React.useState<IConsNewsProps[]>([]);
  const [open, setOpen] = React.useState(false);
  const [news, setNews] = React.useState<IConsNewsProps>({
    uUid: "",
    vTitle: "",
    vSubTitle: "",
    vAttachment: "",
    dCrea: "",
    vCrea: "",
    vDescription: "",
    vConsolidateCategory: "",
    bActive: false,
  });
  const [message, setMessage] = React.useState("");
    const [openSnack, setOpenSnack] = React.useState(false);
    const [error, setError] = React.useState(false); 
    const [dataCategory, setDataCategory] = React.useState<ICategory[]>([])
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
    }

    React.useEffect(() => {
      fetchCategory()
    },[])

  function EditConsNews(props: IConsProps) {
    const { open, onClose, data } = props;
    const [vTitle, setVTitle] = React.useState("");
    const [vSubTitle, setVSubTitle] = React.useState("");
    const [vDesc, setVDesc] = React.useState("");
    const [vCategory, setVCategory] = React.useState("");
    const [vStatus, setVStatus] = React.useState(false);
    const [vId, setVId] = React.useState(""); 
    
    

    
    
    
  
    React.useEffect(() => {
      
      setVTitle(data.vTitle);
      setVSubTitle(data.vSubTitle);
      setVDesc(data.vDescription);
      setVCategory(data.vConsolidateCategory);
      setVStatus(data.bActive);
      setVId(data.uUid);
      
    }, [data]);
  
    const submitEditConsNews = () => {
      const editForm = new FormData();
  
      editForm.append("uUid", vId);
      editForm.append("vTitle", vTitle);
      editForm.append("vSubTitle", vSubTitle);
      editForm.append("vDescription", vDesc);
      editForm.append("vConsolidateCategory", vCategory);
      editForm.append("bActive", vStatus ? "true" : "false");
      fetch(apiUrl + "api/Consolidate/SubmitConsolidateNews", {
        method: "POST",
        headers: {
          Authorization: `bearer ${getToken}`,
          Accept: "*/*",
        },
        body: editForm,
      }).then((resp) => {
        if (resp.ok) {
          fetchConsNews()
          setMessage("Consolidate news edited successfully.")
          setOpenSnack(true)
          setError(false)
          onClose()     
          
        } else {
          setMessage("Consolidate news failed to edit.")
          setOpenSnack(true)
          setError(true)
          onClose()
        }
      });
    };
  
    return (
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Edit Consolidate News</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <FormControl fullWidth>
            <FormLabel sx={{ m: 1 }}>Title</FormLabel>
            <TextField
              value={vTitle}
              onChange={(val) => {
                setVTitle(val.target.value);
              }}
              size="small"
            />
          </FormControl>
          <FormControl fullWidth>
            <FormLabel sx={{ m: 1 }}>Sub Title</FormLabel>
            <TextField
              value={vSubTitle}
              onChange={(val) => {
                setVSubTitle(val.target.value);
              }}
              size="small"
            />
          </FormControl>
          <FormControl fullWidth>
            <FormLabel sx={{ m: 1 }}>Description</FormLabel>
            <TextField
              multiline
              rows={4}
              value={vDesc}
              onChange={(val) => {
                setVDesc(val.target.value);
              }}
              size="small"
            />
          </FormControl>
          <FormControl fullWidth size="small">
            <FormLabel sx={{ m: 1 }}>Category News</FormLabel>
  
            <Select
              value={vCategory}
              onChange={(val) => {
                setVCategory(val.target.value);
              }}
            >
              {dataCategory.filter((val) => val.bActive === true).map((val, index) => {
                return <MenuItem key={val.vCode} value={val.vCode}>{val.vValue1}</MenuItem>;
              })}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <FormLabel sx={{ m: 1 }}>Status</FormLabel>
            <RadioGroup
              row
              aria-labelledby="statusAffco"
              name="statusAffco"
              value={vStatus}
              onChange={(val) => {
                setVStatus(val.target.value === "true" ? true : false);
              }}
            >
              <FormControlLabel
                value={"true"}
                control={<Radio />}
                label="Active"
              />
              <FormControlLabel
                value={"false"}
                control={<Radio />}
                label="Non Active"
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Box sx={{ m: 1 }}>
            <Button
              variant="contained"
              size="small"
              color="primary"
              sx={{ m: 1 }}
              onClick={submitEditConsNews}
            >
              Edit
            </Button>
            <Button
              onClick={onClose}
              variant="contained"
              size="small"
              color="inherit"
              sx={{ m: 1 }}
            >
              Cancel
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    );
  }

  const fetchConsNews = () => {
    fetch(apiUrl + "api/Consolidate/GetConsolidateNews", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken}`,
      },
    }).then((resp) => {
      resp.json().then((news) => {
        setDataCons(
          news.data.map((val) => {
            return {
              uUid: val.uUid,
              vTitle: val.vTitle,
              vDescription: val.vDescription,
              vSubTitle: val.vSubTitle,
              vAttachment: val.vAttachment,
              vConsolidateCategory: val.vConsolidateCategory,
              dCrea: val.dCrea,
              vCrea: val.vCrea,
              bActive: val.bActive,
            };
          })
        );
      });
    })

  }

  React.useEffect(() => {
    fetchConsNews()
  }, []);

  const handleClickEdit = (data: IConsNewsProps) => {
    setOpen(true);
    setNews(data);
  };

  return (
    <Box>
      <ButtonAddNews />
      <br />
      {
        message && (
          <CustomSnackBar open={openSnack} onClose={() => { setOpenSnack(false)}} message={message} error={error}/>
        )
      }
      <MaterialReactTable
        columns={columnConsNews}
        data={dataCons}
        enableRowActions
        positionActionsColumn="last"
        renderRowActions={({ row }) => {
          const index = row.original.uUid;
          const consNews = dataCons.filter((v) => v.uUid === index);
          return (
            <Button
              variant="contained"
              size="small"
              color="error"
              onClick={() => {
                handleClickEdit(consNews[0]);
              }}
            >
              Edit
            </Button>
          );
        }}
      />
      <EditConsNews
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        data={news}
      />
    </Box>
  );
}
