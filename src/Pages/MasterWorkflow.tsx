import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import TableSortLabel from "@mui/material/TableSortLabel";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { visuallyHidden } from "@mui/utils";

interface Column {
  id: "no" | "name" | "category" | "action";
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "no", label: "Step No", minWidth: 170 },
  { id: "name", label: "Step Description", minWidth: 100 },
  { id: "category", label: "Category", minWidth: 170 },
  { id: "action", label: "Action", minWidth: 170, align: "right" },
];

interface Data {
  no: string;
  name: string;
  category: string;
}

function createData(no: string, name: string, category: string): Data {
  return { no, name, category };
}

const initialRows = [
  createData("1", "Example Step 1", "ASSO"),
  createData("2", "Example Step 2", "ASSO"),
  createData("3", "Example Step 3", "SUBS"),
  createData("4", "Example Step 4", "All"),
  createData("5", "Example Step 5", "SUBS"),
  createData("6", "Example Step 6", "ASSO"),
  createData("7", "Example Step 7", "ASSO"),
  createData("8", "Example Step 8", "SUBS"),
  createData("9", "Example Step 9", "All"),
  createData("10", "Example Step 10", "SUBS"),
];

type Order = "asc" | "desc";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T): number {
  const firstValue = a[orderBy];
  const secondValue = b[orderBy];

  if (typeof firstValue === 'string' && typeof secondValue === 'string') {
    // Jika nilainya adalah string, misalnya '1', '10', ubah ke angka untuk membandingkan
    const numA = parseFloat(firstValue);
    const numB = parseFloat(secondValue);

    if (!isNaN(numA) && !isNaN(numB)) {
      if (numB < numA) {
        return -1;
      }
      if (numB > numA) {
        return 1;
      }
      return 0;
    }
  }

  // Fallback ke pengurutan string biasa jika tidak bisa diubah ke angka
  if (secondValue < firstValue) {
    return -1;
  }
  if (secondValue > firstValue) {
    return 1;
  }
  return 0;
}


function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default function MstWorkflow() {
  const [rows, setRows] = React.useState<Data[]>(initialRows);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [stepDescription, setStepDescription] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [fileType, setFileType] = React.useState("");
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("no");

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddStep = () => {
    setRows([
      ...rows,
      createData((rows.length + 1).toString(), stepDescription, category),
    ]);
    handleClose();
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedRows = stableSort(rows, getComparator(order, orderBy));

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
        sx={{ mb: "5px", ml: "10px" }}
      >
        Add Step
      </Button>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Typography sx={{ m: "10px" }} variant="h5" color="#808080">
          Steps Table
        </Typography>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.id !== "action" ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : "asc"}
                      onClick={(event) =>
                        handleRequestSort(event, column.id as keyof Data)
                      }
                    >
                      {column.label}
                      {orderBy === column.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.no}>
                  {columns.map((column) => {
                    const value = row[column.id as keyof Data];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.id === "action" ? (
                          <Button variant="contained" color="primary">
                            Update
                          </Button>
                        ) : column.format && typeof value === "number" ? (
                          column.format(value)
                        ) : (
                          value
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Step</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Masukkan detail step baru di bawah ini.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="stepDescription"
            label="Step Description"
            type="text"
            fullWidth
            variant="standard"
            value={stepDescription}
            onChange={(e) => setStepDescription(e.target.value)}
            required
          />
          <TextField
            select
            margin="dense"
            id="category"
            label="Category"
            fullWidth
            variant="standard"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="ASSO">ASSO</MenuItem>
            <MenuItem value="SUBS">SUBS</MenuItem>
          </TextField>
          <TextField
            select
            margin="dense"
            id="fileType"
            label="File Type"
            fullWidth
            variant="standard"
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            required
          >
            <MenuItem value="Excel">Excel</MenuItem>
            <MenuItem value="Email">PDF</MenuItem>
            <MenuItem value="Text">Both</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddStep}>Add Step</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
