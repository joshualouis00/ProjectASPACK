import { MRT_ColumnDef } from "material-react-table";
import {   IRemarkProps, IStepProps } from "../../Interface/DataUpload";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, TextField } from "@mui/material";
import { apiUrl, getToken } from "../../TemplateUrl";
import { useState } from "react";
import { Download } from "@mui/icons-material";

const handleClickPreview = (stepid: string, version: string, vAttachId: string) => {
    fetch(apiUrl + `api/Package/DownloadPackage?vStepId=${stepid}&iVersion=${version.split("V")[1]}&vAttachId=${vAttachId}`, {
        method: 'GET',
        headers: {
            Authorization: `bearer ${getToken}`
        }
    } ).then((resp) => {
        if(resp.status === 200){
            resp.blob().then((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "File Attachment " + stepid;
                a.click();
              });

        } else {
            if(resp.status === 404){
                return alert("File not found, please contact your IT Administrator.")
            } else {
                return alert("Something wrong, please contact your IT Administrator.")
            }
        }
    })
}

const fetchDownloadResponse = (types: string, version: string, attachId: string) => {
    fetch(apiUrl + `api/Package/DownloadResponseAttachment?types=${types}&iVersion=${version}&vAttachId=${attachId}`,{
        method: 'GET',
        headers: {
            Authorization: `bearer ${getToken}`
        }
    }).then((resp) => {
        if(resp.status === 200){
            resp.blob().then((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "File Attachment " + attachId;
                a.click();
              });

        } else {
            if(resp.status === 404){
                return alert("File not found, please contact your IT Administrator.")
            } else {
                return alert("Something wrong, please contact your IT Administrator.")
            }
        }
    })
}

function RemarkDialog(props: IRemarkProps){
    const {open, onClose, remark, dueDate, version, attachId} = props

    let iVersion = version.split("V")[1]
    return(
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
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "left" }}>
                    <FormControl sx={{ m:1}} >
                        <TextField size="small" disabled value={remark === null ? "empty" : remark} multiline rows={4} label="Remark from Consol"/>
                    </FormControl>
                    <FormControl sx={{ m:1}} >
                        <TextField size="small" disabled value={dueDate} label="Duedate Revision"/>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button sx={{ m:1}} size="small" variant="contained" color="inherit" onClick={() => { fetchDownloadResponse("RESPCONS", iVersion, attachId)}}><Download /> Download</Button>
            </DialogActions>
        </Dialog>
    )
}

export const columnWaiting: MRT_ColumnDef<(IStepProps)>[] = [
    { header: "#", 
        Cell: ({ row }) => row.index + 1 ,
        size: 50
      },
    {
        accessorKey: "filename",
        header: "File Name"

    },
    {
        accessorKey: "createDate",
        header: "Created Date"
    },
    {
        accessorKey: "docVersion",
        header: "Version"
    },
    {
        accessorKey: "status",
        header: "Status",        
    },
    {
        header: "Download File",
        Cell: ({cell}) => {
            return (<Button variant="contained" size="small" color="inherit" onClick={() => {handleClickPreview(cell.row.original.stepid, cell.row.original.docVersion, cell.row.original.vAttachId)}}>Download</Button>)
        }
    }
];

export const columnRevised: MRT_ColumnDef<(IStepProps)>[] = [
    { header: "#", 
        Cell: ({ row }) => row.index + 1 ,
        size: 50
      },
    {
        accessorKey: "filename",
        header: "File Name"
    },
    {
        accessorKey: "dDueDate",
        header: "Deadline Date"
    },
    {
        header: "Action",
        Cell: ({cell}) => {
            return (<Button variant="contained" size="small" color="inherit" onClick={() => {handleClickPreview(cell.row.original.stepid, cell.row.original.docVersion, cell.row.original.vAttachId)}}>Download</Button>)
        }
    },
    {
        accessorKey: "status",
        header: "Status"
    }
];

export const columnApproved: MRT_ColumnDef<(IStepProps)>[] = [
    { header: "#", 
        Cell: ({ row }) => row.index + 1 ,
        size: 50
      },
    {
        accessorKey: "filename",
        header: "File Name"
    },
    {
        accessorKey: "dApprover",
        header: "Date of Approval"
    },
    {
        accessorKey: "docVersion",
        header: "Version"
    },
    {
        header: "Action",
        Cell: ({cell}) => {
            return (<Button variant="contained" size="small" color="inherit" onClick={() => {handleClickPreview(cell.row.original.stepid, cell.row.original.docVersion, cell.row.original.vAttachId)}}>Download</Button>)
        }
    },
    {
        accessorKey: "status",
        header: "Status"
    }
];

export const columnHistoryUpload: MRT_ColumnDef<(IStepProps)>[] = [
    { header: "#", 
        Cell: ({ row }) => row.index + 1 ,
        size: 50,        
      },
    {
        accessorKey: "filename",
        header: "File Name"
    },
    {
        accessorKey: "createDate",
        header: "Create Date",        
    },
    {
        accessorKey: "createBy",
        header: "Created By",
    },
    {
        accessorKey: "docVersion",
        header: "Document Version"
    },
    {
        accessorKey: "status",
        header: "Status",       
        
    },
    {
        header: "Action",
        Cell: ({cell}) => {
            if(cell.row.original.status !== "Draft"){
                return (
                    <Button variant="contained" size="small" color="inherit" onClick={() => {handleClickPreview(cell.row.original.stepid, cell.row.original.docVersion, cell.row.original.vAttachId)}}>Download</Button>
                )
            }
            
        }
    },
    {
        header: "Remarks",
        Cell: ({cell}) => {
            const [open, setOpen] = useState(false)

            if(cell.row.original.status === "Revised"){
                return (
                    <>
                    <Button variant="contained" size="small" color="success" onClick={() => {setOpen(true)}}>Remark</Button>
                    <RemarkDialog open={open} onClose={() => { setOpen(false)}} remark={cell.row.original.apprRemarks} dueDate={cell.row.original.dDueDate} version={cell.row.original.docVersion} attachId={cell.row.original.vAttachId}/>
                    </>
                    
                
                )
            }
            
        }
    }
]