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
import {
  apiUrl,
  generateMonths,
  generateYears,
  getToken,
} from "../Component/TemplateUrl";
import { Alert, Stack } from "@mui/material";

const OpenPeriod: React.FC = () => {
  const [open, setOpen] = React.useState(true);
  const dataMonth = new Date().getMonth();
  const dataYear = new Date().getFullYear();
  const [month, setMonth] = React.useState((dataMonth + 1).toString());
  const [year, setYear] = React.useState(dataYear.toString());
  const [hasErrorMonth, setHasErrorMonth] = React.useState(false);
  const [hasErrorYear, setHasErrorYear] = React.useState(false);
  const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = React.useState<Dayjs | null>(dayjs());
  const [dateError, setDateError] = React.useState("");
  const navigate = useNavigate();
  const handle401 = useHandleUnauthorized();

  React.useEffect(() => {
    axios
      .get(apiUrl + "api/Setting/GetOpenPeriod", {
        headers: {
          Authorization: `Bearer ` + getToken,
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

  React.useEffect(() => {
    if (dateError) {
      const timer = setTimeout(() => {
        setDateError(""); // Clear the error after 5 seconds
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [dateError]);

  const handleChangeMonth = (event) => {
    setMonth(event.target.value);
    setHasErrorMonth(false);
  };

  const handleChangeYear = (event) => {
    setYear(event.target.value as string);
    setHasErrorYear(false);
  };

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
    setDateError("");
  };

  const handleSubmit = () => {

    if (startDate && endDate && startDate.isAfter(endDate)) {
      setDateError("Start Date cannot be later than End Date.")
      return;
    } else {
      setDateError("");
    }

    const data = {
      iYear: year,
      iMonth: month,
      dStartDate: startDate ? startDate.format("YYYY-MM-DD") : null,
      dEndDate: endDate ? endDate.format("YYYY-MM-DD") : null,
    };

    axios
      .post(apiUrl + "api/Setting/EditOpenPeriod", data, {
        headers: {
          Authorization: `Bearer ` + getToken,
        },
      })
      .then((response) => {
        handleClose();
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          handle401();
        } else {
          console.error("Error submitting data:", error);
        }
      });
  };

  return (
    <>
      <WelcomePage />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Open Period Settings</DialogTitle>
        <DialogContent>
        {dateError && (
          <Stack>
            <Alert severity="error">{dateError}</Alert>
          </Stack>
          )}
          <TextField
            select
            margin="dense"
            id="year"
            label="Year"
            fullWidth
            variant="standard"
            value={year}
            error={hasErrorYear}
            onChange={handleChangeYear}
            required
          >
            {generateYears().map((val, index) => {
              return (
                <MenuItem key={index} value={val}>
                  {val}
                </MenuItem>
              );
            })}
          </TextField>
          <TextField
            select
            margin="dense"
            id="month"
            label="Month"
            fullWidth
            variant="standard"
            value={month}
            error={hasErrorMonth}
            onChange={handleChangeMonth}
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
            {generateMonths.map((val) => {
              return (
                <MenuItem key={val.id} value={val.id}>
                  {val.name}
                </MenuItem>
              );
            })}
          </TextField>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
              format="DD/MM/YYYY"
              sx={{ mt: "10px", mb: "10px" }}
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
