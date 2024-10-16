import * as React from "react";
import Paper from "@mui/material/Paper";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  TextField,
  Tabs,
  Tab,
} from "@mui/material";
import useHandleUnauthorized from "../Component/handleUnauthorized";
import { format, parse } from "date-fns";
import tblHst_UploadAffco from "../Component/Interface/Hst_UploadAffco";
import { apiUrl, getToken } from "../Component/TemplateUrl";

const HistoryUploadAffco: React.FC = () => {
  const [rows, setRows] = React.useState<tblHst_UploadAffco[]>([]);
  const [columns, setColumns] = React.useState<
    MRT_ColumnDef<tblHst_UploadAffco>[]
  >([]);
  const [month, setMonth] = React.useState<string>("");
  const [year, setYear] = React.useState<string>("");
  const [affcoId, setAffcoId] = React.useState<string>("");
  const [stepId, setStepId] = React.useState<string>("");
  const [dialogData, setDialogData] = React.useState<tblHst_UploadAffco[]>([]);
  const [revisionHistoryData, setRevisionHistoryData] = React.useState<
    tblHst_UploadAffco[]
  >([]);
  const [selectedRows, setSelectedRows] =
    React.useState<tblHst_UploadAffco | null>(null);
  const [viewHistoryOpen, setViewHistoryOpen] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState(0);
  const handleError401 = useHandleUnauthorized();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "December (Audited)",
  ];

  React.useEffect(() => {
    //Main Table
    const fetchDataMain = async () => {
      try {
        const bulan = monthNames.indexOf(month) + 1;
        const resp = await axios.get(
          apiUrl + `api/Package/GetReport?nYear=${year}&nMonth=${bulan}`,
          {
            headers: {
              Authorization: `Bearer ` + getToken,
            },
          }
        );
        const reportData = resp.data.data;

        const extractedAffcoId = reportData[0]?.vAffcoId;
        const extractedStepId = reportData[0]?.packageReportDetails[0]?.vStepId;

        setAffcoId(extractedAffcoId);
        setStepId(extractedStepId);

        //Generate dynamic columns for steps:
        const stepCol = reportData[0]?.packageReportDetails.map(
          (detail: { vStepId: string; vStepDesc: string }, index: number) => ({
            accessorKey: detail.vStepId, // Menggunakan vStepId sebagai accessorKey
            header: detail.vStepDesc,
            size: 150,
            Cell: ({ row, cell }) => (
              <Button
                variant="outlined"
                sx={{ border: "none", color: "black" }}
                size="small"
                onClick={() => handleRowDoubleKlik(row.original, cell)}
              >
                {cell.getValue()}
              </Button>
            ),
          })
        );

        // Set initial Columns :
        const initialColumns: MRT_ColumnDef<tblHst_UploadAffco>[] = [
          {
            header: "#",
            size: 50,
            Cell: ({ row }) => row.index + 1,
            // Sticky to the left (fixed column)
            muiTableHeadCellProps: {
              sx: {
                position: "sticky",
                left: 0,
                zIndex: 2, // Set zIndex to ensure it's above other columns
                backgroundColor: "white", // Give it a background color
              },
            },
            muiTableBodyCellProps: {
              sx: {
                position: "sticky",
                left: 0,
                zIndex: 1,
                backgroundColor: "white",
              },
            },
          },
          {
            accessorKey: "vAffcoName",
            header: "Affco",
            size: 150,
            // Sticky to the left (fixed column)
            muiTableHeadCellProps: {
              sx: {
                position: "sticky",
                left: 50, // Shift it after the # column
                zIndex: 2, // Make sure it's above other columns
                backgroundColor: "white",
              },
            },
            muiTableBodyCellProps: {
              sx: {
                position: "sticky",
                left: 50,
                zIndex: 1,
                backgroundColor: "white",
              },
            },
          },
          {
            accessorKey: "iMonth",
            header: "Periode",
            size: 150,
          },
          {
            accessorKey: "iYear",
            header: "Tahun",
            size: 100,
          },
          ...stepCol, // Add dynamic step columns
        ];

        setColumns(initialColumns);

        const MainRows = resp.data.data.map((item: any) => {
          const stepData = item.packageReportDetails.reduce(
            (acc: any, detail: any) => {
              acc[detail.vStepId] = detail.vStepStatus;
              return acc;
            },
            {}
          );

          return {
            vAffcoId: item.vAffcoId,
            vAffcoName: item.vAffcoName,
            iMonth: monthNames[parseInt(item.iMonth) - 1], // Ubah angka bulan kembali ke nama bulan
            iYear: item.iYear,
            vAffcoCategory: item.vAffcoCategory,
            ...stepData, // Menambahkan data step ke dalam row
          };
        });

        setRows(MainRows);
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          handleError401();
        } else {
          console.error("Error Get Step :", error);
        }
      }
    };

    if (month && year) {
      fetchDataMain();
    }
  }, [month, year]);

  React.useEffect(() => {
    const fetchDialogData = async () => {
      if (affcoId && stepId && month && year) {
        const bulan = monthNames.indexOf(month) + 1;
        try {
          const response = await axios.get(
            apiUrl +
              `api/Package/GetReportFileHistory?nYear=${year}&nMonth=${bulan}&vAffcoId=${affcoId}&vStepId=${stepId}`,
            {
              headers: {
                Authorization: `Bearer ` + getToken,
              },
            }
          );
          setDialogData(response.data.data);
        } catch (error: any) {
          if (error.response && error.response.status === 401) {
            handleError401();
          } else {
            console.error("Error Dialog Data :", error);
          }
        }
      }
    };

    const fetchRevisionHistoryData = async () => {
      const bulan = monthNames.indexOf(month) + 1;
      if (affcoId && stepId && month && year) {
        try {
          const response = await axios.get(
            apiUrl +
              `api/Package/GetActivity?nYear=${year}&nMonth=${bulan}&vAffcoId=${affcoId}&vStepId=${stepId}`,
            {
              headers: {
                Authorization: `Bearer ` + getToken,
              },
            }
          );
          setRevisionHistoryData(response.data.data);
        } catch (error: any) {
          if (error.response && error.response.status === 401) {
            handleError401();
          } else {
            console.error("Error Revision History Data :", error);
          }
        }
      }
    };

    // Panggil kedua fetch
    fetchDialogData();
    fetchRevisionHistoryData();
  }, [affcoId, stepId, month, year]);

  const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedMonth = event.target.value;
    const monthIndex = monthNames.filter((x) => x === selectedMonth); // Menjadikan 1-based index

    setMonth(monthIndex.toString()); // Simpan sebagai string angka
    console.log("SetMonth : ", monthIndex.toString());
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setYear(event.target.value);
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
  };

  const handleRowDoubleKlik = async (row: tblHst_UploadAffco, cell: any) => {
    // Ambil Affco ID, Step ID, Tahun, dan Bulan dari baris dan cell yang diklik
    const selectedAffcoId = row.vAffcoId;
    const selectedStepId = cell.column.id; // Menggunakan ID kolom sebagai Step ID
    const selectedYear = row.iYear;
    const selectedMonth = row.iMonth;

    // Lakukan sesuatu dengan nilai-nilai tersebut, seperti membuka dialog atau melakukan panggilan API
    setAffcoId(selectedAffcoId);
    setStepId(selectedStepId);
    setYear(selectedYear);
    setMonth(selectedMonth);

    // Tampilkan dialog atau lakukan aksi lain
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setViewHistoryOpen(false);
    setSelectedRows(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleResetClick = () => {
    setMonth("");
    setYear("");
    setRows([]);
  };

  const dialogColumns: MRT_ColumnDef<any>[] = [
    { header: "#", size: 50, Cell: ({ row }) => row.index + 1 },
    { accessorKey: "vFileName", header: "File Name", size: 100 },
    { accessorKey: "iVersion", header: "Version", size: 100 },
    { accessorKey: "vCrea", header: "Created By", size: 100 },
    {
      accessorKey: "dCrea",
      header: "Submitted Date",
      size: 100,
    },
    { accessorKey: "vStatus", header: "Status", size: 150 },
    { accessorKey: "vRemarks", header: "Remarks", size: 150 },
  ];

  //Bagian Download Responses File :
  const downloadFile = async (row: any, index: number) => {
    try {
      const response = await axios.get(
        apiUrl +
          `api/Package/GetActivity?nYear=${row.iYear}&nMonth=${row.iMonth}&vAffcoId=${row.vAffcoId}&vStepId=${row.vStepId}`,
        {
          headers: {
            Authorization: `Bearer ` + getToken,
          },
        }
      );

      const responseFiles = response.data.data[0].responseFiles; // Ambil semua responseFiles

      if (responseFiles.length > 0) { 
        const fileData = responseFiles[0]; // Ambil file berdasarkan index

        const type = row.responseFiles[0].vAttType;
        const attachId = fileData.vAttchId;
        
        fetchDownloadResponse(type, index.toString(), attachId); 

      } else {
        alert("File tidak ditemukan, silakan periksa data yang Anda masukkan.");
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        handleError401();
      } else {
        console.error("Error Revision History Data :", error);
      }
    }
  };

  const fetchDownloadResponse = (
    types: string,
    version: string,
    attachId: string
  ) => {
    console.log(
      "APInya : ",
      apiUrl +
        `api/Package/DownloadResponseAttachment?types=${types}&iVersion=${version}&vAttachId=${attachId}`
    );
    window.open(
      apiUrl +
        `api/Package/DownloadResponseAttachment?types=${types}&iVersion=${version}&vAttachId=${attachId}`
    );
  };

  //Revision History Table :
  const revisionHistoryColumns: MRT_ColumnDef<any>[] = [
    { header: "#", size: 50, Cell: ({ row }) => row.index + 1 },
    { accessorKey: "vAction", header: "Status", size: 150 },
    {
      accessorKey: "vRemarks",
      header: "Remarks",
      size: 150,
      Cell: ({ row }) => {
        const type = row.original.responseFiles[0]?.vAttType;
        if (type === "RESPCONS") {
          const remarks = row.original.responseFiles[0]?.vRemarks || " ";
          return <span>{remarks}</span>;
        }
      },
    },
    {
      accessorKey: "responseFiles",
      header: "Responses",
      size: 150,
      Cell: ({ row }) => {
        const type = row.original.responseFiles[0]?.vAttType;
        if (type === "RESPAFFCO") {
          const remarks = row.original.responseFiles[0]?.vRemarks || " ";
          return <span>{remarks}</span>;
        }
      },
    },
    {
      accessorKey: "vResponsesFile",
      header: "Responses File",
      size: 150,
      Cell: ({ row }) => {
        const status = row.original.responseFiles[0]; // Ambil nilai Status dari baris
        return (
          <>
            {status !== undefined ? ( // Cek apakah Status adalah "Revised"
              <Button
                onClick={() => downloadFile(row.original, row.original.responseFiles[0].iVersion)}
                variant="outlined"
                color="info"
                size="small"
              >
                Download
              </Button>
            ) : null}
          </>
        );
      },
    },
    { accessorKey: "vUserId", header: "Approval", size: 150 },
    {
      accessorKey: "dDateTime",
      header: "Approval Date",
      size: 150,
      Cell: ({ cell }) =>
        format(new Date(cell.getValue() as string), "dd/MM/yyyy HH:mm"),
    },
  ];

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
      <Box sx={{ display: "flex", alignItems: "flex-end", marginBottom: 2 }}>
        <FormControl sx={{ minWidth: 120, marginRight: 2, marginLeft: 2 }}>
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
            {monthNames.map((month, index) => (
              <MenuItem key={index + 1} value={month}>
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
        enableStickyHeader
        initialState={{
          pagination: { pageIndex: 0, pageSize: 10 },
        }}
        enableSorting
        muiTableHeadProps={{
          sx: {
            position: "sticky",
            top: 0,
            zIndex: 3, // Ensure the header is above the rest of the table content
            backgroundColor: "white",
          },
        }}
      />

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Detail Data</DialogTitle>
        <DialogContent>
          <Tabs value={selectedTab} onChange={handleTabChange}>
            <Tab label="Detail Data" />
            <Tab label="Revision History" />
          </Tabs>

          <Box>
            {selectedTab === 0 && dialogData && dialogData.length > 0 && (
              <MaterialReactTable
                columns={dialogColumns}
                data={dialogData}
                enableStickyHeader
                initialState={{
                  pagination: { pageIndex: 0, pageSize: 5 },
                }}
                enableSorting
              />
            )}
            {selectedTab === 0 && (!dialogData || dialogData.length === 0) && (
              <p>No data available for Detail Data.</p> // Pesan jika tidak ada data
            )}

            {selectedTab === 1 &&
              revisionHistoryData &&
              revisionHistoryData.length > 0 && (
                <MaterialReactTable
                  columns={revisionHistoryColumns}
                  data={revisionHistoryData}
                  enableStickyHeader
                  initialState={{
                    pagination: { pageIndex: 0, pageSize: 5 },
                  }}
                  enableSorting
                />
              )}
            {selectedTab === 1 &&
              (!revisionHistoryData || revisionHistoryData.length === 0) && (
                <p>No data available for Revision History.</p> // Pesan jika tidak ada data
              )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default HistoryUploadAffco;
