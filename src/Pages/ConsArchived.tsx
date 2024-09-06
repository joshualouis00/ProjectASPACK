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
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import ButtonAddNews from "../Component/ButtonAddNews";
import { MaterialReactTable } from "material-react-table";
import {
  IConsNewsProps,
  IConsProps,
} from "../Component/Interface/DataTemplate";
import React from "react";
import { columnConsNews } from "../Component/TableComponent/ColumnDef/IColumnMaster";
import { apiUrl, generateCategory, getToken } from "../Component/TemplateUrl";
import CloseIcon from "@mui/icons-material/Close";

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
        
        alert("Success");
        onClose();        
        window.location.reload();
      } else {
        alert("Failed");
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
            {generateCategory.map((val, index) => {
              return <MenuItem key={index} value={val.id}>{val.name}</MenuItem>;
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

  React.useEffect(() => {
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
    });
  }, []);

  const handleClickEdit = (data: IConsNewsProps) => {
    setOpen(true);
    setNews(data);
  };

  return (
    <Box>
      <ButtonAddNews />
      <br />
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
