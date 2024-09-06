import { MRT_ColumnDef } from "material-react-table";
import IDataUser from "../../Interface/DataUser";
import IDataAffco from "../../Interface/DataAffco";
import { IConsNewsProps } from "../../Interface/DataTemplate";

export const columnMasterUser: MRT_ColumnDef<IDataUser>[] = [
    {
        accessorKey: "id",
        header: "ID",
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
      },
      {
        accessorKey: "status",
        header: "Status",
      }
]

export const columnMasterAffco: MRT_ColumnDef<IDataAffco>[] = [
    {
        accessorKey: "no",
        header: "No",
      },
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "name",
        header: "Affco Name",
      },
      {
        accessorKey: "category",
        header: "Affco Category",
      },
      {
        accessorKey: "status",
        header: "Affco Status",
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
    accessorKey: "vConsolidateCategory",
    header: "Category"
  },
  {
    accessorKey: "bActive",
    header: "Status",
    Cell: ({ row }) => row.original.bActive ? "Active" : "Non Active"
  }
]