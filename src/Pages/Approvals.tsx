import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  IconButton,
  Collapse,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Step,
  StepButton,
  Stepper,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  TablePagination,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

// Definisi rows
function createData(
  id: number,
  filename: string,
  createdDate: string,
  version: string,
  status: string
) {
  return { id, filename, createdDate, version, status };
}

const approveSteps = ["Waiting Approval", "Approved"];

const steps = [
  "Aspack ",
  "Aspack ",
  "Aspack ",
  "Aspack ",
  "Aspack ",
  "Aspack ",
  "Aspack ",
  "Aspack ",
  "Aspack ",
  "Aspack ",
];

//Data Waiting for Approval
const rows = [
  createData(1, "asbasbdba.xls", "01/02/2001", "V0", ""),
  createData(2, "asbasbdba.xls", "01/02/2002", "V1", ""),
  createData(3, "asbasbdba.xls", "01/02/2003", "V2", ""),
  createData(4, "asbasbdba.xls", "01/02/2004", "V3", ""),
  createData(5, "asbasbdba.xls", "01/02/2005", "V4", ""),
];

//Data Hold On
const rowsHold = [
  createData(1, "aaaaaaaaaaaaa.xls", "01/02/2001", "", "To be Revised"),
  createData(2, "bbbbbbbbbbbbb.xls", "01/02/2002", "", "To be Revised"),
];

//Data Approved
const rowsApproved = [
  createData(1, "cccccccccccc.xls", "01/02/2001", "V1", "Approved"),
  createData(2, "dddddddddddd.xls", "01/02/2002", "V2", "Approved"),
];

