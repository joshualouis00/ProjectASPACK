import { MRT_ColumnDef } from "material-react-table";
import IDataUser from "../../Interface/DataUser";
import IDataAffco from "../../Interface/DataAffco";
import { ICategory, IConsNewsProps } from "../../Interface/DataTemplate";
import { Button } from "@mui/material";
import { apiUrl, getToken } from "../../TemplateUrl";

const handleSendEmail = (data: string) => {
  const vAttachId = btoa(data)
  fetch(apiUrl + `api/Consolidate/SendMailConsolidation?vAttachId=${vAttachId}`,{
    method: 'POST',
    headers: {
      Authorization: `bearer ${getToken}`
    }
  }).then((resp) => {
    resp.json().then((val) => {
      if(val.success
      ){
        alert(val.message)
        window.location.reload()
      } else {
        alert(val.message)
      }
    })

  })
}

export const columnMasterUser: MRT_ColumnDef<IDataUser>[] = [
  { header: "#", 
    Cell: ({ row }) => row.index + 1 ,
    size: 50
  },
    {
        accessorKey: "id",
        header: "ID",
        size: 50
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "role",
        header: "Role",
        size: 50
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 50
      }
]

export const columnMasterAffco: MRT_ColumnDef<IDataAffco>[] = [
  { header: "#", 
    Cell: ({ row }) => row.index + 1 ,
    size: 50
  },
      {
        accessorKey: "id",
        header: "ID",
        size: 50
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "category",
        header: "Category",
        size: 50
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 50
      }
]

export const columnConsNews: MRT_ColumnDef<IConsNewsProps>[] = [
  { header: "#", 
    Cell: ({ row }) => row.index + 1 ,
    size: 50
  },
  {
    accessorKey: "vTitle",
    header: "Title",
    size: 100
  },
  {
    accessorKey: "vSubTitle",
    header: "Sub Title"
  },
  {
    accessorKey: "vDescription",
    header: "Description"
  },
  {
    accessorKey: "category",
    header: "Category"
  },
  {
    accessorKey: "bActive",
    header: "Status",
    Cell: ({ row }) => row.original.bActive ? "Active" : "Non Active"
  },
  {
    header: "Send Email",
    Cell: ({ row }) => {
      return (
        <Button variant="contained" color="error" onClick={() => { handleSendEmail(row.original.uUid)}}>Send</Button>
      )
    }
  },
  {

    header: "Last Send",
    Cell: ({ row }) => row.original.dLastSend !== null ? row.original.dLastSend.replaceAll('-','/') : "not yet"

  }
]

export const columnCategory: MRT_ColumnDef<ICategory>[] = [
  {
    header: "#", 
    Cell: ({ row }) => row.index + 1 ,
    size: 50
  },
  {
    accessorKey: "vCode",
    header: "Code"
  },
  {
    accessorKey: "vValue1",
    header: "Description"
  },
  {
    accessorKey: "bActive",
    header: "Status",
    Cell: ({ row }) => row.original.bActive ? "Active" : "Non Active"
  }
]