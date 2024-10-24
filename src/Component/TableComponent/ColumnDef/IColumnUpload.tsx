import { MRT_ColumnDef } from "material-react-table";
import {
  IRemarkProps,
  IRespFile,
  IResponseProps,
  IStepProps,
  ITempResponse,
} from "../../Interface/DataUpload";
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
  TextField,
} from "@mui/material";
import { apiUrl } from "../../TemplateUrl";
import {  useState } from "react";
import { Download } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { dataRespAffco, dataCountRevise } from "../../../Pages/AffcoUpload";
import { dataRespAffcoCons } from "../../../Pages/ConsApprovals";
import { format } from "date-fns";

export let respsAffco: IRespFile[] = [];

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

const handleClickPreview = (
  stepid: string,
  version: string,
  vAttachId: string
) => {
  fetch(apiUrl +
    `api/Package/DownloadPackage?vStepId=${stepid}&iVersion=${
      version.split("V")[1]
    }&vAttachId=${vAttachId}`,{
      'method':'GET'
    }).then((resp) => {
      if(resp.status === 404){
        alert("no attachment file")
      } else {
        window.open(apiUrl +
          `api/Package/DownloadPackage?vStepId=${stepid}&iVersion=${
            version.split("V")[1]
          }&vAttachId=${vAttachId}`)

      }
    })
  
  
};

const fetchDownloadResponse = (
  types: string,
  version: string,
  attachId: string
) => {
  fetch(apiUrl +
    `api/Package/DownloadResponseAttachment?types=${types}&iVersion=${version}&vAttachId=${attachId}`, {
      'method': 'GET',      
    }).then((resp) => {
      if(resp.status === 404){
        alert("no attachment file")
      } else {
        window.open(apiUrl +
          `api/Package/DownloadResponseAttachment?types=${types}&iVersion=${version}&vAttachId=${attachId}`)

      }
    })
  
};

let tempResp: ITempResponse[] = []

function ResponseDialog(props: IResponseProps){
  const {open, onClose, stepId, version, attachId} = props

  let iVersion = version.split("V")[1];
  let curVersion = parseInt(iVersion) - 1
  const vResponse = dataRespAffcoCons.length !== 0 ? dataRespAffcoCons.filter(
    (val) =>
      val.vStepId === stepId && val.version === curVersion.toString()
  ).map((val) => { return val.vRemark}) : ""
  

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Response Affco</DialogTitle>
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
      <DialogContent>
      <Box
          sx={{ display: "flex", flexDirection: "column", alignItems: "left" }}
        >
          <FormControl sx={{ m: 1 }}>
            <TextField
              disabled={
                 true
              }
              size="small"              
              value={
                vResponse[0]
              }
              multiline
              rows={4}
              label="Response from Affco"
              
            />            
          </FormControl>
          <FormControl sx={{ m: 1 }}>
              <Button
                sx={{ m: 1 }}
                size="small"
                variant="contained"
                color="inherit"
                onClick={() => {
                  fetchDownloadResponse("RESPAFFCO", curVersion.toString(), attachId);
                }}
              >
                <Download /> Download
              </Button>
            </FormControl>

        </Box>

      </DialogContent>
      <DialogActions>
      <Button
          size="small"
          variant="contained"
          color="inherit"
          onClick={onClose}
        >
          Close
        </Button>

      </DialogActions>

    </Dialog>
  )
}

