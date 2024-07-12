import {
  type MRT_ColumnDef, // <--- import MRT_ColumnDef
} from "material-react-table";

import { TUploadTemplate } from "../../../GlobalTypes/TUploadTemplate";

export const TemplateUploadColumns: MRT_ColumnDef<TUploadTemplate>[] = [
  {
    accessorKey: "illineNo", 
    header: "#",
    enableSorting: false, 
  },
  {
    accessorKey: 'fileName', 
    header: 'Filename',
    enableSorting: false, 
  },
  {
    accessorKey: 'createdDate', 
    header: 'Create Date',
    enableSorting: false, 
  },
  {
    accessorKey: 'status', 
    header: 'Status',
    enableSorting: false, 
  },
  {
    accessorKey: 'action', 
    header: 'Action',
    enableSorting: false, 
  }
];

