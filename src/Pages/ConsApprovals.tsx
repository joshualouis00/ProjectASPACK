import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
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
  Step,
  StepIconProps,
  StepLabel,
  Stepper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import IDataAffco from "../Component/Interface/DataAffco";
import IDataTemplate from "../Component/Interface/DataTemplate";
import { apiUrl, getToken } from "../Component/TemplateUrl";
import { CustomTabs, a11yProps } from "../Component/CustomTab";
import { IHeaderProps, IStepProps } from "../Component/Interface/DataUpload";
import { MaterialReactTable } from "material-react-table";
import {
  columnApproved,
  columnRevised,
  columnWaiting,
} from "../Component/TableComponent/ColumnDef/IColumnUpload";

export default function AspackAprroval() {
  const dataMonth = new Date().getMonth();
  const dataYear = new Date().getFullYear();
  const [affco, setAffco] = React.useState<IDataAffco[]>([]);
  const [vAffco, setVAffco] = React.useState<IDataAffco | null>();
  const [template, setTemplate] = React.useState<IDataTemplate[]>([]);
  const [month, setMonth] = React.useState((dataMonth + 1).toString());
  const [year, setYear] = React.useState(dataYear.toString());
  const [hasErrorMonth, setHasErrorMonth] = React.useState(false);
  const [hasErrorYear, setHasErrorYear] = React.useState(false);
  const [hasErrorAffco, setHasErrorAffco] = React.useState(false);
  const [status, setStatus] = React.useState(false);
  const [tab, setTab] = React.useState(0);
  const [dataAffco, setDataAffco] = React.useState<IStepProps[]>([]);
  const [dataHeader, setDataHeader] = React.useState<IHeaderProps>();  

  React.useEffect(() => {
    fetch(apiUrl + "api/Master/getAffco", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken}`,
      },
    }).then((resp) => {
      resp.json().then((valData) => {
        setAffco(
          valData.map((val, index) => {
            return {
              no: index + 1,
              id: val.vAffcoId,
              name: val.vAffcoName,
              category: val.vAffcoCtgry,
              status: val.bActive === true ? "Active" : "Nonactive",
            };
          })
        );
      });
    });

    fetch(apiUrl + "api/WorkflowStep/getStep", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken}`,
      },
    }).then((resp) => {
      resp.json().then((valData) => {
        const data = valData.data;
        setTemplate(
          data.map((val, index) => {
            return {
              id: val.vStepId,
              name: val.vStepDesc,
              category: val.vAffcoCtgry,
              filetype: val.vAttType,
              status: val.bActive,
            };
          })
        );
      });
    });

    fetch(
      apiUrl +
        `api/Package/getPackage?nYear=${year}&nMonth=${month}&vAffcoId=${vAffco?.id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken}`,
        },
      }
    ).then((resp) => {
      resp.json().then((valData) => {
        setDataHeader({
          vPackageId: valData.header.vPackageId,
          iMonth: valData.header.iMonth,
          iYear: valData.header.iYear,
          iStatus: valData.header.iStatus,
          vAffcoId: valData.header.vAffcoId,
        });

        valData.header.vPackageId !== ""
          ? setDataAffco(
              valData.detail.map((dtl) => {
                return {
                  filename:
                    dtl.fPackageFile.length > 0
                      ? dtl.fPackageFile[0].vAttchName
                      : "",
                  createDate:
                    dtl.fPackageFile.length > 0
                      ? dtl.fPackageFile[0].dCrea
                      : "",
                  createBy:
                    dtl.fPackageFile.length > 0
                      ? dtl.fPackageFile[0].vCrea
                      : "",
                  docVersion:
                    dtl.fPackageFile.length > 0
                      ? "V" + dtl.fPackageFile.length
                      : "",
                  status:
                    dtl.vStatus === "S"
                      ? "Submitted"
                      : dtl.vStatus === "A"
                      ? "Approved"
                      : dtl.vStatus === "R"
                      ? "Revised"
                      : "",
                  stepid: dtl.vStepId,
                  dApprover: dtl.dApprover,
                  dDueDate: dtl.dDueDate,
                  apprRemarks: dtl.vApprRemarks,
                  userRemarks: dtl.vUsrRemarks,
                  vTempCode: dtl.vTemporalCode,
                };
              })
            )
          : setDataAffco([]);
      });
    });
  }, [month, year, vAffco]);

  const handleSubmitFilter = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (year !== "" && vAffco !== undefined) {
      setStatus(true);
    } else {
      if (year === "") {
        setHasErrorYear(true);
        setStatus(false);
      }
      if (vAffco === undefined) {
        setHasErrorAffco(true);
        setStatus(false);
      } else {
        console.log("masuk ", vAffco);
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

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
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
                    <MenuItem value="1">Januari</MenuItem>
                    <MenuItem value="2">Februari</MenuItem>
                    <MenuItem value="3">Maret</MenuItem>
                    <MenuItem value="4">April</MenuItem>
                    <MenuItem value="5">Mei</MenuItem>
                    <MenuItem value="6">Juni</MenuItem>
                    <MenuItem value="7">Juli</MenuItem>
                    <MenuItem value="8">Agustus</MenuItem>
                    <MenuItem value="9">September</MenuItem>
                    <MenuItem value="10">Oktober</MenuItem>
                    <MenuItem value="11">November</MenuItem>
                    <MenuItem value="12">Desember</MenuItem>
                  </Select>
                  {hasErrorMonth && (
                    <FormHelperText sx={{ color: "red" }}>
                      This is required!
                    </FormHelperText>
                  )}
                </FormControl>
              </Item>
              <Item elevation={0}>
                <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
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
                  {hasErrorYear && (
                    <FormHelperText sx={{ color: "red" }}>
                      This is required!
                    </FormHelperText>
                  )}
                </FormControl>
              </Item>
              <Item elevation={0}>
                <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
                  <Autocomplete
                    id="vAffco-autocomplete"
                    size="small"
                    isOptionEqualToValue={(option, value) => true}
                    value={vAffco}
                    onChange={(event, newValue) => {
                      console.log("change : ", newValue);
                      setHasErrorAffco(false);
                      setVAffco(newValue);
                    }}
                    disablePortal
                    options={affco}
                    getOptionLabel={(option) => option.name}
                    renderOption={(props, option) => {
                      const { key, ...optionProps } = props;
                      return (
                        <Box key={key} component="li" {...optionProps}>
                          {option.name}
                        </Box>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Affiliate Company"
                        error={hasErrorAffco === true ? true : false}
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: "new-password", // disable autocomplete and autofill
                        }}
                      />
                    )}
                  />
                  {hasErrorAffco && (
                    <FormHelperText sx={{ color: "red" }}>
                      This is required!
                    </FormHelperText>
                  )}
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
          <Stack direction={"column"}>
            <Item elevation={0}>
              {status === true ? (
                <Box sx={{ width: "100%" }}>
                  <Stepper alternativeLabel activeStep={-1} sx={ { "& .MuiStepper-alternativeLabel" : {color: "blue"}}}>
                    {template
                      .filter(
                        (val) =>
                          val.category === vAffco?.category ||
                          val.category === "All"
                      )
                      .map((value, index) => {
                        const iconProps: {
                          active?: boolean;
                          completed?: boolean;
                        } = {}
                        const labelProps: {
                          optional?: React.ReactNode;
                        } = {};
                        if (dataAffco.length > 0) {
                          if (dataAffco[index].status === "Submitted") {
                            iconProps.active = true
                            labelProps.optional = (
                              <Typography variant="caption" color="blue">
                                Waiting for Approval
                              </Typography>
                            );
                          } else {
                            if (dataAffco[index].status === "Revised") {
                              iconProps.completed = true
                              labelProps.optional = (
                                <Typography variant="caption" color="red">
                                  Revised
                                </Typography>
                              );
                            } else if (dataAffco[index].status === "Approved") {
                              iconProps.completed = true
                              labelProps.optional = (
                                <Typography variant="caption" color="green">
                                  Approved
                                </Typography>
                              );
                            } else {
                              iconProps.active = true
                              labelProps.optional = (
                                <Typography variant="caption" color="blue">
                                  Waiting for Approval
                                </Typography>
                              );
                            }
                          }
                        }
                        return (
                          <Step key={value.name} {...iconProps} sx={ dataAffco.length > 0 ? dataAffco[index].status === "Approved" ? { "& .Mui-completed" : {color: "green"}} : { "& .Mui-completed" : {color: "red"}} : null}>
                            <StepLabel {...labelProps}>{value.name}</StepLabel>
                          </Step>
                        );
                      })}
                  </Stepper>
                  <Divider sx={{ marginTop: 3, marginBottom: 5 }} />
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs value={tab} onChange={handleChangeTab}>
                      <Tab label="Waiting for Approval" {...a11yProps(0)} />
                      <Tab label="Revised" {...a11yProps(1)} />
                      <Tab label="Approved" {...a11yProps(2)} />
                    </Tabs>
                  </Box>
                  <CustomTabs value={tab} index={0}>
                    <Box>
                      <MaterialReactTable
                        columns={columnWaiting}
                        data={dataAffco}
                        enableRowSelection
                        enableRowActions
                        renderBottomToolbarCustomActions={({ table }) => {
                          return (
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              <Button
                                color="primary"
                                disabled={
                                  table.getSelectedRowModel().flatRows
                                    .length === 0
                                }
                                variant="contained"
                              >
                                Download
                              </Button>
                              <Button color="success" variant="contained">
                                Submit Approval
                              </Button>
                            </div>
                          );
                        }}
                        renderRowActions={({ row }) => (
                          <Stack direction={"row"}>
                            <Button
                              variant="contained"
                              color="warning"
                              onClick={() => {                                
                                const index = row.index;
                                const updateData = {
                                  ...dataAffco[index],
                                  status: "Revised",
                                };
                                const newDataAffco = [...dataAffco];
                                newDataAffco[index] = updateData;
                                setDataAffco(newDataAffco);
                              }}
                            >
                              Revised
                            </Button>
                            <Button variant="contained" color="success"  onClick={() => {                                
                                const index = row.index;
                                const updateData = {
                                  ...dataAffco[index],
                                  status: "Approved",
                                };
                                const newDataAffco = [...dataAffco];
                                newDataAffco[index] = updateData;
                                setDataAffco(newDataAffco);
                              }}>
                              Approved
                            </Button>
                          </Stack>
                        )}
                        positionActionsColumn="last"
                      />
                    </Box>
                  </CustomTabs>
                  <CustomTabs value={tab} index={1}>
                    <Box>
                      <MaterialReactTable
                        columns={columnRevised}
                        data={dataAffco}
                        enableRowSelection
                      />
                    </Box>
                  </CustomTabs>
                  <CustomTabs value={tab} index={2}>
                    <Box>
                      <MaterialReactTable
                        columns={columnApproved}
                        data={dataAffco}
                        enableRowSelection
                        renderBottomToolbarCustomActions={({ table }) => {
                          return (
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              <Button
                                color="primary"
                                disabled={
                                  table.getSelectedRowModel().flatRows
                                    .length === 0
                                }
                                variant="contained"
                              >
                                Download
                              </Button>
                            </div>
                          );
                        }}
                      />
                    </Box>
                  </CustomTabs>
                </Box>
              ) : (
                <h1>Belum ada isi</h1>
              )}
            </Item>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
