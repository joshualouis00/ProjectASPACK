import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import WelcomePage from "./Welcome";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useHandleUnauthorized from "../Component/handleUnauthorized";
import dayjs, { Dayjs } from "dayjs";

const OpenPeriod: React.FC = () => {
  const [open, setOpen] = React.useState(true);
  const [year, setYear] = React.useState<string>("");
  const [month, setMonth] = React.useState<string>("");
  const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
  const [endDate, setEndDate] = React.useState<Dayjs | null>(null);
  const navigate = useNavigate();
  const handle401 = useHandleUnauthorized();

  React.useEffect(() => {
    axios
      .get("http://192.168.1.207:9020/api/Setting/GetOpenPeriod", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const { iYear, iMonth, dStartDate, dEndDate } = response.data.data;
        setYear(iYear);
        setMonth(iMonth);
        setStartDate(dayjs(dStartDate));
        setEndDate(dayjs(dEndDate));
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          handle401();
        } else {
          console.error("Error Get Step:", error);
        }
      });
  }, []);

  const handleClose = () => {
    setOpen(false);
    resetDialogFields();
    navigate("/welcome");
  };

  const resetDialogFields = () => {
    setYear("");
    setMonth("");
    setStartDate(null);
    setEndDate(null);
  };

  const handleSubmit = () => {
    const data = {
      iYear: year,
      iMonth: month,
      dStartDate: startDate ? startDate.format("YYYY-MM-DD") : null,
      dEndDate: endDate ? endDate.format("YYYY-MM-DD") : null,
    };

    axios.post("http://192.168.1.207:9020/api/Setting/EditOpenPeriod",data,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((response) => {
      console.log("ok gaes...", response.data.data);
      handleClose();
    }).catch((error) => {
      if (error.response && error.response.status === 401) {
        handle401();
      } else {
        console.error("Error submitting data:", error);
      }
    });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, index) =>
    (currentYear + index).toString()
  );

  const months = [
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
  ];

  return (
    <>
      <WelcomePage />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Open Period Settings</DialogTitle>
        <DialogContent>
          <TextField
            select
            margin="dense"
            id="year"
            label="Year"
            fullWidth
            variant="standard"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          >
            {years.map((yr) => (
              <MenuItem key={yr} value={yr}>
                {yr}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            margin="dense"
            id="month"
            label="Month"
            fullWidth
            variant="standard"
            value={month}
            onChange={(e) => setMonth(e.target.value.toString())}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  style: {
                    maxHeight: 200, // Atur tinggi maksimum dropdown
                  },
                },
              },
            }}
            required
          >
            {months.map((mnth, index) => (
              <MenuItem key={index} value={index + 1}>
                {mnth}
              </MenuItem>
            ))}
          </TextField>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
              format="DD/MM/YYYY"
              sx={{mt:"10px", mb: "10px"}}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              format="DD/MM/YYYY"
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OpenPeriod;
