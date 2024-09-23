import { MRT_ColumnDef } from "material-react-table";
import {  IStepProps } from "../../Interface/DataUpload";
import { Button } from "@mui/material";
import { apiUrl, getToken } from "../../TemplateUrl";

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
        size: 50
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
        header: "Status"
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

            if(cell.row.original.status === "Revised"){
                return (
                    <Button variant="contained" size="small" color="success">{cell.row.original.filename}</Button>
                
                )
            }
            
        }
    }
]