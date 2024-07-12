// GlideAppTable.tsx
import React from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { TUploadTemplate } from '../../GlobalTypes/TUploadTemplate';
import { getDefaultMRTOptions } from '../../CommonHandler/DefaultMRTOptions';

const defaultMRTOptions = getDefaultMRTOptions<TUploadTemplate>();

export const AppTable = () => {
  const columns: MRT_ColumnDef<TUploadTemplate>[] = [
      {
        accessorKey: "no",
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

  const [data, setData] = React.useState<TUploadTemplate[]>([]);
  React.useEffect( () => {
    document.title = "Dashboard";
    setData([{
      no:"1",
      fileName: "SampleFile.xlsx",
      createdDate: "10-Jun-2024",
      status: "Active",
      action: "",
    },
  ]);
  },[]);

  const table = useMaterialReactTable({
    ...defaultMRTOptions, //spread your default options
    columns,
    data,
    enableGlobalFilter: true, //override default options
    initialState: {
      ...defaultMRTOptions.initialState, //spread default initial state
      showColumnFilters: false, //override default initial state for just this table
    },
    //...
  });

  //you will have access to the entire table instance where you need it
  console.log(table.getState());

  return <MaterialReactTable table={table}/>;

};

export default AppTable;
