import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Step,
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
import {
  apiUrl,
  CustomSnackBar,
  generateMonths,
  generateYears,
  getToken,
  getUserId,
} from "../Component/TemplateUrl";
import { CustomTabs, a11yProps } from "../Component/CustomTab";
import {
  IDialogProps,
  IHeaderProps,
  IRespFile,
  IStepProps,
} from "../Component/Interface/DataUpload";
import { MaterialReactTable } from "material-react-table";
import {
  columnApproved,
  columnRevised,
  columnWaiting,
} from "../Component/TableComponent/ColumnDef/IColumnUpload";
import dayjs, { Dayjs } from "dayjs";
import {
  LocalizationProvider,
  MobileDateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import useHandleUnauthorized from "../Component/handleUnauthorized";
import { useLocation, useNavigate } from "react-router-dom";
import { AssignmentReturn, AssignmentTurnedIn } from "@mui/icons-material";

export let dataRespAffcoCons: IRespFile[] = [];

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
  const [dataHeader, setDataHeader] = React.useState<IHeaderProps>({
    iMonth: "",
    iYear: "",
    iStatus: "",
    vAffcoId: "",
    vPackageId: "",
  });
  const [open, setOpen] = React.useState(false);
  const [openApprove, setOpenApprove] = React.useState(false);
  const [index, setIndex] = React.useState<number>(0);
  const [indexApprove, setIndexApprove] = React.useState<number>(0);
  const [dataResponse, setDataResponse] = React.useState<IRespFile[]>([]);
  const [filterCategory, setFilterCategory] = React.useState("");
  const [pMonth, setPMonth] = React.useState("");
  const [pYear, setPYear] = React.useState("");
  const [pSdate, setPSdate] = React.useState<Dayjs>(dayjs());
  const [pEdate, setPEdate] = React.useState<Dayjs>(dayjs());
  const [isOpenPeriod, setIsOpenPeriod] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [openSnack, setOpenSnack] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const navigate = useHandleUnauthorized();
  const handleNavigate = useNavigate();

  const location = useLocation();
  const parameter = new URLSearchParams(location.search);

  const [urlAffcoId, setUrlAffcoId] = React.useState("");

  const fetchAffcoFilter = async () => {
    await fetch(apiUrl + "api/Package/GeneratePICAffcoFilter", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken}`,
      },
    }).then((resp) => {
      if (resp.ok) {
        resp.json().then((valData) => {
          setAffco(
            valData.data.map((val, index) => {
              return {
                no: index + 1,
                id: val.vAffcoId,
                name: val.vAffcoName,
                category: val.vAffcoCategory,
                status: "Active",
              };
            })
          );
        });
      } else {
        navigate();
      }
    });
  };

  const fetchStep = () => {
    fetch(apiUrl + "api/WorkflowStep/getStep", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken}`,
      },
    }).then((resp) => {
      if (resp.ok) {
        resp.json().then((valData) => {
          const data = valData.data;
          setTemplate(
            data.filter((x) => x.bActive === true)
            .map((val, index) => {
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
      } else {
        navigate();
      }
    });
  };

  const fetchOpenPeriode = () => {
    fetch(apiUrl + "api/Setting/GetOpenPeriod", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken}`,
      },
    }).then((resp) => {
      if (resp.ok) {
        resp.json().then((data) => {
          setPMonth(data.data.iMonth);
          setPYear(data.data.iYear);
          setPSdate(dayjs(data.data.dStartDate));
          setPEdate(dayjs(data.data.dEndDate));
        });
      }
    });
  };

  React.useEffect(() => {
    fetchAffcoFilter();
    fetchStep();
    fetchOpenPeriode();

    if (parameter.get("magnet") !== null) {
      try {
        const urlParam = (parameter.get("magnet") || "").toString();
        const decode = atob(urlParam);
        const newParam = decode.split(",");

        setYear(newParam[0]);
        setMonth(newParam[1]);
        setUrlAffcoId(newParam[2]);
      } catch (error) {
        alert("url not found / invalid!");
        handleNavigate("/Approval");
      }
    } else {
      handleNavigate("/Approval");
    }
  }, []);

  const fetchGetPackage = () => {
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
      if (resp.ok) {
        setUrlAffcoId("");
        resp.json().then((valData) => {
          setDataHeader({
            vPackageId: valData.header.vPackageId,
            iMonth: valData.header.iMonth,
            iYear: valData.header.iYear,
            iStatus: valData.header.iStatus,
            vAffcoId: valData.header.vAffcoId,
          });

          if (valData.header.vPackageId !== "") {
            dataRespAffcoCons = valData.responseFile
              .filter((val) => val.vAttType === "RESPAFFCO")
              .map((val) => ({
                vStepId: val.vStepId,
                vAttchName: val.vAttchName,
                vAttType: val.vAttType,
                vRemark: val.vRemarks,
                fAttchContent: val.fAttchContent,
                version: val.iVersion,
              }));
            setDataAffco(
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
                  vAttachId: dtl.vAttchId,
                  stepName: dtl.vStepName,
                };
              })
            );
          } else {
            setDataAffco([]);
          }
        });
      } else {
        navigate();
      }
    });
  };

  const handleSubmitFilter = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (urlAffcoId !== "") {
      if (pMonth === month.toString() && pYear === year) {
        const now = dayjs().format("YYYY-MM-DD");
        const nowDate = dayjs(now);
        if (nowDate >= pSdate && nowDate <= pEdate) {
          setIsOpenPeriod(true);
        } else {
          setIsOpenPeriod(false);
        }
      } else {
        setIsOpenPeriod(false);
      }
      setStatus(true);
      fetchGetPackage();
    } else {
      if (year !== "" && vAffco !== undefined) {
        console.log("masuk ke kondisi ini");
        if (pMonth === month.toString() && pYear === year) {
          const now = dayjs().format("YYYY-MM-DD");
          const nowDate = dayjs(now);
          if (nowDate >= pSdate && nowDate <= pEdate) {
            setIsOpenPeriod(true);
          } else {
            setIsOpenPeriod(false);
          }
        } else {
          setIsOpenPeriod(false);
        }
        setStatus(true);
        fetchGetPackage();
      } else {
        if (year === "") {
          setHasErrorYear(true);
          setStatus(false);
        }
        if (vAffco === undefined) {
          setHasErrorAffco(true);
          setStatus(false);
        }
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

  const handleClickRevise = (data: number) => {
    setOpen(true);
    setIndex(data);
  };

  const handleClickReviseApproved = (data: number) => {
    setOpenApprove(true);
    setIndexApprove(data);
  };

  const handleClickApprove = (data: number) => {
    const date = dayjs(Date());
    const user = getUserId !== null ? getUserId : "";

    const updateData = {
      ...dataAffco[data],
      status: "Approve",
      dDueDate: "",
      apprRemarks: "",
      dApprover: date.format("YYYY-MM-DD"),
      vApprover: user,
    };
    const newDataAffco = [...dataAffco];
    newDataAffco[data] = updateData;
    setDataAffco(newDataAffco);
    const resData = dataResponse.filter(
      (x) => x.vStepId !== dataAffco[data].stepid
    );
    setDataResponse(resData);
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  function AddReviseDialog(props: IDialogProps) {
    const { open, onClose, data } = props;
    const [remark, setRemark] = React.useState("");
    const [duedate, setDueDate] = React.useState<Dayjs | null>(null);
    const [fRemark, setFRemark] = React.useState<string | File>("");
    const [vRemark, setVRemark] = React.useState("");

    console.log("data response : ", dataResponse);

    const handleFRemarkUpload = (event) => {
      setFRemark(event.target.files[0]);
      setVRemark(event.target.files[0].name);
    };

    const handleChangeRemark = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRemark(event.target.value);
    };

    const submitRevise = (data: number) => {
      if (remark !== "" && duedate !== null) {
        setOpen(false);
        setOpenApprove(false);
        const updateData = {
          ...dataAffco[data],
          status: "Revise",
          dDueDate: duedate ? duedate.format("YYYY-MM-DD HH:mm:ss") : "",
          apprRemarks: remark,
          dApprover: "",
          vApprover: "",
        };
        const newDataAffco = [...dataAffco];
        newDataAffco[data] = updateData;
        setDataAffco(newDataAffco);
        const resData = {
          vStepId: dataAffco[data].stepid,
          vAttchName: vRemark !== "" ? vRemark : "no file attach",
          vAttType: "",
          vRemark: remark,
          vAttchId: dataAffco[data].vAttachId,
          fAttchContent: fRemark,
        };
        setDataResponse((resp) => [...resp, resData]);
      } else {
        if (remark === "") {
          alert("remark must be filled!");
        }
        if (duedate === null) {
          alert("duedate must be filled!");
        }
      }
    };

    return (
      <Dialog onClose={onClose} open={open} fullWidth>
        <DialogTitle>Revise Confirmation</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Box>
            <FormControl fullWidth sx={{ margin: 1 }}>
              <Box>
                <FormLabel>
                  What needs to be revised from this document?{" "}
                </FormLabel>
                <FormLabel sx={{ color: "red" }}>*</FormLabel>
              </Box>

              <TextField
                multiline
                rows={5}
                value={remark}
                onChange={handleChangeRemark}
              />
            </FormControl>
            <FormControl fullWidth sx={{ margin: 1 }}>
              <Box>
                <FormLabel>Due Date </FormLabel>
                <FormLabel sx={{ color: "red" }}>*</FormLabel>
              </Box>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDateTimePicker
                  ampm={false}
                  orientation="landscape"
                  disablePast
                  value={duedate}
                  onChange={(newValue) => setDueDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                  format="DD-MMM-YYYY HH:mm:ss"
                />
              </LocalizationProvider>
            </FormControl>
            <FormControl fullWidth sx={{ margin: 1 }}>
              <FormLabel>Attach Supporting File : </FormLabel>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Upload file
                <VisuallyHiddenInput
                  type="file"
                  onChange={handleFRemarkUpload}
                />
              </Button>
            </FormControl>
            <FormControl fullWidth sx={{ margin: 1 }}>
              <FormLabel>
                {vRemark !== "" ? vRemark : "no file selected"}
              </FormLabel>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            variant="contained"
            onClick={() => submitRevise(data)}
            color="success"
            sx={{ margin: 1 }}
          >
            Add Revise
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={onClose}
            color="inherit"
          >
            Back
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  const submitApprovals = () => {
    setLoading(true);
    const dataForm = new FormData();

    dataForm.append("Header.vPackageId", dataHeader.vPackageId);
    dataForm.append("Header.iYear", dataHeader.iYear);
    dataForm.append("Header.iMonth", dataHeader.iMonth);
    dataForm.append("Header.iStatus", dataHeader.iStatus);
    dataForm.append("Header.vAffcoId", dataHeader.vAffcoId);

    dataAffco.map((val, index) => {
      return (
        dataForm.append(`Detail[${index}].vAttchId`, val.vAttachId),
        dataForm.append(`Detail[${index}].vStepId`, val.stepid),
        dataForm.append(`Detail[${index}].vApprover`, ""),
        dataForm.append(`Detail[${index}].dApprover`, ""),
        dataForm.append(`Detail[${index}].dDueDate`, val.dDueDate),
        dataForm.append(`Detail[${index}].vApprRemarks`, val.apprRemarks),
        dataForm.append(`Detail[${index}].vUsrRemarks`, val.userRemarks),
        dataForm.append(`Detail[${index}].vTemporalCode`, ""),
        dataForm.append(
          `Detail[${index}].vStatus`,
          val.status === "Revise"
            ? "R"
            : val.status === "Approve"
            ? "A"
            : val.status === "Revised"
            ? "R"
            : val.status === "Approved"
            ? "A"
            : "S"
        )
      );
    });

    if (dataResponse.length > 0) {
      dataResponse?.map((val, index) => {
        return (
          dataForm.append(`Response[${index}].vStepId`, val.vStepId),
          dataForm.append(`Response[${index}].vRemarks`, val.vRemark),
          dataForm.append(`Response[${index}].vAttchName`, val.vAttchName),
          dataForm.append(
            `Response[${index}].fAttchContent`,
            val.fAttchContent
          ),
          dataForm.append(`Response[${index}].vAttchId`, val.vAttchId)
        );
      });
    }

    fetch(apiUrl + "api/Package/SubmitPackage", {
      method: "POST",
      headers: {
        Authorization: `bearer ${getToken}`,
        Accept: "*/*",
      },
      body: dataForm,
    }).then((resp) => {
      if (resp.ok) {
        setLoading(false);
        setMessage("Approvals submitted.");
        setError(false);
        setOpenSnack(true);
        fetchGetPackage();
      } else {
        if (resp.status === 401) {
          alert("Your session has expired. Please login again.")
          navigate();
        } else {
          setLoading(false);
          setMessage("Error Code : "+ resp.status + " please contact your IT Administrator");
          setError(true);
          setOpenSnack(true);
          fetchGetPackage();
        }
      }
    });
  };
  React.useEffect(() => {
    if (urlAffcoId !== "") {
      console.log("bisa ke load");
      setVAffco(affco.filter((val) => val.id === urlAffcoId)[0]);
    }
  }, [urlAffcoId, affco]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
      }}
    >
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Filter Periode
        </AccordionSummary>

        <Divider />
        <AccordionDetails>
          <Box component="form" onSubmit={handleSubmitFilter}>
            <Stack direction={"row"}>
              <Item elevation={0}>
                <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
                  <InputLabel id="year">Select Periode Year</InputLabel>
                  <Select
                    labelId="year"
                    name="vYear"
                    value={year}
                    label="Select Periode Year"
                    onChange={handleChangeYear}
                    error={hasErrorYear}
                  >
                    {generateYears().map((val, index) => {
                      return (
                        <MenuItem key={index} value={val}>
                          {val}
                        </MenuItem>
                      );
                    })}
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
                  <InputLabel id="month">Select Periode Month</InputLabel>
                  <Select
                    labelId="month"
                    name="vMonth"
                    value={month}
                    label="Select Periode Month"
                    onChange={handleChangeMonth}
                    error={hasErrorMonth}
                  >
                    {generateMonths.map((val) => {
                      return (
                        <MenuItem key={val.id} value={val.id}>
                          {val.name}
                        </MenuItem>
                      );
                    })}
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
                  <Autocomplete
                    id="vAffco-autocomplete"
                    size="small"
                    isOptionEqualToValue={(option, value) => true}
                    value={
                      urlAffcoId === ""
                        ? vAffco
                        : affco.filter((val) => val.id === urlAffcoId)[0]
                    }
                    onChange={(event, newValue) => {
                      setUrlAffcoId("");

                      if (newValue === null) {
                        console.log("masuk ke null : ", status);
                        setHasErrorAffco(true);
                        setStatus(false);
                        setVAffco(newValue);
                      } else {
                        fetchGetPackage();
                        setHasErrorAffco(false);
                        setVAffco(newValue);
                      }
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
          {message && (
            <CustomSnackBar
              open={openSnack}
              onClose={() => {
                setOpenSnack(false);
              }}
              error={error}
              message={message}
            />
          )}
          {loading && (
            <Backdrop open={loading}>
              <CircularProgress color="inherit" />
            </Backdrop>
          )}
          <Stack direction={"column"}>
            <Item elevation={0}>
              {status === true && vAffco !== undefined ? (
                <Box sx={{ width: "100%" }}>
                  <Box sx={{ overflowX: "auto", overflowY: "hidden" }}>
                    <Stepper alternativeLabel activeStep={-1}>
                      {dataHeader?.vPackageId !== ""
                        ? dataAffco.map((value, index) => {
                            const iconProps: {
                              active?: boolean;
                              completed?: boolean;
                            } = {};
                            const labelProps: {
                              optional?: React.ReactNode;
                            } = {};
                            if (dataAffco.length > 0) {
                              if (dataAffco[index].status === "Submitted") {
                                iconProps.active = true;
                                labelProps.optional = (
                                  <Typography variant="caption" color="blue">
                                    Waiting for Approval
                                  </Typography>
                                );
                              } else {
                                if (dataAffco[index].status === "Revised") {
                                  iconProps.completed = true;
                                  labelProps.optional = (
                                    <Typography variant="caption" color="red">
                                      Revised
                                    </Typography>
                                  );
                                } else if (
                                  dataAffco[index].status === "Approved"
                                ) {
                                  iconProps.completed = true;
                                  labelProps.optional = (
                                    <Typography variant="caption" color="green">
                                      Approved
                                    </Typography>
                                  );
                                } else {
                                  iconProps.active = true;
                                  labelProps.optional = (
                                    <Typography variant="caption" color="blue">
                                      Waiting for Approval
                                    </Typography>
                                  );
                                }
                              }
                            }
                            return (
                              <Step
                                key={value.stepid}
                                {...iconProps}
                                sx={
                                  dataAffco.length > 0
                                    ? dataAffco[index].status === "Approved"
                                      ? {
                                          "& .Mui-completed": {
                                            color: "green",
                                          },
                                        }
                                      : { "& .Mui-completed": { color: "red" } }
                                    : null
                                }
                              >
                                <StepLabel
                                  {...labelProps}
                                  sx={{
                                    "& .MuiStepLabel-alternativeLabel": {
                                      color: "black",
                                    },
                                  }}
                                >
                                  {value.stepName}
                                </StepLabel>
                              </Step>
                            );
                          })
                        : template
                            .filter(
                              (val) =>
                                val.category === vAffco?.category ||
                                val.category === "All"
                            )
                            .map((value, index) => {
                              return (
                                <Step key={value.name}>
                                  <StepLabel>{value.name}</StepLabel>
                                </Step>
                              );
                            })}
                    </Stepper>
                  </Box>
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
                        data={dataAffco.filter(
                          (v) =>
                            v.status === "Submitted" ||
                            v.status === "Revise" ||
                            v.status === "Approve"
                        )}
                        enableRowActions
                        enableRowSelection
                        renderBottomToolbarCustomActions={({ table }) => {
                          const handleDownloadFile = () => {
                            const csv =                            table
                              .getSelectedRowModel()
                              .flatRows.map((row) => {
                                return row.original.vAttachId

                              });

                              const vAttachId = btoa(csv.toString())
                              window.open(
                                apiUrl +
                              `api/Package/MultidownloadPackage?vAttachId=${vAttachId}`
                              )
                          };
                          const countRevApp = dataAffco.filter(
                            (v) =>
                              v.status === "Revise" || v.status === "Approve"
                          ).length;
                          return (
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              <Button
                                color="success"
                                variant="contained"
                                disabled={
                                  isOpenPeriod &&
                                  countRevApp !== 0 &&
                                  dataHeader?.vPackageId !== ""
                                    ? false
                                    : true
                                }
                                onClick={submitApprovals}
                              >
                                Submit Approval
                              </Button>
                              {table.getIsSomeRowsSelected() ? (
                                <Button
                                  variant="contained"
                                  color="inherit"
                                  onClick={handleDownloadFile}
                                >
                                  Download selected files
                                </Button>
                              ) : table.getIsAllRowsSelected() ? (
                                <Button
                                  variant="contained"
                                  color="inherit"
                                  onClick={handleDownloadFile}
                                >
                                  Download all files
                                </Button>
                              ) : (
                                <Button
                                  variant="contained"
                                  color="inherit"
                                  disabled
                                >
                                  Download selected files
                                </Button>
                              )}
                            </div>
                          );
                        }}
                        renderRowActions={({ row }) => (
                          <Stack direction={"row"}>
                            <Button
                              size="small"
                              sx={{ margin: 1 }}
                              variant="contained"
                              color="warning"
                              onClick={() => {
                                const index = dataAffco.findIndex(
                                  (val) => val.stepid === row.original.stepid
                                );

                                handleClickRevise(index);
                              }}
                            >
                              <AssignmentReturn />
                            </Button>
                            <Button
                              size="small"
                              sx={{ margin: 1 }}
                              variant="contained"
                              color="success"
                              onClick={() => {
                                const index = dataAffco.findIndex(
                                  (val) => val.stepid === row.original.stepid
                                );
                                handleClickApprove(index);
                              }}
                            >
                              <AssignmentTurnedIn />
                            </Button>
                          </Stack>
                        )}
                        positionActionsColumn="last"
                      />
                      <AddReviseDialog
                        onClose={() => setOpen(false)}
                        open={open}
                        data={index}
                      />
                    </Box>
                  </CustomTabs>
                  <CustomTabs value={tab} index={1}>
                    <Box>
                      <MaterialReactTable
                        columns={columnRevised}
                        data={dataAffco.filter((v) => v.status === "Revised")}
                      />
                    </Box>
                  </CustomTabs>
                  <CustomTabs value={tab} index={2}>
                    <Box>
                      <MaterialReactTable
                        columns={columnApproved}
                        data={dataAffco.filter((v) => v.status === "Approved")}
                        enableRowActions
                        enableRowSelection
                        renderBottomToolbarCustomActions={({ table }) => {
                          const handleDownloadFile = () => {
                            const csv =                            table
                              .getSelectedRowModel()
                              .flatRows.map((row) => {
                                return row.original.vAttachId

                              });

                              const vAttachId = btoa(csv.toString())
                              window.open(
                                apiUrl +
                              `api/Package/MultidownloadPackage?vAttachId=${vAttachId}`
                              )
                          }
                          return (
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              {table.getIsSomeRowsSelected() ? (
                                <Button variant="contained" color="inherit" onClick={handleDownloadFile}>
                                  download selected files
                                </Button>
                              ) : table.getIsAllRowsSelected() ? (
                                <Button variant="contained" color="inherit" onClick={handleDownloadFile}>
                                  download all files
                                </Button>
                              ) : (
                                <Button
                                  variant="contained"
                                  color="inherit"
                                  disabled
                                >
                                  download selected files
                                </Button>
                              )}
                            </div>
                          );
                        }}
                        renderRowActions={({ row }) => (
                          <Stack direction={"row"}>
                            <Button
                              size="small"
                              sx={{ margin: 1 }}
                              variant="contained"
                              color="warning"
                              onClick={() => {
                                const index = dataAffco.findIndex(
                                  (val) => val.stepid === row.original.stepid
                                );

                                handleClickReviseApproved(index);
                              }}
                            >
                              <AssignmentReturn />
                            </Button>
                          </Stack>
                        )}
                        positionActionsColumn="last"
                      />
                      <AddReviseDialog
                        onClose={() => setOpenApprove(false)}
                        open={openApprove}
                        data={indexApprove}
                      />
                    </Box>
                  </CustomTabs>
                </Box>
              ) : (
                <h1>
                  {(status === true && vAffco === null) ||
                  (status === false && vAffco === null)
                    ? "Select Affiliate Company to show data"
                    : "Click filter to show data"}
                </h1>
              )}
            </Item>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