function RemarkDialog(props: IRemarkProps) {
  const {
    open,
    onClose,
    remark,
    dueDate,
    version,
    attachId,
    stepId,
    respAffco,
    status,
  } = props;
  const [fileAffco, setFileAffco] = useState<string | File>("");
  const [vNameFile, setVNameFile] = useState("");
  
  const [vResponse, setVResponse] = useState("");

  let iVersion = version.split("V")[1];

  const handleUploadResponse = (event) => {
    setFileAffco(event.target.files[0]);
    setVNameFile(event.target.files[0].name);
  };

  const handleSubmitResponseAffco = () => {
    if (tempResp.length > 0) {
      const index = tempResp.findIndex((val) => val.vStepId === stepId)
      const tempVal = {...tempResp[index], vRespAffco: vResponse !== "" ? vResponse : "no response from affco", vStepId: stepId, vFile: fileAffco !== "" ? fileAffco : "no file attachment", vAttachName: vNameFile !== "" ? vNameFile : "no file name"}
      const newTempResp = [...tempResp]
      newTempResp[index] = tempVal
      tempResp = newTempResp

      const newTempAffco = tempResp.map((val) => {
        return ({
          vStepId: val.vStepId,
          vAttchName: val.vAttachName,
          vAttchId: attachId,
          vRemark: val.vRespAffco,
          fAttchContent : val.vFile,
          vAttType: iVersion,
        })
      })

      respsAffco = [...newTempAffco]
      
    } else {
      const elseVal = dataCountRevise.filter((val) => val.status === "Revised" && val.stepid !== stepId).map((val) => {
        return {
          vRespAffco: "no response from affco",
    vStepId: val.stepid,
    vFile: "no file attachment",
    vAttachName:  "no file name"
        }        
      })
      const val = {
        vRespAffco: vResponse !== "" ? vResponse : "no response from affco",
        vStepId: stepId,
        vFile: fileAffco !== "" ? fileAffco : "no file attachment",
        vAttachName: vNameFile !== "" ? vNameFile : "no file name"
      }

      tempResp = [val, ...elseVal]

      respsAffco = tempResp.map((val) => {
        return ({
          vStepId: val.vStepId,
          vAttchName: val.vAttachName,
          vAttchId: attachId,
          vRemark: val.vRespAffco,
          fAttchContent : val.vFile,
          vAttType: iVersion,
        })
      })
    }    
    onClose()
    
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Remark</DialogTitle>
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
          <FormControl sx={{ m: 1 }}>
            <TextField
              size="small"
              disabled
              value={remark === null ? "empty" : remark}
              multiline
              rows={4}
              label="Remark from Consol"
            />
          </FormControl>
          <FormControl sx={{ m: 1 }}>
            <TextField
              size="small"
              disabled
              value={dueDate}
              label="Duedate Revision"
            />
          </FormControl>
          <FormControl sx={{ m: 1 }}>
            <Button
              sx={{ m: 1 }}
              size="small"
              variant="contained"
              color="inherit"
              onClick={() => {
                fetchDownloadResponse("RESPCONS", iVersion, attachId);
              }}
            >
              <Download /> Download
            </Button>
          </FormControl>
          <FormControl sx={{ m: 1 }}>
            <TextField
              disabled={
                dataRespAffco.filter(
                  (val) => val.vStepId === stepId && val.version === iVersion
                ).length === 0
                  ? false
                  : true
              }
              size="small"              
              value={
                vResponse !== "" ? vResponse : dataRespAffco.filter((val) => val.vStepId === stepId && val.version === iVersion).length !== 0 ? dataRespAffco.filter((val) => val.vStepId === stepId && val.version === iVersion)[0].vRemark : "" 
              }
              multiline
              rows={4}
              label="Response from Affco"
              onChange={(val) => {
                if (val.target.value !== "") {
                  setVResponse(val.target.value);
                } else {
                  setVResponse(val.target.value);
                }
              }}
            />
          </FormControl>
          {dataRespAffco.filter(
            (val) => val.vStepId === stepId && val.version === iVersion
          ).length === 0 ? (
            <FormControl fullWidth sx={{ margin: 1 }}>
              <FormLabel>Attach Supporting File : </FormLabel>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Upload file
                <VisuallyHiddenInput
                  type="file"
                  onChange={handleUploadResponse}
                />
              </Button>
            </FormControl>
          ) : (
            <FormControl sx={{ m: 1 }}>
              <Button
                sx={{ m: 1 }}
                size="small"
                variant="contained"
                color="inherit"
                onClick={() => {
                  fetchDownloadResponse("RESPAFFCO", iVersion, attachId);
                }}
              >
                <Download /> Download
              </Button>
            </FormControl>
          )}
          {dataRespAffco.filter(
            (val) => val.vStepId === stepId && val.version === iVersion
          ).length === 0 ? (
            <FormControl fullWidth sx={{ margin: 1 }}>
              <FormLabel>
                { vNameFile !== "" ? vNameFile : "no file selected"}
              </FormLabel>
            </FormControl>
          ) : null}
        </Box>
      </DialogContent>
      <DialogActions>
        {dataRespAffco.filter(
          (val) => val.vStepId === stepId && val.version === iVersion
        ).length === 0 ? (
          <Button
            sx={{ m: 1 }}
            size="small"
            variant="contained"
            color="primary"
            onClick={() => {
              handleSubmitResponseAffco();
            }}
          >
            {" "}
            Submit Response
          </Button>
        ) : null}

        <Button
          size="small"
          variant="contained"
          color="inherit"
          onClick={onClose}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export const columnWaiting: MRT_ColumnDef<IStepProps>[] = [
  { header: "#", Cell: ({ row }) => row.index + 1, size: 50 },
  {
    accessorKey: "filename",
    header: "File Name",
  },
  {
    accessorKey: "createDate",
    header: "Created Date",
    Cell: ({ cell }) =>
      format(new Date(cell.getValue() as string), "dd/MM/yyyy")
  },
  {
    accessorKey: "docVersion",
    header: "Version",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    header: "Response Affco",
    Cell: ({cell}) => {
      
      const [open, setOpen] = useState(false);
      if(dataRespAffcoCons.length > 0){
        return (
          <>
          <Button variant="contained"
          size="small"
          color="primary" onClick={() => { setOpen(true)}}>Response</Button>
          <ResponseDialog open={open} onClose={() => { setOpen(false)}} stepId={cell.row.original.stepid} version={cell.row.original.docVersion} attachId={cell.row.original.vAttachId}/>
          </>
          
        )
      }
      
    }
  },
  
  {
    header: "Download File",
    Cell: ({ cell }) => {
      return (
        <Button
          variant="contained"
          size="small"
          color="inherit"
          onClick={() => {
            handleClickPreview(
              cell.row.original.stepid,
              cell.row.original.docVersion,
              cell.row.original.vAttachId
            );
          }}
        >
          Download
        </Button>
      );
    },
  },
];

export const columnRevised: MRT_ColumnDef<IStepProps>[] = [
  { header: "#", Cell: ({ row }) => row.index + 1, size: 50 },
  {
    accessorKey: "filename",
    header: "File Name",
  },
  {
    accessorKey: "dDueDate",
    header: "Deadline Date",
  },
  {
    header: "Action",
    Cell: ({ cell }) => {
      return (
        <Button
          variant="contained"
          size="small"
          color="inherit"
          onClick={() => {
            handleClickPreview(
              cell.row.original.stepid,
              cell.row.original.docVersion,
              cell.row.original.vAttachId
            );
          }}
        >
          Download
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];

export const columnApproved: MRT_ColumnDef<IStepProps>[] = [
  { header: "#", Cell: ({ row }) => row.index + 1, size: 50 },
  {
    accessorKey: "filename",
    header: "File Name",
  },
  {
    accessorKey: "dApprover",
    header: "Date of Approval",   
    
  },
  {
    accessorKey: "docVersion",
    header: "Version",
  },
  {
    header: "Download",
    Cell: ({ cell }) => {
      return (
        <Button
          variant="contained"
          size="small"
          color="inherit"
          onClick={() => {
            handleClickPreview(
              cell.row.original.stepid,
              cell.row.original.docVersion,
              cell.row.original.vAttachId
            );
          }}
        >
          Download
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  }
];

export const columnHistoryUpload: MRT_ColumnDef<IStepProps>[] = [
  { header: "#", Cell: ({ row }) => row.index + 1, size: 50 },
  {
    accessorKey: "filename",
    header: "File Name",
  },
  {
    accessorKey: "createDate",
    header: "Create Date",
    Cell: ({ cell }) =>
      format(new Date(cell.getValue() as string), "dd/MM/yyyy")
  },
  {
    accessorKey: "createBy",
    header: "Created By",
  },
  {
    accessorKey: "docVersion",
    header: "Document Version",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    header: "Action",
    Cell: ({ cell }) => {
      if (cell.row.original.status !== "Draft") {
        return (
          <Button
            variant="contained"
            size="small"
            color="inherit"
            onClick={() => {
              handleClickPreview(
                cell.row.original.stepid,
                cell.row.original.docVersion,
                cell.row.original.vAttachId
              );
            }}
          >
            Download
          </Button>
        );
      }
    },
  },
  {
    header: "Remarks",
    Cell: ({ cell }) => {
      const [open, setOpen] = useState(false);

      if (cell.row.original.status === "Revised") {
        return (
          <>
            <Button
              variant="contained"
              size="small"
              color="success"
              onClick={() => {
                setOpen(true);
              }}
            >
              Remark
            </Button>
            <RemarkDialog
              open={open}
              onClose={() => {
                setOpen(false);
              }}
              remark={cell.row.original.apprRemarks}
              dueDate={cell.row.original.dDueDate}
              version={cell.row.original.docVersion}
              attachId={cell.row.original.vAttachId}
              stepId={cell.row.original.stepid}
              respAffco={cell.row.original.userRemarks}
              status={cell.row.index.toString() + cell.row.original.status}
            />
          </>
        );
      }
    },
  },
];
