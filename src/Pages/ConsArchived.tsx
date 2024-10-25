import {
  Box,
  Button,
  Card,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
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
import { apiUrl, CustomSnackBar, getToken } from "../Component/TemplateUrl";
import CloseIcon from "@mui/icons-material/Close";
import useHandleUnauthorized from "../Component/handleUnauthorized";
import styled from "@emotion/styled";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

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
    dLastSend: "",
    category: "",
    vImage: "",
  });
  const [message, setMessage] = React.useState("");
  const [openSnack, setOpenSnack] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [dataCategory, setDataCategory] = React.useState<ICategory[]>([]);
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

  function EditConsNews(props: IConsProps) {
    const { open, onClose, data } = props;
    const [vTitle, setVTitle] = React.useState("");
    const [hasErrorTitle, setHasErrorTitle] = React.useState(false);
    const [vSubTitle, setVSubTitle] = React.useState("");
    const [hasErrorSubTitle, setHasErrorSubTitle] = React.useState(false);
    const [vDesc, setVDesc] = React.useState("");
    const [hasErrorDesc, setHasErrorDesc] = React.useState(false);
    const [vCategory, setVCategory] = React.useState("");
    const [vStatus, setVStatus] = React.useState(false);
    const [vId, setVId] = React.useState("");
    const [vImage, setVImage] = React.useState("");
    const [invalidType, setInvalidType] = React.useState("");
    const [dataBanner, setDataBanner] = React.useState<File>();
    const [hasErrorBanner, setHasErrorBanner] = React.useState(false);

    React.useEffect(() => {
      setVTitle(data.vTitle);
      setVSubTitle(data.vSubTitle);
      setVDesc(data.vDescription);
      setVCategory(data.vConsolidateCategory);
      setVStatus(data.bActive);
      setVId(data.uUid);
      setVImage(data.vImage);
    }, [data]);

    const submitEditConsNews = () => {
      const editForm = new FormData();
      if (vTitle !== "" && vSubTitle !== "" && vDesc !== "") {
        if (dataBanner !== undefined) {
          console.log("ada file")
          let readerBanner = new FileReader();
          let encodeBanner;
          readerBanner.readAsDataURL(dataBanner);
          readerBanner.onloadend = () => {
            encodeBanner = readerBanner.result;
            
            editForm.append("uUid", vId);
        editForm.append("vTitle", vTitle);
        editForm.append("vSubTitle", vSubTitle);
        editForm.append("vDescription", vDesc);
        editForm.append("vConsolidateCategory", vCategory);
        editForm.append("vImage", encodeBanner);
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
            fetchConsNews();
            setMessage("Consolidate news edited successfully.");
            setOpenSnack(true);
            setError(false);
            onClose();
          } else {
            setMessage("Consolidate news failed to edit.");
            setOpenSnack(true);
            setError(true);
            onClose();
          }
        });
          };
        } else {
          console.log("gak ada file")
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
            fetchConsNews();
            setMessage("Consolidate news edited successfully.");
            setOpenSnack(true);
            setError(false);
            onClose();
          } else {
            setMessage("Consolidate news failed to edit.");
            setOpenSnack(true);
            setError(true);
            onClose();
          }
        });
        }

        
      } else {
        if (vTitle === "") {
          setHasErrorTitle(true);
        }
        if (vSubTitle === "") {
          setHasErrorSubTitle(true);
        }
        if (vDesc === "") {
          setHasErrorDesc(true);
        }
      }
    };

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

    const handleBannerUpload = (event) => {
      const validExt = ["image/jpeg", "image/png"];
      if (event.target.files[0] !== undefined) {
        const validFile = validExt.includes(event.target.files[0].type);
        if (validFile) {
          setHasErrorBanner(false);
          setInvalidType("");
          setDataBanner(event.target.files[0]);
        } else {
          setHasErrorBanner(true);
          setInvalidType(
            "Invalid file type. Only .jpg, .jpeg, and .png are allowed."
          );
        }
      }
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
            <Box>
              <FormLabel sx={{ m: 1 }}>Title News</FormLabel>
              <FormLabel sx={{ color: "red" }}>*</FormLabel>
            </Box>

            <TextField
              error={hasErrorTitle}
              value={vTitle}
              onChange={(val) => {
                if (val.target.value !== "") {
                  setVTitle(val.target.value);
                  setHasErrorTitle(false);
                } else {
                  setVTitle(val.target.value);
                  setHasErrorTitle(true);
                }
              }}
              size="small"
            />
            {hasErrorTitle && (
              <FormHelperText sx={{ color: "red" }}>
                This is required!
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth>
            <Box>
              <FormLabel sx={{ m: 1 }}>Sub Title News</FormLabel>
              <FormLabel sx={{ color: "red" }}>*</FormLabel>
            </Box>

            <TextField
              error={hasErrorSubTitle}
              value={vSubTitle}
              onChange={(val) => {
                if (val.target.value !== "") {
                  setVSubTitle(val.target.value);
                  setHasErrorSubTitle(false);
                } else {
                  setVSubTitle(val.target.value);
                  setHasErrorSubTitle(true);
                }
              }}
              size="small"
            />
            {hasErrorSubTitle && (
              <FormHelperText sx={{ color: "red" }}>
                This is required!
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth>
            <Box>
              <FormLabel sx={{ m: 1 }}>Description</FormLabel>
              <FormLabel sx={{ color: "red" }}>*</FormLabel>
            </Box>

            <TextField
              error={hasErrorDesc}
              multiline
              rows={4}
              value={vDesc}
              onChange={(val) => {
                if (val.target.value !== "") {
                  setVDesc(val.target.value);
                  setHasErrorDesc(false);
                } else {
                  setVDesc(val.target.value);
                  setHasErrorDesc(true);
                }
              }}
              size="small"
            />
            {hasErrorDesc && (
              <FormHelperText sx={{ color: "red" }}>
                This is required!
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth size="small">
            <FormLabel sx={{ m: 1 }}>Category News</FormLabel>

            <Select
              value={vCategory}
              onChange={(val) => {
                setVCategory(val.target.value);
              }}
            >
              {dataCategory
                .filter((val) => val.bActive === true)
                .map((val, index) => {
                  return (
                    <MenuItem key={val.vCode} value={val.vCode}>
                      {val.vValue1}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <FormLabel sx={{ m: 1 }}>Previous Banner</FormLabel>
            <Card>
              <CardMedia
                sx={{ maxWidth: "100%", height: 150 }}
                component={"img"}
                src={vImage}
              />
            </Card>
          </FormControl>
          <FormControl sx={{ m: 1 }} fullWidth>
            <Box>
              <FormLabel id="vAttach" sx={{ marginBottom: 1 }}>
                Banner{" "}
              </FormLabel>
              <FormLabel sx={{ color: "red" }}>
                *(File type: *.JPG,*.JPEG,*.PNG)
              </FormLabel>
            </Box>

            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload file
              <VisuallyHiddenInput type="file" onChange={handleBannerUpload} />
            </Button>
          </FormControl>

          <FormControl sx={{ m: 1 }} fullWidth>
            {hasErrorBanner && (
              <FormHelperText sx={{ color: "red" }}>
                {invalidType}
              </FormHelperText>
            )}
            <FormLabel sx={{ marginBottom: 1 }}>
              {dataBanner ? dataBanner?.name : "no file selected"}
            </FormLabel>
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
              dLastSend: val.dLastSend,
              category: val.vConsolidateCategoryName,
              vImage: val.vImage,
            };
          })
        );
      });
    });
  };

  React.useEffect(() => {
    fetchConsNews();
  }, []);

  const handleClickEdit = (data: IConsNewsProps) => {
    setOpen(true);
    setNews(data);
  };

  return (
    <Box>
      <ButtonAddNews />
      <br />
      {message && (
        <CustomSnackBar
          open={openSnack}
          onClose={() => {
            setOpenSnack(false);
          }}
          message={message}
          error={error}
        />
      )}
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
