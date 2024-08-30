import { MRT_ColumnDef } from "material-react-table";
import IDataUser from "../../Interface/DataUser";
import IDataAffco from "../../Interface/DataAffco";

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