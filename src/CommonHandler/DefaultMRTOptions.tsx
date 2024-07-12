import { type MRT_RowData, type MRT_TableOptions } from 'material-react-table';

//define re-useable default table options for all tables in your app
export const getDefaultMRTOptions = <TData extends MRT_RowData>(): Partial<
  MRT_TableOptions<TData>
> => ({
  //list all of your default table options here
  enableGlobalFilter: false,
  enableRowPinning: false,
  initialState: { showColumnFilters: false },
  manualFiltering: false,
  manualPagination: false,
  manualSorting: false,
  muiTableHeadCellProps: {
    sx: { fontSize: '0.9rem' },
  },
  paginationDisplayMode: 'pages',
  //etc...
  defaultColumn: {
    //you can even list default column options here
  },
});