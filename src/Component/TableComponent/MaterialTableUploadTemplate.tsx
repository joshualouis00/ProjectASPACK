import React, { ChangeEvent, useState, useEffect } from "react";
import {
  Container,
  Box,
  Paper,
  TableContainer,
  Table,
  TablePagination,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
} from "@mui/material";

interface TUploadTemplate {
  no: string;
  fileName: string;
  createdDate: string;
  status: string;
  action: string;
}

export const AppTable = () => {
  // Pagging
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState<TUploadTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.title = "Dashboard";
    setData([
      {
        no: "1",
        fileName: "SampleFile.xlsx",
        createdDate: "10/06/2024",
        status: "Active",
        action: "",
      },
      {
        no: "2",
        fileName: "AnotherFile.docx",
        createdDate: "11/06/2024",
        status: "Inactive",
        action: "",
      },
      // Tambahkan data lainnya di sini
    ]);
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Handle search input change
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
    console.log("Search Query:", event.target.value);
  };

  // Filter data based on search query
  const filteredData = data.filter((row) =>
    row.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.createdDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log("Filtered Data:", filteredData);

  return (
    <Container
      maxWidth="xl"
      sx={{ pl: "2px !important", pr: "2px !important" }}
    >
      <Box mt={5} alignContent={"center"} alignItems={"left"}>
        <Paper>
          <Box display="flex" justifyContent="flex-end" p={2}>
            <TextField
              label="Search"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </Box>
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
                    count={filteredData.length}
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
                    Created Date
                  </TableCell>
                  <TableCell align="left" sx={{ width: "0.5%" }}>
                    Status
                  </TableCell>
                  <TableCell align="left" sx={{ width: "1.5%" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.no}>
                      <TableCell component="th" scope="row">
                        {row.no}
                      </TableCell>
                      <TableCell align="left">{row.fileName}</TableCell>
                      <TableCell align="left">{row.createdDate}</TableCell>
                      <TableCell align="left">{row.status}</TableCell>
                      <TableCell align="left">
                        <Button variant="contained" value="" sx={{ backgroundColor: "#808080", color: "white"}}>
                          Preview
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <Button variant="contained" color="info" sx={{ color: "white", m: "10px"}}>Submit</Button>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
};

export default AppTable;
