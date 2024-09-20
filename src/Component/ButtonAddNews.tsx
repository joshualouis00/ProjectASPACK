import styled from "@emotion/styled";
import { ArrowBack, Create } from "@mui/icons-material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
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
  FormHelperText,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import React from "react";
import { apiUrl, CustomSnackBar, generateCategory, getToken } from "./TemplateUrl";

interface AddNewsProps {
  open: boolean;
  onClose: () => void;
}



export default function ButtonAddNews() {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
    const [openSnack, setOpenSnack] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  function AddNewsDialog(props: AddNewsProps) {
    const { open, onClose } = props;
    const [category, setCategory] = React.useState("");  
    const [dataFile, setDataFile] = React.useState<File>();
    const [title, setTitle] = React.useState("");
    const [subTitle, setSubTitle] = React.useState("");
    const [desc, setDesc] = React.useState("");
    const [attchName, setAttchName] = React.useState("");
    const [hasErrorTitle, setHasErrorTitle] = React.useState(false);
    const [hasErrorSub, setHasErrorSub] = React.useState(false);
    const [hasErrorDesc, setHasErrorDesc] = React.useState(false);
    const [hasErrorFile, setHasErrorFile] = React.useState(false);
    const [hasErrorCat, setHasErrorCat] = React.useState(false);  
    const [btnCreate, setBtnCreate] = React.useState(false);  
  
    const handleChangeCategory = (event: SelectChangeEvent) => {
      if(event.target.value === ""){
        setHasErrorCat(true)
        setCategory(event.target.value);
      } else {
        setHasErrorCat(false)
        setCategory(event.target.value);
      }
      
    };
  
    const handleFileUpload = (event) => {
      if(event.target.files[0] === undefined){
        setHasErrorFile(true)
        setDataFile(event.target.files[0])
      setAttchName(event.target.files[0].name)

      } else {
        setHasErrorFile(false)
        setDataFile(event.target.files[0])
      setAttchName(event.target.files[0].name)
      }
      
    }
  
    const handleChangeTitle = (event) => {
      
      if(event.target.value === ""){
        setHasErrorTitle(true)
        setTitle(event.target.value);
      } else {
        setHasErrorTitle(false)
        setTitle(event.target.value);
      }
    }
  
    const handleChangeSubtitle = (event) => {
      if(event.target.value === ""){
        setHasErrorSub(true)
        setSubTitle(event.target.value);
      }
      else{
        setHasErrorSub(false)
        setSubTitle(event.target.value);
      }
      
    }
  
    const handleChangeDesc = (event) => {
      if(event.target.value === ""){
        setHasErrorDesc(true)
        setDesc(event.target.value)
      } else {
        setHasErrorDesc(false)
        setDesc(event.target.value)
      }
      
    }
  
    const handleCreateNews =  () => {
      
      const dataForm = new FormData();
      if(title !== "" && subTitle !== "" && desc !== "" && dataFile !== undefined && category !== ""){
        setBtnCreate(true);
        setLoading(true);
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
              setLoading(false)          
              setCategory("")
              setTitle("");
              setSubTitle("");
              setDesc("");
              setDataFile(undefined);
              setMessage("Consolidate news added successfully.");
              setError(false);
              setOpenSnack(true);
              onClose();
              setBtnCreate(false)
              setTimeout(() => {
                window.location.reload();
              },2000)
              
            } else {   
              setLoading(false)          
              setCategory("")
              setTitle("");
              setSubTitle("");
              setDesc("");
              setDataFile(undefined);
              setMessage(val.message)
              setError(true);
              setOpenSnack(true);
              onClose();
              setBtnCreate(false)
            }
          })       
          
        }
      })
      } else {
        if(title === ""){
          setHasErrorTitle(true)
        } 
        if(subTitle === ""){
          setHasErrorSub(true)
        }
        if(desc === ""){
          setHasErrorDesc(true)
        }
        if(dataFile === undefined){
          setHasErrorFile(true)
        }
        if(category === ""){
          setHasErrorCat(true)
        }
      }
      
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
              <TextField size="small" label="Title News" value={title} onChange={handleChangeTitle} error={hasErrorTitle}/>
              {
                hasErrorTitle && (<FormHelperText sx={{ color: "red" }}>
                  This is required!
                </FormHelperText>)
              }
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <TextField size="small" label="Sub Title News" name="vSubTitle" value={subTitle} onChange={handleChangeSubtitle} error={hasErrorSub}/>
              {
                hasErrorSub && (
                  <FormHelperText sx={{ color: "red" }}>
                      This is required!
                    </FormHelperText>
                )
              }
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <TextField
                multiline              
                label="Description"
                name="vDesc"
                value={desc}
                onChange={handleChangeDesc}
                rows={3}
                error={hasErrorDesc}
                
              ></TextField>
              {
                hasErrorDesc && (
                  <FormHelperText sx={{ color: "red" }}>
                      This is required!
                    </FormHelperText>
                )
              }
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="categoryId" color={hasErrorCat ? "error" : undefined}>Category News</InputLabel>
              <Select
                labelId="categoryId"
                name="vCategory"
                label="Category News"                
                value={category}
                onChange={handleChangeCategory}
                error={hasErrorCat}
              >
                {
                  generateCategory.map((val,index) => {
                    return (
                      <MenuItem key={index} value={val.id}>{val.name}</MenuItem>
                    )
                  })
                }
              </Select>
              {
                hasErrorCat && (
                  <FormHelperText sx={{ color: "red" }}>
                      This is required!
                    </FormHelperText>
                )
              }
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
              {
                hasErrorFile && (<FormHelperText sx={{ color: "red" }}>
                  File is required!
                </FormHelperText>)
              }
            <FormLabel  sx={{ marginBottom: 1}}>{dataFile ? dataFile?.name : "no file selected"}</FormLabel>
            </FormControl>
            
          </Box>
          {
              loading && (<Backdrop open={loading}><CircularProgress color="inherit" /></Backdrop>)
            }
        </DialogContent>
        <DialogActions>
          <Button color="success" variant="contained" startIcon={<Create />} onClick={handleCreateNews} disabled={btnCreate}>
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
      {
        message && (
          <CustomSnackBar open={openSnack} message={message} onClose={() => { setOpenSnack(false)}} error={error} />
        )
      }
      <AddNewsDialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      />
    </Box>
  );
}
