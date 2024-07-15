// FilterPeriod.js
import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Collapse,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { FilterPeriodProps } from "./ColumnDef/IFilterPeriod";

const FilterPeriod: React.FC<FilterPeriodProps> = ({
  openFilter,
  handleToggleFilter,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  selectedCompany,
  setSelectedCompany,
  handleFilter,
}) => {
  return (
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
                label="Bulan"
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
                label="Tahun"
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
              <InputLabel>Company</InputLabel>
              <Select
                value={selectedCompany}
                label="Company"
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
  );
};

export default FilterPeriod;