const UploadedAspackPage = () => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const [filteredRows, setFilteredRows] = useState(rows);

  const [openStatus, setOpenStatus] = useState(false);

  //Approval
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<{ [k: number]: boolean }>(
    {}
  );
  const [approvalStatus, setApprovalStatus] = useState("");

  const [openReviseDialog, setOpenReviseDialog] = useState(false);
  const [remarks, setRemarks] = useState("");

  // State untuk mengatur tab yang aktif
  const [tabValue, setTabValue] = useState<number>(0);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  interface TabPanelProps {
    children?: React.ReactNode;
    value: number;
    index: number;
  }

  const TabPanel = ({ children, value, index }: TabPanelProps) => {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
      >
        {value === index && <Box sx={{ mt: 1 }}>{children}</Box>}
      </div>
    );
  };

  // Stepper
  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const totalSteps = () => {
    return steps.length;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleApprove = () => {
    setApprovalStatus(approveSteps[0]); // Set to "Waiting Approval"
    setTimeout(() => {
      setApprovalStatus(approveSteps[1]); // Set to "Approved" after 2 seconds
    }, 2000);
    handleNext();
  };

  const handleApproveAll = () => {
    // Logic for approving all items
    handleComplete();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const handleToggleStatus = () => {
    setOpenStatus(!openStatus);
  };

  const handleToggleFilter = () => {
    setOpenFilter(!openFilter);
  };

  const handleFilter = () => {
    // Logika untuk memfilter data berdasarkan selectedMonth, selectedYear, selectedCompany
    //const filteredData = rows.filter((row) => {
    // Misalnya, memfilter berdasarkan tahun dan perusahaan
    // const yearMatch = selectedYear
    //   ? row.createdDate.includes(selectedYear)
    //   : true;
    //const companyMatch = selectedCompany ? row.company === selectedCompany : true;
    // return yearMatch;
    // });
    // setFilteredRows(filteredData);
  };

  const handleCheckAll = () => {
    // Logika untuk memilih semua file
  };

  const handleDownloadAll = () => {
    // Logika untuk mendownload semua file yang dipilih
  };

  const handleRevise = () => {
    setOpenReviseDialog(true);
  };
  const handleReviseConfirm = () => {
    // Logic to handle revise action with remarks and due date
    setOpenReviseDialog(false);
  };

  const handleReviseCancel = () => {
    setOpenReviseDialog(false);
  };

  //Sticky header & nomor halaman
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Container
      maxWidth="xl"
      sx={{ pl: "2px !important", pr: "2px !important" }}
    >
      <Box ml={"10px"} mb={2} mt={2}>
        <Typography
          variant="h6"
          onClick={handleToggleFilter}
          style={{ cursor: "pointer" }}
        >
          Filter Periode{" "}
          <IconButton>
            {openFilter ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </IconButton>
        </Typography>
        <Collapse in={openFilter}>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Bulan</InputLabel>
                <Select
                  value={selectedMonth}
                  autoComplete="bulan"
                  autoFocus
                  fullWidth
                  onChange={(e) => setSelectedMonth(e.target.value as string)}
                >
                  <MenuItem value="jan">Januari</MenuItem>
                  <MenuItem value="feb">Februari</MenuItem>
                  {/* Tambahkan lebih banyak bulan */}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Tahun</InputLabel>
                <Select
                  value={selectedYear}
                  autoComplete="tahun"
                  autoFocus
                  fullWidth
                  onChange={(e) => setSelectedYear(e.target.value as string)}
                >
                  <MenuItem value="2022">2022</MenuItem>
                  <MenuItem value="2023">2023</MenuItem>
                  {/* Tambahkan lebih banyak tahun */}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Affiliate Company</InputLabel>
                <Select
                  value={selectedCompany}
                  autoComplete="company"
                  autoFocus
                  fullWidth
                  onChange={(e) => setSelectedCompany(e.target.value as string)}
                >
                  <MenuItem value="company1">Company 1</MenuItem>
                  <MenuItem value="company2">Company 2</MenuItem>
                  {/* Tambahkan lebih banyak perusahaan */}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleFilter}>
                Filter
              </Button>
            </Grid>
          </Grid>
        </Collapse>
      </Box>
      <Box ml={"5px"} mb={2} mt={2}>
        <Typography
          variant="h6"
          onClick={handleToggleStatus}
          style={{ cursor: "pointer" }}
        >
          Aspack Status{" "}
          <IconButton>
            {openStatus ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </IconButton>
        </Typography>

        {/* Add progress approval components */}
        <Collapse in={openStatus}>
          <Box sx={{ width: "100%", mt: "1px" }}>
            <Stepper nonLinear activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label} completed={completed[index]}>
                  <StepButton color="inherit" onClick={handleStep(index)}>
                    {label} {index + 1}{" "}
                    {index === activeStep && approvalStatus
                      ? approvalStatus
                      : ""}
                  </StepButton>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Collapse>
      </Box>
      <Box ml={"10px"} mt={1} alignContent={"center"} alignItems={"left"}>
        <Paper>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="tabs example"
          >
            <Tab label="Waiting For Approval" />
            <Tab label="Hold On" />
            <Tab label="Approved" />
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <TableContainer component={Paper}>
              <Table
                stickyHeader
                sx={{ minWidth: 650 }}
                aria-label="caption table"
              >
                <caption>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <TablePagination
                      rowsPerPageOptions={[10, 25, 100]}
                      component="div"
                      count={rows.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleApproveAll}
                      sx={{ marginRight: "0.5%" }}
                    >
                      Submit All Approval
                    </Button>
                  </Box>
                </caption>
                <TableHead>
                  <TableRow>
                    <TableCell align="left" sx={{ width: "0.4%" }}>
                      #
                    </TableCell>
                    <TableCell align="left" sx={{ width: "3%" }}>
                      Filename
                    </TableCell>
                    <TableCell align="left" sx={{ width: "1.5%" }}>
                      Created Date
                    </TableCell>
                    <TableCell align="left" sx={{ width: "0.5%" }}>
                      Version
                    </TableCell>
                    <TableCell align="left" sx={{ width: "1.5%" }}>
                      Action
                    </TableCell>
                    <TableCell align="left" sx={{ width: "1.5%" }}>
                      Download
                    </TableCell>
                    <TableCell align="left" sx={{ width: "2%" }}>
                      Validation
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow key={row.id}>
                        <TableCell component="th" scope="row">
                          {row.id}
                        </TableCell>
                        <TableCell align="left">{row.filename}</TableCell>
                        <TableCell align="left">{row.createdDate}</TableCell>
                        <TableCell align="left">{row.version}</TableCell>
                        <TableCell align="left">
                          <Button variant="outlined">Preview</Button>
                        </TableCell>
                        <TableCell align="left">
                          <Checkbox></Checkbox>
                        </TableCell>
                        <TableCell align="left">
                          <>
                            <Button
                              variant="outlined"
                              onClick={() => handleRevise()}
                              sx={{ mr: "3px" }}
                            >
                              Revise
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() => handleApprove()}
                            >
                              Approve
                            </Button>
                          </>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <TableContainer component={Paper}>
              <Table stickyHeader sx={{ minWidth: 650 }} aria-label="caption table">
                {/* Tabel untuk tab "Hold On" */}
                <caption>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <TablePagination
                      rowsPerPageOptions={[10, 25, 100]}
                      component="div"
                      count={rowsHold.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </Box>
                </caption>
                <TableHead>
                  <TableRow>
                    <TableCell align="left" sx={{ width: "0.4%" }}>
                      #
                    </TableCell>
                    <TableCell align="left" sx={{ width: "3%" }}>
                      Filename
                    </TableCell>
                    <TableCell align="left" sx={{ width: "1.5%" }}>
                      Deadline Date
                    </TableCell>
                    <TableCell align="left" sx={{ width: "1.5%" }}>
                      Action
                    </TableCell>
                    <TableCell align="left" sx={{ width: "1.5%" }}>
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rowsHold
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell align="left" sx={{ width: "0.4%" }}>
                        {row.filename}
                      </TableCell>
                      <TableCell align="left" sx={{ width: "0.4%" }}>
                        {row.createdDate}
                      </TableCell>
                      <TableCell align="left" sx={{ width: "0.4%" }}>
                        <Button variant="outlined">Preview</Button>
                      </TableCell>
                      <TableCell align="left" sx={{ width: "0.4%" }}>
                        {row.status}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <TableContainer component={Paper}>
              <Table stickyHeader sx={{ minWidth: 650 }} aria-label="caption table">
                {/* Tabel untuk tab "Approved" */}
                <caption>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <TablePagination
                      rowsPerPageOptions={[10, 25, 100]}
                      component="div"
                      count={rowsApproved.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </Box>
                </caption>
                <TableHead>
                  <TableRow>
                    <TableCell align="left" sx={{ width: "0.4%" }}>
                      #
                    </TableCell>
                    <TableCell align="left" sx={{ width: "3%" }}>
                      Filename
                    </TableCell>
                    <TableCell align="left" sx={{ width: "1.5%" }}>
                      Date of Approval
                    </TableCell>
                    <TableCell align="left" sx={{ width: "0.5%" }}>
                      Version
                    </TableCell>
                    <TableCell align="left" sx={{ width: "1.5%" }}>
                      Action
                    </TableCell>
                    <TableCell align="left" sx={{ width: "1.5%" }}>
                      Status
                    </TableCell>
                    <TableCell align="left" sx={{ width: "2%" }}>
                      Download
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rowsApproved
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell align="left">{row.filename}</TableCell>
                      <TableCell align="left">{row.createdDate}</TableCell>
                      <TableCell align="left">{row.version}</TableCell>
                      <TableCell align="left">
                        <Button variant="outlined">Preview</Button>
                      </TableCell>
                      <TableCell align="left">{row.status}</TableCell>
                      <TableCell align="left">
                        <>
                          <Checkbox></Checkbox>
                        </>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </Paper>
      </Box>
      <Box ml={"10px"}>
        <Box textAlign="right" p={1}>
          <Button
            variant="contained"
            onClick={handleCheckAll}
            sx={{ mr: "5px" }}
          >
            Check All Files
          </Button>
          <Button variant="contained" onClick={handleDownloadAll}>
            Download selected files
          </Button>
        </Box>
      </Box>

      <Dialog open={openReviseDialog} onClose={handleReviseCancel}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>What needs to be revised from this document?</Typography>
          <TextField
            autoFocus
            margin="dense"
            type="text"
            fullWidth
            variant="outlined"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
          <Typography>Due Date</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReviseCancel}>Cancel</Button>
          <Button onClick={handleReviseConfirm} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UploadedAspackPage;
