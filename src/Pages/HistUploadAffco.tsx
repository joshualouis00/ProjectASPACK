import * as React from "react";
import Paper from "@mui/material/Paper";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useNavigate } from "react-router-dom";
import { Box, Button, FormControl, MenuItem, TextField } from "@mui/material";

interface StepData {
  vStepId: string;
  vStepDesc: string;
}

interface TableData {
  affco: string;
  periode: string;
  tahun: string;
  [key: string]: any;
}

const HistoryUploadAffco: React.FC = () => {
  const [rows, setRows] = React.useState<TableData[]>([]);
  const [columns, setColumns] = React.useState<MRT_ColumnDef<TableData>[]>([]);
  const [month, setMonth] = React.useState<string>("");
  const [year, setYear] = React.useState<string>("");
  const [selectedRows, setSelectedRows] = React.useState<TableData | null>(
    null
  );
  const [viewHistoryOpen, setViewHistoryOpen] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  console.log("Tokennya : ", token);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get(
          "http://192.168.1.207:9020/api/WorkflowStep/getStep"
        );
        const stepData = resp.data.data;
        
        console.log("Data: ", JSON.stringify(resp.data.data, null, 2));

        //Generate dynamic columns for steps:
        const stepCol = stepData.map((step: StepData, index: number) => ({
          accessorKey: `step${index + 1}`,
          header: step.vStepDesc,
          size: 150,
        }));

        // Set initial Columns :
        const initialColumns: MRT_ColumnDef<TableData>[] = [
          {
            header: "#",
            size: 50,
            Cell: ({ row }) => row.index + 1,
          },
          {
            accessorKey: "affco",
            header: "Affco",
            size: 100,
          },
          {
            accessorKey: "periode",
            header: "Periode",
            size: 100,
          },
          {
            accessorKey: "tahun",
            header: "Tahun",
            size: 100,
          },
          ...stepCol, // Add dynamic step columns
        ];

        setColumns(initialColumns);

        // Dummy rows with empty step data
        const dummyRows: TableData[] = Array(10)
          .fill(null)
          .map((_, rowIndex) => ({
            affco: `Affco ${rowIndex + 1}`,
            periode: `Periode ${rowIndex + 1}`,
            tahun: `Tahun ${rowIndex + 1}`,
            ...stepData.reduce((acc: any, step: StepData, index: number) => {
              acc[`step${index + 1}`] = ""; // Initialize with empty string or actual data
              return acc;
            }, {}),
          }));

        setRows(dummyRows);
      } catch (error) {
        console.error("Errornya: ", error);
      }
    };

    fetchData();
  }, [month, year]);

  const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMonth(event.target.value);
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setYear(event.target.value);
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => (currentYear - i).toString());
  };

  const handleRowDoubleKlik = (row: TableData) => {
    setSelectedRows(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setViewHistoryOpen(false);
    setSelectedRows(null);
  };

  const handleViewHistoryClick = () => {
    setViewHistoryOpen(true);
  };

  const handleBackClick = () => {
    setViewHistoryOpen(false);
  };

  const handleResetClick = () => {
    setMonth("");
    setYear("");
  };

  //Kolom saat di double klik nich :
  const dialogColumns: MRT_ColumnDef<any>[] = [
    { accessorKey: "noDocument", header: "No Document", size: 150 },
    { accessorKey: "namaFile", header: "Nama File", size: 150 },
    { accessorKey: "createdDate", header: "Created Date", size: 150 },
    { accessorKey: "createdBy", header: "Created By", size: 150 },
    {
      header: "Actions",
      size: 150,
      Cell: () => (
        <Button
          variant="contained"
          color="primary"
          onClick={handleViewHistoryClick}
        >
          View History
        </Button>
      ),
    },
  ];

  // Dummy Datanya :
  const dialogData = selectedRows
    ? [
        {
          noDocument: "Doc1",
          namaFile: "File1",
          createdDate: "2024-07-30",
          createdBy: "User1",
        },
        {
          noDocument: "Doc2",
          namaFile: "File2",
          createdDate: "2024-07-29",
          createdBy: "User2",
        },
      ]
    : [];

  //Revision History Table :
  const revisionHistoryColumns: MRT_ColumnDef<any>[] = [
    { accessorKey: "status", header: "Status", size: 150 },
    { accessorKey: "remarks", header: "Remarks", size: 150 },
    { accessorKey: "modifiedBy", header: "Modified By", size: 150 },
    { accessorKey: "modifiedDate", header: "Modified Date", size: 150 },
  ];

  const revisionHistoryData = [
    {
      status: "Approved",
      remarks: "ok approve ya..",
      modifiedBy: "User1",
      modifiedDate: "2024-07-30",
    },
    {
      status: "Revised",
      remarks: "Document revised",
      modifiedBy: "User2",
      modifiedDate: "2024-07-29",
    },
    {
      status: "Revised",
      remarks: "Document revised",
      modifiedBy: "User1",
      modifiedDate: "2024-07-28",
    },
    {
      status: "Submitted",
      remarks: "",
      modifiedBy: "User3",
      modifiedDate: "2024-07-28",
    },
  ];

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
      <Box sx={{ display: "flex", alignItems: "flex-end", marginBottom: 2 }}>
        <FormControl sx={{ minWidth: 120, marginRight: 2, marginLeft: 2}}>
          <TextField
            select
            margin="dense"
            id="month"
            label="Month"
            value={month}
            onChange={handleMonthChange}
            fullWidth
            variant="standard"
          >
            {[
              "Januari",
              "Februari",
              "Maret",
              "April",
              "Mei",
              "Juni",
              "Juli",
              "Agustus",
              "September",
              "Oktober",
              "November",
              "Desember",
            ].map((month, index) => (
              <MenuItem key={index} value={month}>
                {month}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
        <FormControl sx={{ minWidth: 120, marginRight: 2 }}>
          <TextField
            select
            margin="dense"
            id="year"
            label="Year"
            value={year}
            onChange={handleYearChange}
            fullWidth
            variant="standard"
          >
            {generateYears().map((year, index) => (
              <MenuItem key={index} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
        <Button
          variant="outlined"
          color="error"
          onClick={handleResetClick}
          sx={{ height: "30px" }}
        >
          Reset
        </Button>
      </Box>

      <MaterialReactTable
        columns={columns}
        data={rows}
        initialState={{
          pagination: { pageIndex: 0, pageSize: 10 },
        }}
        enableSorting
        muiTableBodyRowProps={({ row }) => ({
          onDoubleClick: () => handleRowDoubleKlik(row.original),
        })}
      />

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>
          {viewHistoryOpen ? "Revision History" : "Detail Data"}
        </DialogTitle>
        <DialogContent>
          {viewHistoryOpen ? (
            <MaterialReactTable
              columns={revisionHistoryColumns}
              data={revisionHistoryData}
              initialState={{
                pagination: { pageIndex: 0, pageSize: 5 },
              }}
              enableSorting
            />
          ) : (
            <MaterialReactTable
              columns={dialogColumns}
              data={dialogData}
              initialState={{
                pagination: { pageIndex: 0, pageSize: 5 },
              }}
              enableSorting
            />
          )}
        </DialogContent>
        <DialogActions>
          {viewHistoryOpen ? (
            <Button onClick={handleBackClick} color="info">
              Back
            </Button>
          ) : (
            <Button onClick={handleClose} color="error">
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default HistoryUploadAffco;
