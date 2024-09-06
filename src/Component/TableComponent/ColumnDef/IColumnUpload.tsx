import { MRT_ColumnDef } from "material-react-table";
import {  IStepProps } from "../../Interface/DataUpload";
import { Button } from "@mui/material";

export const columnWaiting: MRT_ColumnDef<(IStepProps)>[] = [
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
    }
];

export const columnRevised: MRT_ColumnDef<(IStepProps)>[] = [
    {
        accessorKey: "filename",
        header: "File Name"
    },
    {
        accessorKey: "dDueDate",
        header: "Deadline Date"
    },
    {
        header: "Action"
    },
    {
        accessorKey: "status",
        header: "Status"
    }
];

export const columnApproved: MRT_ColumnDef<(IStepProps)>[] = [
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
        header: "Action"
    },
    {
        accessorKey: "status",
        header: "Status"
    }
];

export const columnHistoryUpload: MRT_ColumnDef<(IStepProps)>[] = [
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
            return (
                <Button variant="contained" size="small" color="inherit">Preview</Button>
            )
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