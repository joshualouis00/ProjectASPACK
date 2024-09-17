import { type MRT_RowData, type MRT_TableOptions } from 'material-react-table';

export const getDefaultMRTOptions = <TData extends MRT_RowData>(): Partial<
  MRT_TableOptions<TData>
> => ({
  
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
  
  defaultColumn: {
    
  },
});