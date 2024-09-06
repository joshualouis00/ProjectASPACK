import styled from "@emotion/styled";
import { ArrowBack, Create } from "@mui/icons-material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import React from "react";
import { apiUrl, generateCategory, getToken } from "./TemplateUrl";

interface AddNewsProps {
  open: boolean;
  onClose: () => void;
}

function AddNewsDialog(props: AddNewsProps) {
  const { open, onClose } = props;
  const [category, setCategory] = React.useState("");  
  const [dataFile, setDataFile] = React.useState<File>();
  const [title, setTitle] = React.useState("");
  const [subTitle, setSubTitle] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [attchName, setAttchName] = React.useState("");

  const handleChangeCategory = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };

  const handleFileUpload = (event) => {
    setDataFile(event.target.files[0])
    setAttchName(event.target.files[0].name)
  }

  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
  }

  const handleChangeSubtitle = (event) => {
    setSubTitle(event.target.value);
  }

  const handleChangeDesc = (event) => {
    setDesc(event.target.value)
  }

  const handleCreateNews =  () => {
    
    const dataForm = new FormData();
    
    dataForm.append("uUid","");
    dataForm.append("vTitle", title);
    dataForm.append("vSubTitle", subTitle);
    dataForm.append("vDescription", desc);
    dataForm.append("vConsolidateCategory", category);
    dataForm.append("vAttachment", attchName);
    dataFile ? dataForm.append("fAttachment", dataFile) : dataForm.append("fAttachment", "")
    fetch(apiUrl + "api/Consolidate/SubmitConsolidateNews",{
      method: "POST",
      headers: {
        Authorization: `bearer ${getToken}`,
          Accept: "*/*",
      },
      body: dataForm
    }).then((resp) => {
      if(resp.ok){
        resp.json().then((val) => {
          if(val.success){
            onClose();
            setCategory("")
            setTitle("");
            setSubTitle("");
            setDesc("");
            setDataFile(undefined);
            window.location.reload();
          } else {
            alert(val.message);
            setCategory("")
            setTitle("");
            setSubTitle("");
            setDesc("");
            setDataFile(undefined);
          }
        })
        
        
      }
    })
  }



  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  return (
    <Dialog open={open} fullWidth={true} onClose={onClose}>
      <DialogTitle>Create Consolidate News</DialogTitle>
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
          sx={{ display: "flex", flexDirection: "column", alignItems: "left" }}
        >
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <TextField size="small" label="Title News" value={title} onChange={handleChangeTitle}/>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <TextField size="small" label="Sub Title News" name="vSubTitle" value={subTitle} onChange={handleChangeSubtitle} />
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <TextField
              multiline              
              label="Description"
              name="vDesc"
              value={desc}
              onChange={handleChangeDesc}
              rows={3}
            ></TextField>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="categoryId">Category News</InputLabel>
            <Select
              labelId="categoryId"
              name="vCategory"
              label="Category News"
              value={category}
              onChange={handleChangeCategory}
            >
              {
                generateCategory.map((val,index) => {
                  return (
                    <MenuItem key={index} value={val.id}>{val.name}</MenuItem>
                  )
                })
              }
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
          <FormLabel id="vAttach" sx={{ marginBottom: 1}}>Attachment File</FormLabel>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload file
              <VisuallyHiddenInput type="file" onChange={handleFileUpload}/>
            </Button>
          </FormControl>
          <FormControl>
          <FormLabel  sx={{ marginBottom: 1}}>{dataFile ? dataFile?.name : "no file selected"}</FormLabel>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="success" variant="contained" startIcon={<Create />} onClick={handleCreateNews}>
          Create
        </Button>
        <Button
          onClick={onClose}
          color="inherit"
          variant="contained"
          startIcon={<ArrowBack />}
        >
          Back
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function ButtonAddNews() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  return (
    <Box>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        size="medium"
        sx={{ m: 1 }}
      >
        Add Consolidate News
      </Button>
      <AddNewsDialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      />
    </Box>
  );
}
