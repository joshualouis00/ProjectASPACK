import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  Box,
  Button,
  CircularProgress,
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
  StepButton,
  Stepper,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import { styled } from "@mui/material/styles";
import { MaterialReactTable } from "material-react-table";
import { useDropzone } from "react-dropzone";
import {
  apiUrl,
  CustomSnackBar,
  generateMonths,
  generateYears,
  getToken,
} from "../Component/TemplateUrl";
import {
  columnHistoryUpload,
  respsAffco,
} from "../Component/TableComponent/ColumnDef/IColumnUpload";
import {
  IStepProps,
  ITempFile,
  IHeaderProps,
  IRespFile,
} from "../Component/Interface/DataUpload";
import { getUserId } from "../Component/TemplateUrl";
import { format } from "date-fns";
import dayjs, { Dayjs } from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";

export let dataRespAffco: IRespFile[] = [];
export let dataCountRevise: IStepProps[] = [];

export default function AffcoUpload() {
  const dataMonth = new Date().getMonth();
  const dataYear = new Date().getFullYear();
  const [dataFile, setDataFile] = React.useState<IStepProps[]>([]);
  const [tempData, setTempData] = React.useState<IStepProps[]>([]);
  const [submitData, setSubmitData] = React.useState<IStepProps[]>([]);
  const [stepData, setStepData] = React.useState("");
  const [stepDesc, setStepDesc] = React.useState<string | undefined>("");
  const [dataStep, setDataStep] = React.useState([
    {
      id: 100,
      label: "loading",
      desc: "loading",
      fileType: "both",
    },
  ]);
  const [tempFile, setTempFile] = React.useState<ITempFile[]>([]);
  const [respFile, setRespFile] = React.useState<IRespFile[]>([]);
  const [dataHeader, setDataHeader] = React.useState<IHeaderProps>({
    iMonth: "",
    iYear: "",
    iStatus: "",
    vAffcoId: "",
    vPackageId: "",
  });
  const [filter, setFilter] = React.useState(false);
  const [index, setIndex] = React.useState<number>(-1);
  const [allowUpload, setAllowUpload] = React.useState(false);
  const [pMonth, setPMonth] = React.useState("");
  const [pYear, setPYear] = React.useState("");
  const [pSdate, setPSdate] = React.useState<Dayjs>(dayjs());
  const [pEdate, setPEdate] = React.useState<Dayjs>(dayjs());
  const [isOpenPeriod, setIsOpenPeriod] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [openSnack, setOpenSnack] = React.useState(false);
  const [error, setError] = React.useState(false);

  const location = useLocation();
  const parameter = new URLSearchParams(location.search);

  const handleNavigate = useNavigate();

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
    fetchOpenPeriode();
    if (parameter.get("magnet") !== null) {
      try {
        const urlParam = (parameter.get("magnet") || "").toString();
        const decode = atob(urlParam);
        const newParam = decode.split(",");

        setYear(newParam[0]);
        setMonth(newParam[1]);
      } catch (error) {
        alert("url not found / invalid!");
        handleNavigate("/AffcoUpload");
      }
    } else {
      handleNavigate("/AffcoUpload");
    }
  }, []);

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      let validFileType = dataStep.filter((v) => v.label === stepData);
      if (validFileType.length > 0) {
        let validExt =
          validFileType[0].fileType === "PDF"
            ? ["application/pdf"]
            : validFileType[0].fileType === "Excel"
            ? [
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "application/vnd.ms-excel",
                "application/vnd.ms-excel.sheet.macroEnabled.12"
              ]
            : [
                "application/pdf",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "application/vnd.ms-excel",
                "application/vnd.ms-excel.sheet.macroEnabled.12"
              ];

        let invalidExt = acceptedFiles.filter(
          (file) => !validExt.includes(file.type)
        );

        if (invalidExt.length > 0) {
          let msg =
            validFileType[0].fileType === "PDF"
              ? "PDF"
              : validFileType[0].fileType === "Excel"
              ? "Excel"
              : "Pdf & Excel";
          setMessage(`Invalid file type! allowed file type only : ${msg}`);
          setOpenSnack(true);
          setError(true);
        } else {
          if (acceptedFiles.length > 1) {
            setMessage("Max upload file : 1");
            setOpenSnack(true);
            setError(true);
          } else {
            var randomstring = require("randomstring");

            const tempCode = randomstring.generate({
              length: 7,
              charset: "alphabetic",
            });
            const files: IStepProps[] = acceptedFiles.map((val) => ({
              filename: val.name,
              createDate: format(Date(), "yyyy-MM-dd"),
              createBy: getUserId,
              docVersion: "draft",
              status: "Draft",
              stepid: stepData,
              dApprover: "",
              dDueDate: "",
              apprRemarks: "",
              userRemarks: "",
              vTempCode: tempCode,
              vApprover: "",
              vAttachId: "",
            }));

            const temFiles: ITempFile[] = acceptedFiles.map((val) => ({
              vAttchName: val.name,
              vRemarks: "",
              vAttchId: "",
              vTempCode: tempCode,
              dtlFIle: val,
            }));

            if (dataHeader?.vPackageId !== "" && index > -1) {
              const newData = {
                ...submitData[index],
                status: "Submitted",
                filename: acceptedFiles[0].name,
                vTempCode: tempCode,
                dApprover: "",
                dDueDate: "",
                apprRemarks: "",
                userRemarks: "",
                vApprover: "",
              };
              const newSubmitData = [...submitData];
              newSubmitData[index] = newData;
              setSubmitData(newSubmitData);
              setAllowUpload(false);
            }

            setDataFile((prev) => [...files, ...prev]);
            setTempFile((prevFile) => [...prevFile, ...temFiles]);
            setRespFile(respsAffco);
          }
        }
      }
    },
    [stepData, dataHeader?.vPackageId, index, submitData, dataStep]
  );

  const [month, setMonth] = React.useState((dataMonth + 1).toString());
  const [year, setYear] = React.useState(dataYear.toString());
  const [hasErrorMonth, setHasErrorMonth] = React.useState(false);
  const [hasErrorYear, setHasErrorYear] = React.useState(false);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  const [activeStep, setActiveStep] = React.useState(-1);
  const [completed, setCompleted] = React.useState<{ [k: number]: boolean }>(
    {}
  );

  const [loading, setLoading] = React.useState(false);

  const steps = dataStep;

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleStep =
    (step: number, stepName: string, stepDescription: string | undefined) =>
    () => {
      setActiveStep(step);
      setStepData(stepName);
      setStepDesc(stepDescription);

      const testindex = submitData.filter(
        (c) => c.status === "Revised" && c.stepid === stepName
      );
      if (testindex.length > 0) {
        const index = submitData.findIndex((x) => x.stepid === stepName);
        setIndex(index);
      }
      const countRevise = dataFile.filter(
        (x) => x.status === "Revised" && x.stepid === stepName
      );
      const isDraft = dataFile.filter(
        (x) => x.status === "Draft" && x.stepid === stepName
      );
      const isApproved = dataFile.filter(
        (x) => x.status === "Approved" && x.stepid === stepName
      );
      const isSubmitted = dataFile.filter(
        (x) => x.status === "Submitted" && x.stepid === stepName
      );
      if (
        dataHeader?.vPackageId !== "" &&
        countRevise.length > 0 &&
        isDraft.length < 1 &&
        isApproved.length === 0 &&
        isSubmitted.length === 0
      ) {
        setAllowUpload(true);
      } else {
        setAllowUpload(false);
      }
    };

  const handleChangeMonth = (event: SelectChangeEvent) => {
    setMonth(event.target.value);
    setHasErrorMonth(false);
  };

  const handleChangeYear = (event: SelectChangeEvent) => {
    setYear(event.target.value as string);
    setHasErrorYear(false);
  };

  const handleSubmitFilter = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActiveStep(-1);
    setStepData("");

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

    setTempData([]);
    fetch(apiUrl + "api/WorkflowStep/getStep", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken}`,
      },
    }).then((resp) => {
      resp.json().then((valData) => {
        setDataStep(
          valData.data
            .filter((x) => x.bActive === true)
            .map((val, index) => {
              return {
                id: index,
                label: val.vStepId,
                desc: val.vStepDesc,
                fileType: val.vAttType,
              };
            })
        );
      });
    });
    fetch(
      apiUrl +
        "api/Package/getPackage?nYear=" +
        year +
        "&nMonth=" +
        month +
        "&vAffcoId=",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken}`,
        },
      }
    ).then((resp) => {
      resp.json().then((valData) => {
        dataRespAffco = valData.responseFile
          .filter((val) => val.vAttType === "RESPAFFCO")
          .map((val) => ({
            vStepId: val.vStepId,
            vAttchName: val.vAttchName,
            vAttType: val.vAttType,
            vRemark: val.vRemarks,
            fAttchContent: val.fAttchContent,
            version: val.iVersion,
          }));

        if (valData.header.vPackageId !== "") {
          valData.detail.map((dtl) => {
            return dtl.fPackageFile.map((fp, index) =>
              tempData.push({
                filename: fp.vAttchName,
                createDate: fp.dCrea,
                createBy: fp.vCrea,
                docVersion: "V" + (dtl.fPackageFile.length - index),
                status:
                  dtl.vStatus === "S" && index === 0
                    ? "Submitted"
                    : dtl.vStatus === "S" && index !== 0
                    ? "Revised"
                    : dtl.vStatus === "A" && index === 0
                    ? "Approved"
                    : dtl.vStatus === "A" && index !== 0
                    ? "Revised"
                    : dtl.vStatus === "R"
                    ? "Revised"
                    : "",
                stepid: dtl.vStepId,
                dApprover: dtl.dApprover,
                dDueDate: dtl.dDueDate,
                apprRemarks: fp.vRemarks,
                userRemarks: dtl.vUsrRemarks,
                vTempCode: dtl.vTemporalCode,
                vAttachId: dtl.vAttchId,
                stepName: dtl.vStepName,
              } as IStepProps)
            );
          });

          setDataFile(tempData);
          setSubmitData(
            valData.detail.map((dtl) => {
              return {
                filename:
                  dtl.fPackageFile.length > 0
                    ? dtl.fPackageFile[0].vAttchName
                    : "",
                createDate:
                  dtl.fPackageFile.length > 0 ? dtl.fPackageFile[0].dCrea : "",
                createBy:
                  dtl.fPackageFile.length > 0 ? dtl.fPackageFile[0].vCrea : "",
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

          dataCountRevise = valData.detail.map((dtl) => {
            return {
              filename:
                dtl.fPackageFile.length > 0
                  ? dtl.fPackageFile[0].vAttchName
                  : "",
              createDate:
                dtl.fPackageFile.length > 0 ? dtl.fPackageFile[0].dCrea : "",
              createBy:
                dtl.fPackageFile.length > 0 ? dtl.fPackageFile[0].vCrea : "",
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
          });
        } else {
          setDataFile([]);
        }

        setDataHeader({
          vPackageId: valData.header.vPackageId,
          iMonth: valData.header.iMonth,
          iYear: valData.header.iYear,
          iStatus: valData.header.iStatus,
          vAffcoId: valData.header.vAffcoId,
        });
      });
    });

    setFilter(true);
  };

  const handleSubmitFiles = () => {
    const dataForm = new FormData();
    setLoading(true);

    const packId = dataHeader?.vPackageId !== "" ? dataHeader?.vPackageId : "";
    dataForm.append("Header.vPackageId", packId);
    dataForm.append("Header.iYear", year);
    dataForm.append("Header.iMonth", month);
    dataForm.append("Header.iStatus", "");
    dataForm.append("Header.vAffcoId", dataHeader?.vAffcoId);

    if (dataHeader?.vPackageId !== "") {
      submitData.map((val, index) => {
        return (
          dataForm.append(`Detail[${index}].vAttchId`, val.vAttachId),
          dataForm.append(`Detail[${index}].vStepId`, val.stepid),
          dataForm.append(`Detail[${index}].vApprover`, ""),
          dataForm.append(`Detail[${index}].dApprover`, ""),
          dataForm.append(`Detail[${index}].dDueDate`, ""),
          dataForm.append(
            `Detail[${index}].vStatus`,
            val.status === "Approved" ? "A" : "S"
          ),
          dataForm.append(`Detail[${index}].vApprRemarks`, ""),
          dataForm.append(`Detail[${index}].vUsrRemarks`, ""),
          dataForm.append(`Detail[${index}].vTemporalCode`, val.vTempCode)
        );
      });
    } else {
      dataFile
        .filter((x) => x.status === "Draft")
        .map((val, index) => {
          return (
            dataForm.append(`Detail[${index}].vAttchId`, val.vAttachId),
            dataForm.append(`Detail[${index}].vStepId`, val.stepid),
            dataForm.append(`Detail[${index}].vApprover`, val.vApprover),
            dataForm.append(`Detail[${index}].dApprover`, val.dApprover),
            dataForm.append(`Detail[${index}].dDueDate`, val.dDueDate),
            dataForm.append(
              `Detail[${index}].vStatus`,
              val.status === "Approved" ? "A" : "S"
            ),
            dataForm.append(`Detail[${index}].vApprRemarks`, val.apprRemarks),
            dataForm.append(`Detail[${index}].vUsrRemarks`, val.userRemarks),
            dataForm.append(`Detail[${index}].vTemporalCode`, val.vTempCode)
          );
        });
    }

    if (tempFile.length > 0) {
      tempFile.map((val, index) => {
        return (
          dataForm.append(`DtlAttach[${index}].vAttchName`, val.vAttchName),
          dataForm.append(`DtlAttach[${index}].vRemarks`, val.vRemarks),
          dataForm.append(
            `DtlAttach[${index}].vAttchId`,
            dataHeader?.vPackageId !== "" ? val.vAttchId : ""
          ),
          dataForm.append(`DtlAttach[${index}].vTemporalCode`, val.vTempCode),
          dataForm.append(`DtlAttach[${index}].fAttchContent`, val.dtlFIle)
        );
      });
    }

    if (respFile.length > 0) {
      respFile.map((val, index) => {
        return (
          dataForm.append(`Response[${index}].vStepId`, val.vStepId),
          dataForm.append(`Response[${index}].vAttchName`, val.vAttchName),
          dataForm.append(`Response[${index}].vRemarks`, val.vRemark),
          dataForm.append(`Response[${index}].vAttchId`, val.vAttchId),
          dataForm.append(`Response[${index}].fAttchContent`, val.fAttchContent)
        );
      });
    } else {
      const countRevised = dataCountRevise.filter(
        (val) => val.status === "Revised"
      );

      countRevised.map((val, index) => {
        return (
          dataForm.append(`Response[${index}].vStepId`, val.stepid),
          dataForm.append(
            `Response[${index}].vAttchName`,
            "no file attachment"
          ),
          dataForm.append(
            `Response[${index}].vRemarks`,
            "no response from affco"
          ),
          dataForm.append(`Response[${index}].vAttchId`, val.vAttachId),
          dataForm.append(
            `Response[${index}].fAttchContent`,
            "no file attachment"
          )
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
        alert("success submit approvals");
        window.location.reload();
      } else {
        alert("something wrong : " + resp.status);
      }
    });
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "left",
    color: theme.palette.text.secondary,
  }));

  const handleDownloadTemplate = (stepid: string) => () => {
    window.open(apiUrl + "api/Package/DownloadTemplate?vStepId=" + stepid);
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
                  <InputLabel id="year">Select Periode Year</InputLabel>
                  <Select
                    labelId="year"
                    name="vYear"
                    value={year}
                    label="Select Periode Year"
                    onChange={handleChangeYear}
                  >
                    {generateYears().map((val, index) => {
                      return (
                        <MenuItem key={index} value={val}>
                          {val}
                        </MenuItem>
                      );
                    })}
                  </Select>
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
          Upload Aspack
        </AccordionSummary>
        {message && (
          <CustomSnackBar
            open={openSnack}
            message={message}
            onClose={() => {
              setOpenSnack(false);
            }}
            error={error}
          />
        )}
        {loading && (
          <Backdrop open={loading}>
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
        <Divider />
        <AccordionDetails>
          {filter ? (
            <Stack direction={"column"}>
              <Item elevation={0}>
                <Stepper nonLinear activeStep={activeStep} alternativeLabel>
                  {dataHeader.vPackageId !== ""
                    ? dataFile
                        .reduce((acc: IStepProps[], current) => {
                          const x = acc.find(
                            (item) => item.stepid === current.stepid
                          );
                          if (!x) {
                            return acc.concat([current]);
                          } else {
                            return acc;
                          }
                        }, [])

                        .map((val, index) => {
                          const iconProps: {
                            active?: boolean;
                            completed?: boolean;
                          } = {};
                          const labelProps: {
                            optional?: React.ReactNode;
                          } = {};
                          if (val.status === "Submitted") {
                            iconProps.active = true;
                            labelProps.optional = (
                              <Typography variant="caption" color="blue">
                                Waiting for Approval
                              </Typography>
                            );
                          } else {
                            if (val.status === "Revised") {
                              iconProps.completed = true;
                              labelProps.optional = (
                                <Typography variant="caption" color="red">
                                  Revised
                                </Typography>
                              );
                            } else if (val.status === "Approved") {
                              iconProps.completed = true;
                              labelProps.optional = (
                                <Typography variant="caption" color="green">
                                  Approved
                                </Typography>
                              );
                            } else {
                              iconProps.completed = true;
                              labelProps.optional = (
                                <Typography variant="caption" color="blue">
                                  Draft
                                </Typography>
                              );
                            }
                          }
                          return (
                            <Step
                              key={val.stepid}
                              {...iconProps}
                              sx={
                                val.status === "Approved"
                                  ? { "& .Mui-completed": { color: "green" } }
                                  : { "& .Mui-completed": { color: "red" } }
                              }
                            >
                              <StepButton
                                color="inherit"
                                onClick={handleStep(
                                  index,
                                  val.stepid,
                                  val.stepName
                                )}
                                {...labelProps}
                              >
                                {val.stepName}
                              </StepButton>
                            </Step>
                          );
                        })
                    : steps.map((label, index) => (
                        <Step key={label.id} completed={completed[index]}>
                          <StepButton
                            color="inherit"
                            onClick={handleStep(index, label.label, label.desc)}
                          >
                            {label.desc}
                          </StepButton>
                        </Step>
                      ))}
                </Stepper>
              </Item>
              {isOpenPeriod &&
              stepData !== "" &&
              dataHeader?.vPackageId === "" ? (
                <Box
                  {...getRootProps()}
                  sx={{
                    border: "0.5px dashed #ccc",
                    borderRadius: "4px",
                    padding: "20px",
                    height: "200px",
                    textAlign: "center",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <input {...getInputProps()} />
                  <Typography color="textSecondary" sx={{ fontSize: "10px" }}>
                    Drag 'n' drop some files here, or click to select files
                  </Typography>
                </Box>
              ) : isOpenPeriod &&
                stepData !== "" &&
                dataHeader?.vPackageId !== "" &&
                allowUpload ? (
                <Box
                  {...getRootProps()}
                  sx={{
                    border: "0.5px dashed #ccc",
                    borderRadius: "4px",
                    padding: "20px",
                    height: "200px",
                    textAlign: "center",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <input {...getInputProps()} />
                  <Typography color="textSecondary" sx={{ fontSize: "10px" }}>
                    Drag 'n' drop some files here, or click to select files
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    border: "0.5px dashed #ccc",
                    borderRadius: "4px",
                    padding: "20px",
                    height: "200px",
                    textAlign: "center",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <input {...getInputProps()} />
                  <Typography color="textSecondary" sx={{ fontSize: "10px" }}>
                    {dataHeader?.vPackageId !== "" &&
                    submitData.length ===
                      submitData.filter((x) => x.status === "Approved").length
                      ? "All Aspack Approved"
                      : stepData !== "" && !allowUpload
                      ? "upload disabled"
                      : !isOpenPeriod
                      ? "Close Period for upload"
                      : "Select Step for upload"}
                  </Typography>
                </Box>
              )}
              <Item elevation={0}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ float: "right" }}
                  onClick={handleDownloadTemplate(stepData)}
                  disabled={stepData === "" ? true : false}
                >
                  Download Template
                </Button>
              </Item>

              <Item elevation={0}>
                {allStepsCompleted() ? (
                  <Box></Box>
                ) : (
                  <Box>
                    <Stack direction={"column"}>
                      <Item elevation={0}>
                        <Typography sx={{ marginBottom: 1 }}>
                          {stepData !== "" ? "History " + stepDesc : null}
                        </Typography>
                        <MaterialReactTable
                          columns={columnHistoryUpload}
                          data={dataFile.filter((v) => v.stepid === stepData)}
                          renderBottomToolbarCustomActions={() => {
                            const dataCount = dataFile.reduce(
                              (acc: IStepProps[], current) => {
                                const x = acc.find(
                                  (item) => item.stepid === current.stepid
                                );
                                if (!x) {
                                  return acc.concat([current]);
                                } else {
                                  return acc;
                                }
                              },
                              []
                            ).length;                            

                            const countStep = dataStep?.length;
                            const countRevise = dataFile
                              .reduce((acc: IStepProps[], current) => {
                                const x = acc.find(
                                  (item) => item.stepid === current.stepid
                                );
                                if (!x) {
                                  return acc.concat([current]);
                                } else {
                                  return acc;
                                }
                              }, [])
                              .filter((v) => v.status === "Revised").length;
                            const countDraft = dataFile
                              .reduce((acc: IStepProps[], current) => {
                                const x = acc.find(
                                  (item) => item.stepid === current.stepid
                                );
                                if (!x) {
                                  return acc.concat([current]);
                                } else {
                                  return acc;
                                }
                              }, [])
                              .filter((v) => v.status === "Draft").length;

                            const countApproved = dataFile.filter(
                              (v) =>
                                v.status === "Approved" && v.stepid === stepData
                            ).length;

                            console.log("count revise: ", countRevise);
                            console.log("count draft : ", countDraft);
                            

                            return (
                              <Button
                                variant="contained"
                                disabled={
                                  isOpenPeriod &&
                                  dataHeader?.vPackageId === "" &&
                                  dataCount === countStep
                                    ? false
                                    : isOpenPeriod &&
                                      dataHeader?.vPackageId !== "" &&
                                      countDraft > 0 &&
                                      countRevise === 0 &&
                                      countDraft > countRevise
                                    ? false
                                    : true
                                }
                                onClick={handleSubmitFiles}
                              >
                                Submit Files
                              </Button>
                            );
                          }}
                        />
                      </Item>
                    </Stack>
                  </Box>
                )}
              </Item>
            </Stack>
          ) : (
            <Box>
              <Typography>clik filter to show data</Typography>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
