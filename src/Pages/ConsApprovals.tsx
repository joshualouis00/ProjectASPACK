import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";

export default function AspackAprroval() {
  const [affco, setAffco] = React.useState("");
  const [month, setMonth] = React.useState("");
  const [year, setYear] = React.useState("");
  const [hasErrorMonth, setHasErrorMonth] = React.useState(false);
  const [hasErrorYear, setHasErrorYear] = React.useState(false);
  const [hasErrorAffco, setHasErrorAffco] = React.useState(false);
  const [status, setStatus] = React.useState(false);
  
  const handleSubmitFilter = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (month === "" && year === "" && affco === "") {
      setHasErrorMonth(true); 
      setHasErrorYear(true); 
      setHasErrorAffco(true); 
      setStatus(false); 
    } else {
      if(month === ""){
        setHasErrorMonth(true);
        setStatus(false);
      }
      if(year === ""){
        setHasErrorYear(true);
        setStatus(false);
      }
      if(affco === ""){
        setHasErrorAffco(true);
        setStatus(false);
      }
      if(month !== "" && year !== "" && affco !== "")  {
        setStatus(true);
      }  
    }
    
  };

  const handleChangeMonth = (event: SelectChangeEvent) => {
    setMonth(event.target.value as string); 
    setHasErrorMonth(false); 
  };

  const handleChangeYear = (event: SelectChangeEvent) => {
    setYear(event.target.value as string);
    setHasErrorYear(false);
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "left",
    color: theme.palette.text.secondary,
  }));

  const handleChangeAffco = (event: SelectChangeEvent) => {
    setAffco(event.target.value as string);
    setHasErrorAffco(false);
  };
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
      }}
    >
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Filter Periode
        </AccordionSummary>
        <Divider />
        <AccordionDetails>
          <Box component="form" onSubmit={handleSubmitFilter}>
            <Stack direction={"row"}>
              <Item elevation={0}>
                <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
                  <InputLabel id="month">Select Periode Month</InputLabel>
                  <Select                  
                    labelId="month"
                    name="vMonth"
                    value={month}
                    label="Select Periode Month"
                    onChange={handleChangeMonth}
                    error={hasErrorMonth}
                  >
                    <MenuItem value="januari">Januari</MenuItem>
                    <MenuItem value="februari">Februari</MenuItem>
                    <MenuItem value="maret">Maret</MenuItem>
                    <MenuItem value="april">April</MenuItem>
                  </Select>
                  {hasErrorMonth && <FormHelperText sx={{ color: "red"}}>This is required!</FormHelperText>}
                </FormControl>
              </Item>
              <Item elevation={0}>
                <FormControl sx={{ m: 1, minWidth: 200 }} size="small" >
                  <InputLabel id="year">Select Periode Year</InputLabel>
                  <Select
                    labelId="year"
                    name="vYear"
                    value={year}
                    label="year"
                    onChange={handleChangeYear}
                    error={hasErrorYear}
                  >
                    <MenuItem value="2024">2024</MenuItem>
                    <MenuItem value="2023">2023</MenuItem>
                  </Select>
                  { hasErrorYear && <FormHelperText sx={{ color: "red"}}>This is required!</FormHelperText>}
                </FormControl>
              </Item>
              <Item elevation={0}>
                <FormControl sx={{ m: 1, minWidth: 200 }} size="small" >
                  <InputLabel id="affco">Select Affiliate Company</InputLabel>
                  <Select
                    labelId="affco"
                    name="vAffco"
                    value={affco}
                    label="affo"
                    onChange={handleChangeAffco} 
                    error={hasErrorAffco}

                  >
                    <MenuItem value="com a">Company a</MenuItem>
                    <MenuItem value="com b">Company b</MenuItem>
                  </Select>
                  { hasErrorAffco && <FormHelperText sx={{ color: "red"}}>This is required!</FormHelperText>}
                </FormControl>
              </Item>
              <Item elevation={0}>
                <Button type="submit" variant="contained" sx={{ m: 1 }}>
                  Filter
                </Button>
              </Item>
            </Stack>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Aspack Status
        </AccordionSummary>
        <Divider />
        <AccordionDetails>
          {status === true ? <h1>ada isi</h1> : <h1>Belum ada isi</h1>}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
