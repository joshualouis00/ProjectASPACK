import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import WelcomePage from "./Welcome";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate } from "react-router-dom";

const OpenPeriod: React.FC = () => {
  const [open, setOpen] = React.useState(true);
  const [category, setCategory] = React.useState("");
  const [fileType, setFileType] = React.useState("");
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
    resetDialogFields();
    navigate("/welcome");
  };

  const resetDialogFields = () => {
    setCategory("");
    setFileType("");
  };

  return (
    <>
      <WelcomePage />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Open Period Settings</DialogTitle>
        <DialogContent>
          <TextField
            select
            margin="dense"
            id="tahun"
            label="Year"
            fullWidth
            variant="standard"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <MenuItem>2024</MenuItem>
            <MenuItem>2023</MenuItem>
            <MenuItem>2022</MenuItem>
          </TextField>
          <TextField
            select
            margin="dense"
            id="bulan"
            label="Month"
            fullWidth
            variant="standard"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <MenuItem>Jan</MenuItem>
            <MenuItem>Feb</MenuItem>
            <MenuItem>Mar</MenuItem>
          </TextField>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DateTimePicker"]}>
              <DatePicker label="Start Date" />
            </DemoContainer>
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DateTimePicker"]}>
              <DatePicker label="End Date" />
            </DemoContainer>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OpenPeriod;
